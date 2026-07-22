import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/services/api';
import { Link } from 'react-router';
import SEO from '@/components/SEO';

export default function Articles() {
  const { data: articles = [], isLoading: loading } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <SEO title="Articles & Insights" description="Articles and research insights by Seth N. AKPLOGAN." />
        <div className="text-[#CFCFCF]">Loading...</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <SEO title="Articles & Insights" description="Articles and research insights by Seth N. AKPLOGAN." />
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#F5F5F5] mb-2">Articles</h1>
          <p className="text-[#CFCFCF]">No articles published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4">
      <SEO
        title="Technical Articles & Insights"
        description="Articles and research insights on Artificial Intelligence, Machine Learning, and Software Engineering by Seth N. AKPLOGAN."
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#F5F5F5] mb-8">Articles</h1>
        <div className="space-y-8">
          {articles.map((article) => (
            <article key={article.id} className="border border-[#2A2A2A] rounded-lg overflow-hidden bg-[#1A1A1A] hover:border-[#3A3A3A] transition-colors">
              {article.image_url && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.image_alt || article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <Link to={`/articles/${article.slug}`}>
                  <h2 className="text-2xl font-semibold text-[#F5F5F5] hover:text-[#CFCFCF] transition-colors mb-2">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-[#CFCFCF] mb-4 line-clamp-3">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6A6A6A]">
                    {article.published_at && new Date(article.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <Link
                    to={`/articles/${article.slug}`}
                    className="text-[#CFCFCF] hover:text-[#F5F5F5] transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
