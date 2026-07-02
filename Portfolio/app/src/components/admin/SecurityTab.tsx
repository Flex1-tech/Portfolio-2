import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateAdminPassword } from '@/services/api';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validations
    if (newPassword.length < 8) {
      setErrorMsg("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateAdminPassword(currentPassword, newPassword);
      if (success) {
        setSuccessMsg("Votre mot de passe a été mis à jour avec succès.");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible de mettre à jour le mot de passe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4">
        <div className="p-2 rounded-lg bg-red-950/40 text-[#B5423F]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#F5F5F5]">Sécurité du Compte</h2>
          <p className="text-xs text-[#737373]">Mettez à jour vos identifiants d'accès administrateur de manière sécurisée.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex gap-2.5 p-4 bg-red-950/50 border border-red-800 text-red-200 rounded-lg text-sm font-medium items-center">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex gap-2.5 p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-200 rounded-lg text-sm font-medium items-center animate-fade-in">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Mot de passe actuel</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F5F5]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">Nouveau mot de passe</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F5F5]"
          />
          <p className="text-[10px] text-[#737373]">Le mot de passe doit comporter au moins 8 caractères.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F5F5]"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#B5423F] hover:bg-[#C94F4B] text-white transition-all font-medium py-2.5"
        >
          {isSubmitting ? "Mise à jour..." : "Modifier mon mot de passe"}
        </Button>
      </form>
    </div>
  );
}
