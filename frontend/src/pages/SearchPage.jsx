import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ posts: [], communities: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('posts');

  useEffect(() => {
    if (!query.trim()) return;
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        setError('Search failed. Try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const totalResults = results.posts.length + results.communities.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      <div className="mb-5">
        <h1 className="text-lg font-semibold text-gray-900">
          Search results for{' '}
          <span className="text-blue-600">"{query}"</span>
        </h1>
        {!loading && (
          <p className="text-sm text-gray-500 mt-0.5">
            {totalResults} result{totalResults !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => setTab('posts')}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
            tab === 'posts'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Posts ({results.posts.length})
        </button>
        <button
          onClick={() => setTab('communities')}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
            tab === 'communities'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Communities ({results.communities.length})
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Posts tab */}
          {tab === 'posts' && (
            <div>
              {results.posts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
                  <p className="text-sm text-gray-400">No posts found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'communities' && (
            <div>
              {results.communities.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
                  <p className="text-sm text-gray-400">No communities found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.communities.map((c) => (
                    <Link
                      key={c.id}
                      to={`/c/${c.slug}`}
                      className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            c/{c.name}
                          </p>
                          {c.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {c.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 ml-4">
                          {c.postCount} posts
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!query && (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-sm text-gray-400">Use the search bar above to find posts and communities.</p>
        </div>
      )}
    </div>
  );
}
