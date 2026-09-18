import { BlogPost, BlogCategory } from '../../types/blog';
import { articlesPart1 } from './articlesPart1';
import { articlesPart2 } from './articlesPart2';
import { articlesPart3 } from './articlesPart3';
import { articlesPart4 } from './articlesPart4';

export const BLOG_POSTS: BlogPost[] = [
  ...articlesPart1,
  ...articlesPart2,
  ...articlesPart3,
  ...articlesPart4,
];

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Background Removal',
  'AI Image Editing',
  'Photo Editing',
  'Product Photography',
  'Transparent PNG',
  'Image Tips',
  'Design Tips',
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const normalized = slug.replace(/^\/blog\//, '').replace(/\/$/, '').trim();
  return BLOG_POSTS.find((p) => p.slug === normalized);
}

export function getRelatedBlogPosts(currentPost: BlogPost, count = 3): BlogPost[] {
  // First prefer explicit relatedSlugs
  if (currentPost.relatedSlugs && currentPost.relatedSlugs.length > 0) {
    const explicitRelated = currentPost.relatedSlugs
      .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
      .filter((p): p is BlogPost => Boolean(p));

    if (explicitRelated.length >= count) {
      return explicitRelated.slice(0, count);
    }
  }

  // Fallback: match by same category, then other posts
  const sameCategory = BLOG_POSTS.filter(
    (p) => p.slug !== currentPost.slug && p.category === currentPost.category
  );
  const otherPosts = BLOG_POSTS.filter(
    (p) => p.slug !== currentPost.slug && p.category !== currentPost.category
  );

  return [...sameCategory, ...otherPosts].slice(0, count);
}

export function searchBlogPosts(
  posts: BlogPost[],
  query: string,
  categoryFilter: string = 'All'
): BlogPost[] {
  const cleanQuery = query.toLowerCase().trim();

  return posts.filter((post) => {
    // Check category filter
    if (categoryFilter !== 'All' && post.category !== categoryFilter) {
      return false;
    }

    if (!cleanQuery) return true;

    // Match title
    if (post.title.toLowerCase().includes(cleanQuery)) return true;

    // Match excerpt
    if (post.excerpt.toLowerCase().includes(cleanQuery)) return true;

    // Match category
    if (post.category.toLowerCase().includes(cleanQuery)) return true;

    // Match keywords
    if (
      post.primaryKeyword.toLowerCase().includes(cleanQuery) ||
      post.secondaryKeywords.some((k) => k.toLowerCase().includes(cleanQuery))
    ) {
      return true;
    }

    return false;
  });
}
