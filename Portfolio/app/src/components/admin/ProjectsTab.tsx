import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Project } from '@/services/api';
import { createProject, updateProject, deleteProject, reorderItems } from '@/services/api';
import MediaInput from './MediaInput';
import { slugify } from '@/lib/slugify';


interface ProjectsTabProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  onRefresh: () => void;
}

export default function ProjectsTab({ projects, setProjects, onRefresh }: ProjectsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // Sorted by order_index for display
  const sorted = [...projects].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

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
    setProjects(arr);

    setIsReordering(true);
    try {
      const orders = arr.map((p, i) => ({ id: p.id, order_index: i }));
      await reorderItems('projects', orders);
    } catch (err) {
      console.error("Reorder failed, reverting:", err);
      onRefresh(); // Rollback if backend fails
    } finally {
      setIsReordering(false);
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_desc: '',
    core_problem: '',
    technical_solution: '',
    tech_stack: '',
    github_link: '',
    live_demo_link: '',
    image_url: '' as string | File | null,
    video_url: '' as string | File | null,
    status: 'completed' as 'in_progress' | 'completed',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const techStackArray = formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
      
      let payload: any;
      const hasImageFile = formData.image_url instanceof File;
      const hasVideoFile = formData.video_url instanceof File;

      if (hasImageFile || hasVideoFile) {
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('slug', formData.slug);
        fd.append('short_desc', formData.short_desc);
        fd.append('core_problem', formData.core_problem);
        fd.append('technical_solution', formData.technical_solution);
        fd.append('tech_stack', JSON.stringify(techStackArray));
        fd.append('status', formData.status);
        if (formData.github_link) fd.append('github_link', formData.github_link);
        if (formData.live_demo_link) fd.append('live_demo_link', formData.live_demo_link);

        if (hasImageFile) {
          fd.append('image', formData.image_url as File);
        } else if (typeof formData.image_url === 'string') {
          fd.append('image_url', formData.image_url);
        }

        if (hasVideoFile) {
          fd.append('video', formData.video_url as File);
        } else if (typeof formData.video_url === 'string') {
          fd.append('video_url', formData.video_url);
        }

        payload = fd;
      } else {
        payload = {
          ...formData,
          tech_stack: techStackArray,
          image_url: formData.image_url || undefined,
          video_url: formData.video_url || undefined,
        };
      }

      const result = await createProject(payload);

      if (result) {
        setIsCreateDialogOpen(false);
        setFormData({
          title: '',
          slug: '',
          short_desc: '',
          core_problem: '',
          technical_solution: '',
          tech_stack: '',
          github_link: '',
          live_demo_link: '',
          image_url: '',
          video_url: '',
          status: 'completed',
        });
        onRefresh();
      }
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSubmitting(true);
    try {
      const techStackArray = formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
      
      let payload: any;
      const hasImageFile = formData.image_url instanceof File;
      const hasVideoFile = formData.video_url instanceof File;

      if (hasImageFile || hasVideoFile) {
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('slug', formData.slug);
        fd.append('short_desc', formData.short_desc);
        fd.append('core_problem', formData.core_problem);
        fd.append('technical_solution', formData.technical_solution);
        fd.append('tech_stack', JSON.stringify(techStackArray));
        fd.append('status', formData.status);
        if (formData.github_link) fd.append('github_link', formData.github_link);
        if (formData.live_demo_link) fd.append('live_demo_link', formData.live_demo_link);

        if (hasImageFile) {
          fd.append('image', formData.image_url as File);
        } else if (typeof formData.image_url === 'string') {
          fd.append('image_url', formData.image_url);
        }

        if (hasVideoFile) {
          fd.append('video', formData.video_url as File);
        } else if (typeof formData.video_url === 'string') {
          fd.append('video_url', formData.video_url);
        }

        payload = fd;
      } else {
        payload = {
          ...formData,
          tech_stack: techStackArray,
          image_url: formData.image_url || undefined,
          video_url: formData.video_url || undefined,
        };
      }

      const result = await updateProject(editingProject.id, payload);

      if (result) {
        setIsEditDialogOpen(false);
        setEditingProject(null);
        onRefresh();
      }
    } catch (err) {
      console.error("Error updating project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const success = await deleteProject(id);
      if (success) {
        onRefresh();
      }
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      short_desc: project.short_desc,
      core_problem: project.core_problem,
      technical_solution: project.technical_solution,
      tech_stack: project.tech_stack.join(', '),
      github_link: project.github_link || '',
      live_demo_link: project.live_demo_link || '',
      image_url: project.image_url || '',
      video_url: project.video_url || '',
      status: project.status,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#F5F5F5]">Projects ({projects.length})</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#F5F5F5]">
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({ ...formData, title, slug: slugify(title) });
                  }}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  readOnly
                  disabled
                  placeholder="Généré automatiquement..."
                  className="bg-[#151515] border-[#2A2A2A] text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_desc">Short Description</Label>
                <Textarea
                  id="short_desc"
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="core_problem">Core Problem</Label>
                <Textarea
                  id="core_problem"
                  value={formData.core_problem}
                  onChange={(e) => setFormData({ ...formData, core_problem: e.target.value })}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technical_solution">Technical Solution</Label>
                <Textarea
                  id="technical_solution"
                  value={formData.technical_solution}
                  onChange={(e) => setFormData({ ...formData, technical_solution: e.target.value })}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                <Input
                  id="tech_stack"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_link">GitHub Link</Label>
                <Input
                  id="github_link"
                  value={formData.github_link}
                  onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                  className="bg-[#0A0A0A] border-[#2A2A2A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="live_demo_link">Live Demo Link</Label>
                <Input
                  id="live_demo_link"
                  value={formData.live_demo_link}
                  onChange={(e) => setFormData({ ...formData, live_demo_link: e.target.value })}
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
              
              <MediaInput
                label="Project Image"
                value={formData.image_url}
                onChange={(value) => setFormData({ ...formData, image_url: value })}
                accept="image/*"
              />
              
              <MediaInput
                label="Project Video"
                value={formData.video_url}
                onChange={(value) => setFormData({ ...formData, video_url: value })}
                accept="video/*"
              />

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] disabled:opacity-50">
                {isSubmitting ? "Téléchargement en cours..." : "Create Project"}
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
              <TableHead className="text-[#F5F5F5]">Title</TableHead>
              <TableHead className="text-[#F5F5F5]">Status</TableHead>
              <TableHead className="text-[#F5F5F5]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((project, idx) => (
              <TableRow key={project.id} className="border-[#2A2A2A]">
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
                <TableCell className="text-[#CFCFCF]">{project.title}</TableCell>
                <TableCell className="text-[#CFCFCF]">
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {project.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(project)}
                      className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A]"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(project.id)}
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
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="edit-title">Title</Label>
               <Input
                 id="edit-title"
                 value={formData.title}
                 onChange={(e) => {
                   const title = e.target.value;
                   setFormData({ ...formData, title, slug: slugify(title) });
                 }}
                 required
                 className="bg-[#0A0A0A] border-[#2A2A2A]"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="edit-slug">Slug</Label>
               <Input
                 id="edit-slug"
                 value={formData.slug}
                 readOnly
                 disabled
                 className="bg-[#151515] border-[#2A2A2A] text-gray-500 cursor-not-allowed"
               />
             </div>
            <div className="space-y-2">
              <Label htmlFor="edit-short_desc">Short Description</Label>
              <Textarea
                id="edit-short_desc"
                value={formData.short_desc}
                onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                required
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-core_problem">Core Problem</Label>
              <Textarea
                id="edit-core_problem"
                value={formData.core_problem}
                onChange={(e) => setFormData({ ...formData, core_problem: e.target.value })}
                required
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-technical_solution">Technical Solution</Label>
              <Textarea
                id="edit-technical_solution"
                value={formData.technical_solution}
                onChange={(e) => setFormData({ ...formData, technical_solution: e.target.value })}
                required
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tech_stack">Tech Stack (comma-separated)</Label>
              <Input
                id="edit-tech_stack"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                required
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-github_link">GitHub Link</Label>
              <Input
                id="edit-github_link"
                value={formData.github_link}
                onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-live_demo_link">Live Demo Link</Label>
              <Input
                id="edit-live_demo_link"
                value={formData.live_demo_link}
                onChange={(e) => setFormData({ ...formData, live_demo_link: e.target.value })}
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
            
            <MediaInput
              label="Project Image"
              value={formData.image_url}
              onChange={(value) => setFormData({ ...formData, image_url: value })}
              accept="image/*"
            />
            
            <MediaInput
              label="Project Video"
              value={formData.video_url}
              onChange={(value) => setFormData({ ...formData, video_url: value })}
              accept="video/*"
            />

            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] disabled:opacity-50">
              {isSubmitting ? "Téléchargement en cours..." : "Update Project"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
