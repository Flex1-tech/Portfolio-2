import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Article } from '@/services/api';
import { createArticle, updateArticle, deleteArticle, reorderItems } from '@/services/api';
import MediaInput from './MediaInput';
import { slugify } from '@/lib/slugify';

interface ArticlesTabProps {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  onRefresh: () => void;
}

export default function ArticlesTab({ articles, setArticles, onRefresh }: ArticlesTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Sorted by order_index for display
  const sorted = [...articles].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  // Filter articles
  const filtered = sorted.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'published' && article.published_at && new Date(article.published_at) <= new Date()) ||
                         (statusFilter === 'draft' && (!article.published_at || new Date(article.published_at) > new Date()));
    return matchesSearch && matchesStatus;
  });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    image_url: '' as string | File | null,
    image_alt: '',
    published_at: '',
    seo_title: '',
    seo_description: '',
  });

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (isReordering) return;
    const arr = [...filtered];
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

    // Update parent state immediately
    setArticles(arr);

    // Persist to backend
    setIsReordering(true);
    try {
      await reorderItems('articles', [
        { id: firstItem.id!, order_index: firstItem.order_index! },
        { id: secondItem.id!, order_index: secondItem.order_index! },
      ]);
    } catch (error) {
      console.error('Reorder failed:', error);
      // Rollback on error
      setArticles(sorted);
    } finally {
      setIsReordering(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('slug', formData.slug);
    data.append('summary', formData.summary);
    data.append('content', formData.content);
    if (typeof formData.image_url === 'string' && formData.image_url) data.append('image_url', formData.image_url);
    if (formData.image_url instanceof File) data.append('image', formData.image_url);
    if (formData.image_alt) data.append('image_alt', formData.image_alt);
    if (formData.published_at) data.append('published_at', formData.published_at);
    if (formData.seo_title) data.append('seo_title', formData.seo_title);
    if (formData.seo_description) data.append('seo_description', formData.seo_description);

    const result = await createArticle(data);

    if (result) {
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        slug: '',
        summary: '',
        content: '',
        image_url: '' as string | File | null,
        image_alt: '',
        published_at: '',
        seo_title: '',
        seo_description: '',
      });
      onRefresh();
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('slug', formData.slug);
    data.append('summary', formData.summary);
    data.append('content', formData.content);
    if (typeof formData.image_url === 'string' && formData.image_url) data.append('image_url', formData.image_url);
    if (formData.image_url instanceof File) data.append('image', formData.image_url);
    if (formData.image_alt) data.append('image_alt', formData.image_alt);
    if (formData.published_at) data.append('published_at', formData.published_at);
    if (formData.seo_title) data.append('seo_title', formData.seo_title);
    if (formData.seo_description) data.append('seo_description', formData.seo_description);

    const result = await updateArticle(editingArticle.id, data);

    if (result) {
      setIsEditDialogOpen(false);
      setEditingArticle(null);
      onRefresh();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const success = await deleteArticle(id);
      if (success) {
        onRefresh();
      }
    }
  };

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      image_url: article.image_url || '',
      image_alt: article.image_alt || '',
      published_at: article.published_at || '',
      seo_title: article.seo_title || '',
      seo_description: article.seo_description || '',
    });
    setIsEditDialogOpen(true);
  };

  const isPublished = (article: Article) => {
    return article.published_at && new Date(article.published_at) <= new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#F5F5F5]">Articles ({articles.length})</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F5F5] w-64"
          />
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-[#F5F5F5] w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-[#2A2A2A]">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#F5F5F5]">
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Article</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) });
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
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    disabled
                    className="bg-[#0A0A0A] border-[#2A2A2A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    required
                    className="bg-[#0A0A0A] border-[#2A2A2A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={10}
                    className="bg-[#0A0A0A] border-[#2A2A2A] font-mono"
                  />
                </div>
                <MediaInput
                  label="Image URL"
                  value={formData.image_url}
                  onChange={(value) => setFormData({ ...formData, image_url: value })}
                  accept="image/*"
                />
                <div className="space-y-2">
                  <Label htmlFor="image_alt">Image Alt Text</Label>
                  <Input
                    id="image_alt"
                    value={formData.image_alt}
                    onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                    className="bg-[#0A0A0A] border-[#2A2A2A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="published_at">Published At</Label>
                  <Input
                    id="published_at"
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    className="bg-[#0A0A0A] border-[#2A2A2A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    className="bg-[#0A0A0A] border-[#2A2A2A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    className="bg-[#0A0A0A] border-[#2A2A2A]"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Article'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border border-[#2A2A2A] rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1A1A1A]">
            <TableRow>
              <TableHead className="text-[#F5F5F5]">Title</TableHead>
              <TableHead className="text-[#F5F5F5]">Status</TableHead>
              <TableHead className="text-[#F5F5F5]">Published At</TableHead>
              <TableHead className="text-[#F5F5F5]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((article, index) => (
              <TableRow key={article.id} className="border-[#2A2A2A]">
                <TableCell className="text-[#CFCFCF]">{article.title}</TableCell>
                <TableCell className="text-[#CFCFCF]">
                  <span className={`px-2 py-1 rounded text-xs ${
                    isPublished(article) ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {isPublished(article) ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell className="text-[#CFCFCF]">
                  {article.published_at ? new Date(article.published_at).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="text-[#CFCFCF]">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0 || isReordering}
                      className="text-[#CFCFCF] hover:text-[#F5F5F5]"
                    >
                      ▲
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === filtered.length - 1 || isReordering}
                      className="text-[#CFCFCF] hover:text-[#F5F5F5]"
                    >
                      ▼
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(article)}
                      className="text-[#CFCFCF] hover:text-[#F5F5F5]"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(article.id!)}
                      className="text-red-400 hover:text-red-300"
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
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) });
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
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                disabled
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-summary">Summary</Label>
              <Textarea
                id="edit-summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content (Markdown)</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={10}
                className="bg-[#0A0A0A] border-[#2A2A2A] font-mono"
              />
            </div>
            <MediaInput
              label="Image URL"
              value={formData.image_url}
              onChange={(value) => setFormData({ ...formData, image_url: value })}
              accept="image/*"
            />
            <div className="space-y-2">
              <Label htmlFor="edit-image_alt">Image Alt Text</Label>
              <Input
                id="edit-image_alt"
                value={formData.image_alt}
                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-published_at">Published At</Label>
              <Input
                id="edit-published_at"
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-seo_title">SEO Title</Label>
              <Input
                id="edit-seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-seo_description">SEO Description</Label>
              <Textarea
                id="edit-seo_description"
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="bg-[#0A0A0A] border-[#2A2A2A]"
              />
            </div>
            <Button type="submit" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Article'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
