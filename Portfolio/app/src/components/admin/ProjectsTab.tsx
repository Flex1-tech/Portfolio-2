import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Project } from '@/services/api';
import { createProject, updateProject, deleteProject } from '@/services/api';

interface ProjectsTabProps {
 projects: Project[];
 onRefresh: () => void;
}

export default function ProjectsTab({ projects, onRefresh }: ProjectsTabProps) {
 const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
 const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
 const [editingProject, setEditingProject] = useState<Project | null>(null);
 const [formData, setFormData] = useState({
 title: '',
 slug: '',
 short_desc: '',
 core_problem: '',
 technical_solution: '',
 tech_stack: '',
 github_link: '',
 live_demo_link: '',
 status: 'completed' as 'in_progress' | 'completed',
 });

 const handleCreate = async (e: React.FormEvent) => {
 e.preventDefault();
 const techStackArray = formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
 
 const result = await createProject({
 ...formData,
 tech_stack: techStackArray,
 });

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
 status: 'completed',
 });
 onRefresh();
 }
 };

 const handleEdit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!editingProject) return;

 const techStackArray = formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
 
 const result = await updateProject(editingProject.id, {
 ...formData,
 tech_stack: techStackArray,
 });

 if (result) {
 setIsEditDialogOpen(false);
 setEditingProject(null);
 onRefresh();
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
 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="slug">Slug</Label>
 <Input
 id="slug"
 value={formData.slug}
 onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
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
 <Button type="submit" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]">
 Create Project
 </Button>
 </form>
 </DialogContent>
 </Dialog>
 </div>

 <div className="border border-[#2A2A2A] rounded-lg overflow-hidden">
 <Table>
 <TableHeader className="bg-[#1A1A1A]">
 <TableRow>
 <TableHead className="text-[#F5F5F5]">Title</TableHead>
 <TableHead className="text-[#F5F5F5]">Status</TableHead>
 <TableHead className="text-[#F5F5F5]">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {projects.map((project) => (
 <TableRow key={project.id} className="border-[#2A2A2A]">
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
 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="edit-slug">Slug</Label>
 <Input
 id="edit-slug"
 value={formData.slug}
 onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
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
 <Button type="submit" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]">
 Update Project
 </Button>
 </form>
 </DialogContent>
 </Dialog>
 </div>
 );
}
