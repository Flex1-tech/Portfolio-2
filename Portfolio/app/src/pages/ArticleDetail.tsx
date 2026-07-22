import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getArticleBySlug } from '@/services/api';
import type { Article } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import SEO from '@/components/SEO';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await getArticleBySlug(slug);
      setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <SEO title="Loading Article..." />
        <div className="text-[#CFCFCF]">Loading...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <SEO title="Article Not Found" />
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#F5F5F5] mb-2">Article Not Found</h1>
          <Link to="/articles" className="text-[#CFCFCF] hover:text-[#F5F5F5]">
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  // Calculate reading time (approx 200 words per minute)
  const wordCount = article.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.seo_title || article.title,
    description: article.seo_description || article.summary,
    image: article.image_url ? [article.image_url] : undefined,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Person',
      name: 'Seth N. AKPLOGAN',
      url: 'https://seth-akplogan.onrender.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Seth N. AKPLOGAN',
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4">
      <SEO
        title={article.seo_title || article.title}
        description={article.seo_description || article.summary}
        ogType="article"
        ogImage={article.image_url}
        jsonLd={articleSchema}
      />
      <div className="max-w-4xl mx-auto">
        <Link to="/articles" className="inline-block mb-8 text-[#CFCFCF] hover:text-[#F5F5F5] transition-colors">
          ← Back to Articles
        </Link>

        {article.image_url && (
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8">
            <img
              src={article.image_url}
              alt={article.image_alt || article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-4">{article.title}</h1>

        <div className="flex items-center gap-4 text-sm text-[#6A6A6A] mb-8">
          {article.published_at && (
            <span>
              {new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-[#CFCFCF] leading-relaxed markdown-content">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a target="_blank" rel="noopener noreferrer" {...props} />
              )
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
