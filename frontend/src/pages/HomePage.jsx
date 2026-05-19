import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import SortBar from '../components/SortBar';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('new');

  const fetchPosts = useCallback(async (sortType) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/posts?sort=${sortType}`);
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api.get('/communities').then((res) => setCommunities(res.data.slice(0, 8)));
  }, []);

  useEffect(() => {
    fetchPosts(sort);
  }, [sort]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    fetchPosts(newSort);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex gap-6">

        <div className="flex-1 min-w-0">

          <div className="flex items-center justify-between mb-4">
            <SortBar sort={sort} onSortChange={handleSortChange} />
            <Link
              to="/create-post"
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              + New Post
            </Link>
          </div>

          {loading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
              <p className="text-gray-500 text-sm mb-3">No posts yet. Be the first!</p>
              <Link to="/create-post"
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                Create Post
              </Link>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <div className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">Communities</h2>
              <Link to="/create-community" className="text-xs text-blue-600 hover:underline">+ New</Link>
            </div>
            {communities.length === 0 ? (
              <p className="text-xs text-gray-400">No communities yet</p>
            ) : (
              <ul className="space-y-2">
                {communities.map((c) => (
                  <li key={c.id}>
                    <Link to={`/c/${c.slug}`}
                      className="flex items-center justify-between text-sm text-gray-700 hover:text-blue-600 transition group">
                      <span className="truncate">c/{c.name}</span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-400">
                        {c.postCount} posts
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">About Posta</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Posta is a simple place to share posts, join communities, and have discussions.
            </p>
            <div className="mt-3 space-y-2">
              <Link to="/create-post"
                className="block w-full text-center text-sm py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                Create Post
              </Link>
              <Link to="/create-community"
                className="block w-full text-center text-sm py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                Create Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
