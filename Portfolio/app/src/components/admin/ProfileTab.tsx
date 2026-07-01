import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, updateProfile } from '@/services/api';
import type { ProfileSettings } from '@/services/api';

const FIELD_CONFIG: { key: keyof ProfileSettings; label: string; type: 'input' | 'textarea'; placeholder?: string }[] = [
  { key: 'username',             label: 'Nom complet',           type: 'input',    placeholder: 'Seth N. AKPLOGAN' },
  { key: 'hero_label',           label: 'Label héro (mono)',      type: 'input',    placeholder: 'IFRI — UNIVERSITÉ D\'ABOMEY-CALAVI' },
  { key: 'hero_title',           label: 'Titre héro',             type: 'input',    placeholder: 'Étudiant en IA & Data Scientist' },
  { key: 'hero_punchline',       label: 'Accroche héro',          type: 'textarea', placeholder: 'Building reliable and intelligent software...' },
  { key: 'hero_bio',             label: 'Biographie (À propos)',  type: 'textarea', placeholder: 'Second-year student in Artificial Intelligence...' },
  { key: 'citation_text',        label: 'Citation',               type: 'input',    placeholder: 'La simplicité est la sophistication suprême.' },
  { key: 'citation_author',      label: 'Auteur de la citation',  type: 'input',    placeholder: 'Léonard de Vinci' },
  { key: 'academic_status',      label: 'Diplôme (mono)',         type: 'input',    placeholder: 'LICENCE IN ARTIFICIAL INTELLIGENCE' },
  { key: 'academic_institution', label: 'Établissement',          type: 'input',    placeholder: 'IFRI — Université d\'Abomey-Calavi' },
  { key: 'academic_period',      label: 'Période académique',     type: 'input',    placeholder: '2024 – Present | 2nd Year' },
];

export default function ProfileTab() {
  const [settings, setSettings] = useState<ProfileSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then(setSettings)
      .catch(() => setError('Impossible de charger les paramètres.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof ProfileSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await updateProfile(settings);
      if (result) {
        setSettings(result);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('La sauvegarde a échoué. Vérifiez votre connexion.');
      }
    } catch {
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#737373]">
        Chargement des paramètres…
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-[#F5F5F5]">Profil & Paramètres</h2>
        <p className="text-sm text-[#737373] mt-1">
          Ces champs alimentent directement les textes de la page d'accueil.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {FIELD_CONFIG.map(({ key, label, type, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={`profile-${key}`} className="text-[#CFCFCF] text-sm font-medium">
              {label}
            </Label>
            {type === 'textarea' ? (
              <Textarea
                id={`profile-${key}`}
                value={settings[key] ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#4A4A4A] focus:border-[#B5423F] resize-y"
              />
            ) : (
              <Input
                id={`profile-${key}`}
                value={settings[key] ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#4A4A4A] focus:border-[#B5423F]"
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#B5423F] hover:bg-[#C94F4B] text-white px-8"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
          {saved && (
            <span className="text-sm text-emerald-400 flex items-center gap-1.5">
              ✓ Modifications sauvegardées
            </span>
          )}
          {error && (
            <span className="text-sm text-red-400">{error}</span>
          )}
        </div>
      </form>
    </div>
  );
}
