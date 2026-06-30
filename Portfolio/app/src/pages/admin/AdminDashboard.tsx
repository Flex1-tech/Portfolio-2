import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import AdminGuard from '@/components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminLogout } from '@/services/api';
import { getProjects, getEvents, getCertifications } from '@/services/api';
import type { Project, Event, Certification } from '@/services/api';
import ProjectsTab from '@/components/admin/ProjectsTab';
import CertificationsTab from '@/components/admin/CertificationsTab';
import EventsTab from '@/components/admin/EventsTab';

export default function AdminDashboard() {
 const navigate = useNavigate();
 const [projects, setProjects] = useState<Project[]>([]);
 const [events, setEvents] = useState<Event[]>([]);
 const [certifications, setCertifications] = useState<Certification[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 async function loadData() {
 try {
 const [projectsData, eventsData, certsData] = await Promise.all([
 getProjects(),
 getEvents(),
 getCertifications(),
 ]);
 setProjects(projectsData);
 setEvents(eventsData);
 setCertifications(certsData);
 } catch (error) {
 console.error('Error loading data:', error);
 } finally {
 setIsLoading(false);
 }
 }

 loadData();
 }, []);

 useEffect(() => {
 if (!isLoading && containerRef.current) {
 gsap.from(containerRef.current.children, {
 opacity: 0,
 y: 20,
 duration: 0.6,
 stagger: 0.1,
 ease: 'power2.out',
 });
 }
 }, [isLoading]);

 const handleLogout = async () => {
 await adminLogout();
 navigate('/admin/login');
 };

 const refreshData = async () => {
 setIsLoading(true);
 try {
 const [projectsData, eventsData, certsData] = await Promise.all([
 getProjects(),
 getEvents(),
 getCertifications(),
 ]);
 setProjects(projectsData);
 setEvents(eventsData);
 setCertifications(certsData);
 } catch (error) {
 console.error('Error refreshing data:', error);
 } finally {
 setIsLoading(false);
 }
 };

 if (isLoading) {
 return (
 <AdminGuard>
 <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
 <div className="text-[#CFCFCF]">Loading dashboard...</div>
 </div>
 </AdminGuard>
 );
 }

 return (
 <AdminGuard>
 <div ref={containerRef} className="min-h-screen bg-[#0A0A0A]">
 <header className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
 <h1 className="text-2xl font-bold text-[#F5F5F5]">Admin Dashboard</h1>
 <Button
 onClick={handleLogout}
 variant="outline"
 className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A]"
 >
 Logout
 </Button>
 </div>
 </header>

 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <Tabs defaultValue="projects" className="space-y-6">
 <TabsList className="bg-[#1A1A1A] border border-[#2A2A2A]">
 <TabsTrigger value="projects" className="data-[state=active]:bg-[#2A2A2A] text-[#F5F5F5]">
 Projects
 </TabsTrigger>
 <TabsTrigger value="certifications" className="data-[state=active]:bg-[#2A2A2A] text-[#F5F5F5]">
 Certifications
 </TabsTrigger>
 <TabsTrigger value="events" className="data-[state=active]:bg-[#2A2A2A] text-[#F5F5F5]">
 Events
 </TabsTrigger>
 </TabsList>

 <TabsContent value="projects">
 <ProjectsTab 
 projects={projects} 
 onRefresh={refreshData}
 />
 </TabsContent>

 <TabsContent value="certifications">
 <CertificationsTab 
 certifications={certifications}
 onRefresh={refreshData}
 />
 </TabsContent>

 <TabsContent value="events">
 <EventsTab 
 events={events}
 onRefresh={refreshData}
 />
 </TabsContent>
 </Tabs>
 </main>
 </div>
 </AdminGuard>
 );
}
