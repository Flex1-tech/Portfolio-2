import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Event } from '@/services/api';
import { createEvent, updateEvent, deleteEvent } from '@/services/api';

interface EventsTabProps {
 events: Event[];
 onRefresh: () => void;
}

export default function EventsTab({ events, onRefresh }: EventsTabProps) {
 const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
 const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
 const [editingEvent, setEditingEvent] = useState<Event | null>(null);
 const [formData, setFormData] = useState({
 title: '',
 organization: '',
 year: '',
 role: 'participant' as 'participant' | 'mentor' | 'speaker',
 description: '',
 });

 const handleCreate = async (e: React.FormEvent) => {
 e.preventDefault();
 
 const result = await createEvent(formData);

 if (result) {
 setIsCreateDialogOpen(false);
 setFormData({
 title: '',
 organization: '',
 year: '',
 role: 'participant',
 description: '',
 });
 onRefresh();
 }
 };

 const handleEdit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!editingEvent) return;

 const result = await updateEvent(editingEvent.id, formData);

 if (result) {
 setIsEditDialogOpen(false);
 setEditingEvent(null);
 onRefresh();
 }
 };

 const handleDelete = async (id: number) => {
 if (confirm('Are you sure you want to delete this event?')) {
 const success = await deleteEvent(id);
 if (success) {
 onRefresh();
 }
 }
 };

 const openEditDialog = (event: Event) => {
 setEditingEvent(event);
 setFormData({
 title: event.title,
 organization: event.organization,
 year: event.year,
 role: event.role,
 description: event.description,
 });
 setIsEditDialogOpen(true);
 };

 return (
 <div className="space-y-4">
 <div className="flex justify-between items-center">
 <h2 className="text-xl font-semibold text-[#F5F5F5]">Events ({events.length})</h2>
 <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
 <DialogTrigger asChild>
 <Button className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#F5F5F5]">
 Add Event
 </Button>
 </DialogTrigger>
 <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5]">
 <DialogHeader>
 <DialogTitle>Create Event</DialogTitle>
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
 <Label htmlFor="organization">Organization</Label>
 <Input
 id="organization"
 value={formData.organization}
 onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="year">Year</Label>
 <Input
 id="year"
 value={formData.year}
 onChange={(e) => setFormData({ ...formData, year: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="role">Role</Label>
 <Select
 value={formData.role}
 onValueChange={(value: 'participant' | 'mentor' | 'speaker') => setFormData({ ...formData, role: value })}
 >
 <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A]">
 <SelectValue />
 </SelectTrigger>
 <SelectContent className="bg-[#0A0A0A] border-[#2A2A2A]">
 <SelectItem value="participant">Participant</SelectItem>
 <SelectItem value="mentor">Mentor</SelectItem>
 <SelectItem value="speaker">Speaker</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-2">
 <Label htmlFor="description">Description</Label>
 <Textarea
 id="description"
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
 />
 </div>
 <Button type="submit" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]">
 Create Event
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
 <TableHead className="text-[#F5F5F5]">Organization</TableHead>
 <TableHead className="text-[#F5F5F5]">Year</TableHead>
 <TableHead className="text-[#F5F5F5]">Role</TableHead>
 <TableHead className="text-[#F5F5F5]">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {events.map((event) => (
 <TableRow key={event.id} className="border-[#2A2A2A]">
 <TableCell className="text-[#CFCFCF]">{event.title}</TableCell>
 <TableCell className="text-[#CFCFCF]">{event.organization}</TableCell>
 <TableCell className="text-[#CFCFCF]">{event.year}</TableCell>
 <TableCell className="text-[#CFCFCF]">
 <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300 capitalize">
 {event.role}
 </span>
 </TableCell>
 <TableCell>
 <div className="flex gap-2">
 <Button
 size="sm"
 variant="outline"
 onClick={() => openEditDialog(event)}
 className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A]"
 >
 Edit
 </Button>
 <Button
 size="sm"
 variant="outline"
 onClick={() => handleDelete(event.id)}
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
 <DialogTitle>Edit Event</DialogTitle>
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
 <Label htmlFor="edit-organization">Organization</Label>
 <Input
 id="edit-organization"
 value={formData.organization}
 onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="edit-year">Year</Label>
 <Input
 id="edit-year"
 value={formData.year}
 onChange={(e) => setFormData({ ...formData, year: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="edit-role">Role</Label>
 <Select
 value={formData.role}
 onValueChange={(value: 'participant' | 'mentor' | 'speaker') => setFormData({ ...formData, role: value })}
 >
 <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A]">
 <SelectValue />
 </SelectTrigger>
 <SelectContent className="bg-[#0A0A0A] border-[#2A2A2A]">
 <SelectItem value="participant">Participant</SelectItem>
 <SelectItem value="mentor">Mentor</SelectItem>
 <SelectItem value="speaker">Speaker</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-2">
 <Label htmlFor="edit-description">Description</Label>
 <Textarea
 id="edit-description"
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 required
 className="bg-[#0A0A0A] border-[#2A2A2A]"
 />
 </div>
 <Button type="submit" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]">
 Update Event
 </Button>
 </form>
 </DialogContent>
 </Dialog>
 </div>
 );
}
