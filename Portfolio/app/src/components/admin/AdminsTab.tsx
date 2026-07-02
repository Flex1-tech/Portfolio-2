import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAdminUsers, createAdminUser, deleteAdminUser } from '@/services/api';
import type { AdminUser } from '@/services/api';

export default function AdminsTab() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  const loadAdmins = async () => {
    try {
      const data = await getAdminUsers();
      setAdmins(data);
    } catch (err) {
      console.error('Failed to load admin users:', err);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        email: formData.email.trim() || undefined,
      };
      const result = await createAdminUser(payload);
      if (result) {
        setIsCreateDialogOpen(false);
        setFormData({ username: '', password: '', email: '' });
        loadAdmins();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible de créer l\'administrateur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer ce compte administrateur ?')) {
      try {
        const success = await deleteAdminUser(id);
        if (success) {
          loadAdmins();
        }
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression de l\'administrateur');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#F5F5F5]">Administrateurs ({admins.length})</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#F5F5F5]">
              Ajouter un Administrateur
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvel Administrateur</DialogTitle>
            </DialogHeader>
            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 rounded text-sm font-medium">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                  placeholder="ex: admin_john"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail (facultatif)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                  placeholder="ex: john@domain.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                  placeholder="6 caractères min."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] disabled:opacity-50">
                {isSubmitting ? "Création en cours..." : "Créer l'Administrateur"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-[#2A2A2A] rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1A1A1A]">
            <TableRow>
              <TableHead className="text-[#F5F5F5]">Nom d'utilisateur</TableHead>
              <TableHead className="text-[#F5F5F5]">E-mail</TableHead>
              <TableHead className="text-[#F5F5F5]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((adm) => (
              <TableRow key={adm.id} className="border-[#2A2A2A]">
                <TableCell className="text-[#CFCFCF] font-mono">{adm.username}</TableCell>
                <TableCell className="text-[#CFCFCF]">{adm.email || <span className="text-gray-600 italic">Non renseigné</span>}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(adm.id)}
                    disabled={adm.id === 1}
                    className={`border-red-900 text-red-400 hover:bg-red-900/20 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed`}
                    title={adm.id === 1 ? "L'administrateur principal ne peut pas être supprimé" : "Supprimer cet administrateur"}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
