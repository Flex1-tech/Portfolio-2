import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Certification } from '@/services/api';
import { createCertification, updateCertification, deleteCertification } from '@/services/api';

interface CertificationsTabProps {
  certifications: Certification[];
  onRefresh: () => void;
}

export default function CertificationsTab({ certifications, onRefresh }: CertificationsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    title: '',
    status: 'completed' as 'in_progress' | 'completed',
    credential_url: '',
    date_earned: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createCertification({
      ...formData,
      date_earned: formData.date_earned || undefined,
      credential_url: formData.credential_url || undefined,
    });

    if (result) {
      setIsCreateDialogOpen(false);
      setFormData({
        platform: '',
        title: '',
        status: 'completed',
        credential_url: '',
        date_earned: '',
      });
      onRefresh();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    const result = await updateCertification(editingCert.id, {
      ...formData,
      date_earned: formData.date_earned || undefined,
      credential_url: formData.credential_url || undefined,
    });

    if (result) {
      setIsEditDialogOpen(false);
      setEditingCert(null);
      onRefresh();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      const success = await deleteCertification(id);
      if (success) {
        onRefresh();
      }
    }
  };

  const openEditDialog = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      platform: cert.platform,
      title: cert.title,
      status: cert.status,
      credential_url: cert.credential_url || '',
      date_earned: cert.date_earned || '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#F5F5F5]">Certifications ({certifications.length})</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#F5F5F5]">
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5]">
            <DialogHeader>
              <DialogTitle>Create Certification</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'in_progress' | 'completed') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-[#2A2A2A]">
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input
                  id="credential_url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_earned">Date Earned</Label>
                <Input
                  id="date_earned"
                  type="date"
                  value={formData.date_earned}
                  onChange={(e) => setFormData({ ...formData, date_earned: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]">
                Create Certification
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-[#2A2A2A] rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1A1A1A]">
            <TableRow>
              <TableHead className="text-[#F5F5F5]">Platform</TableHead>
              <TableHead className="text-[#F5F5F5]">Title</TableHead>
              <TableHead className="text-[#F5F5F5]">Status</TableHead>
              <TableHead className="text-[#F5F5F5]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.map((cert) => (
              <TableRow key={cert.id} className="border-[#2A2A2A]">
                <TableCell className="text-[#CFCFCF]">{cert.platform}</TableCell>
                <TableCell className="text-[#CFCFCF]">{cert.title}</TableCell>
                <TableCell className="text-[#CFCFCF]">
                  <span className={`px-2 py-1 rounded text-xs ${
                    cert.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {cert.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(cert)}
                      className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A]"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(cert.id)}
                      className="border-red-900 text-red-400 hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5]">
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-platform">Platform</Label>
              <Input
                id="edit-platform"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                required
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'in_progress' | 'completed') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-[#2A2A2A]">
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-credential_url">Credential URL</Label>
              <Input
                id="edit-credential_url"
                value={formData.credential_url}
                onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date_earned">Date Earned</Label>
              <Input
                id="edit-date_earned"
                type="date"
                value={formData.date_earned}
                onChange={(e) => setFormData({ ...formData, date_earned: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <Button type="submit" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]">
              Update Certification
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
