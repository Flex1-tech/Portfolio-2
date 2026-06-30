import { useState } from 'react';
import { useNavigate } from 'react-router';
import { adminLogin } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLogin() {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 setIsLoading(true);

 try {
 const result = await adminLogin(username, password);
 if (result.success) {
 navigate('/admin/dashboard');
 } else {
 setError(result.message || 'Login failed');
 }
 } catch (err) {
 setError('An error occurred. Please try again.');
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
 <div className="w-full max-w-md">
 <div className="mb-8 text-center">
 <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">Admin Login</h1>
 <p className="text-[#CFCFCF]">Access your portfolio dashboard</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="space-y-2">
 <Label htmlFor="username" className="text-[#F5F5F5]">Username</Label>
 <Input
 id="username"
 type="text"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 required
 className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] focus:border-[#4A4A4A]"
 placeholder="Enter your username"
 />
 </div>

 <div className="space-y-2">
 <Label htmlFor="password" className="text-[#F5F5F5]">Password</Label>
 <Input
 id="password"
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] focus:border-[#4A4A4A]"
 placeholder="Enter your password"
 />
 </div>

 {error && (
 <div className="text-red-400 text-sm">{error}</div>
 )}

 <Button
 type="submit"
 disabled={isLoading}
 className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#F5F5F5]"
 >
 {isLoading ? 'Logging in...' : 'Login'}
 </Button>
 </form>
 </div>
 </div>
 );
}
