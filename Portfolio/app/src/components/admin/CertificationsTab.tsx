import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Certification } from '@/services/api';
import { createCertification, updateCertification, deleteCertification, reorderItems } from '@/services/api';
import MediaInput from './MediaInput';

interface CertificationsTabProps {
  certifications: Certification[];
  setCertifications: (certifications: Certification[]) => void;
  onRefresh: () => void;
}

export default function CertificationsTab({ certifications, setCertifications, onRefresh }: CertificationsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // Sorted by order_index for display
  const sorted = [...certifications].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (isReordering) return;
    const arr = [...sorted];
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;

    // Swap order_index values optimistically
    const firstItem = { ...arr[index] };
    const secondItem = { ...arr[swapIdx] };
    const tempIndex = firstItem.order_index;
    firstItem.order_index = secondItem.order_index;
    secondItem.order_index = tempIndex;

    // Apply swap in local array
    arr[index] = secondItem;
    arr[swapIdx] = firstItem;

    // Update parent state immediately to prevent layout jumps/scintillement
    setCertifications(arr);

    setIsReordering(true);
    try {
      const orders = arr.map((c, i) => ({ id: c.id, order_index: i }));
      await reorderItems('certifications', orders);
    } catch (err) {
      console.error("Reorder failed, reverting:", err);
      onRefresh(); // Rollback if backend fails
    } finally {
      setIsReordering(false);
    }
  };

  const [formData, setFormData] = useState({
    platform: '',
    title: '',
    status: 'completed' as 'in_progress' | 'completed',
    credential_url: '',
    date_earned: '',
    image_url: '' as string | File | null,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let payload: any;
      const hasImageFile = formData.image_url instanceof File;

      if (hasImageFile) {
        const fd = new FormData();
        fd.append('platform', formData.platform);
        fd.append('title', formData.title);
        fd.append('status', formData.status);
        if (formData.credential_url) fd.append('credential_url', formData.credential_url);
        if (formData.date_earned) fd.append('date_earned', formData.date_earned);
        fd.append('image', formData.image_url as File);
        payload = fd;
      } else {
        payload = {
          ...formData,
          credential_url: formData.credential_url || undefined,
          date_earned: formData.date_earned || undefined,
          image_url: formData.image_url || undefined,
        };
      }

      const result = await createCertification(payload);

      if (result) {
        setIsCreateDialogOpen(false);
        setFormData({
          platform: '',
          title: '',
          status: 'completed',
          credential_url: '',
          date_earned: '',
          image_url: '',
        });
        onRefresh();
      }
    } catch (err) {
      console.error("Error creating certification:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    setIsSubmitting(true);
    try {
      let payload: any;
      const hasImageFile = formData.image_url instanceof File;

      if (hasImageFile) {
        const fd = new FormData();
        fd.append('platform', formData.platform);
        fd.append('title', formData.title);
        fd.append('status', formData.status);
        if (formData.credential_url) fd.append('credential_url', formData.credential_url);
        if (formData.date_earned) fd.append('date_earned', formData.date_earned);
        fd.append('image', formData.image_url as File);
        payload = fd;
      } else {
        payload = {
          ...formData,
          credential_url: formData.credential_url || undefined,
          date_earned: formData.date_earned || undefined,
          image_url: formData.image_url || undefined,
        };
      }

      const result = await updateCertification(editingCert.id, payload);

      if (result) {
        setIsEditDialogOpen(false);
        setEditingCert(null);
        onRefresh();
      }
    } catch (err) {
      console.error("Error updating certification:", err);
    } finally {
      setIsSubmitting(false);
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
      image_url: cert.image_url || '',
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
          <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] max-h-[90vh] overflow-y-auto">
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
              
              <MediaInput
                label="Certification Image"
                value={formData.image_url}
                onChange={(value) => setFormData({ ...formData, image_url: value })}
                accept="image/*"
              />

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] disabled:opacity-50">
                {isSubmitting ? "Téléchargement en cours..." : "Create Certification"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-[#2A2A2A] rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1A1A1A]">
            <TableRow>
              <TableHead className="text-[#F5F5F5] w-16">Ordre</TableHead>
              <TableHead className="text-[#F5F5F5]">Platform</TableHead>
              <TableHead className="text-[#F5F5F5]">Title</TableHead>
              <TableHead className="text-[#F5F5F5]">Status</TableHead>
              <TableHead className="text-[#F5F5F5]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((cert, idx) => (
              <TableRow key={cert.id} className="border-[#2A2A2A]">
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0 || isReordering}
                      className="text-[#808080] hover:text-white disabled:opacity-20 text-xs leading-none"
                      title="Monter"
                    >▲</button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === sorted.length - 1 || isReordering}
                      className="text-[#808080] hover:text-white disabled:opacity-20 text-xs leading-none"
                      title="Descendre"
                    >▼</button>
                  </div>
                </TableCell>
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
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] max-h-[90vh] overflow-y-auto">
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
            
            <MediaInput
              label="Certification Image"
              value={formData.image_url}
              onChange={(value) => setFormData({ ...formData, image_url: value })}
              accept="image/*"
            />

            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] disabled:opacity-50">
              {isSubmitting ? "Téléchargement en cours..." : "Update Certification"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
