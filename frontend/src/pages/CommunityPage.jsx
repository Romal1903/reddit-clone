import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import SortBar from '../components/SortBar';

export default function CommunityPage() {
  const { slug } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [commRes, postsRes] = await Promise.all([
          api.get(`/communities/${slug}`),
          api.get(`/communities/${slug}/posts?sort=new`),
        ]);
        setCommunity(commRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError('Community not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleSortChange = async (newSort) => {
    setSort(newSort);
    setPostsLoading(true);
    try {
      const res = await api.get(`/communities/${slug}/posts?sort=${newSort}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Sort failed');
    } finally {
      setPostsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">c/{community.name}</h1>
            {community.description && (
              <p className="text-sm text-gray-500 mt-1">{community.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">{community.postCount} posts</p>
          </div>
          <Link
            to="/create-post"
            state={{ communitySlug: slug }}
            className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shrink-0"
          >
            + Post
          </Link>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">

          <div className="mb-4">
            <SortBar sort={sort} onSortChange={handleSortChange} />
          </div>

          {postsLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
              <p className="text-gray-500 text-sm mb-3">No posts yet.</p>
              <Link to="/create-post" state={{ communitySlug: slug }}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                Be the first to post
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <div className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">About this community</h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              {community.description || 'No description provided.'}
            </p>
            <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 mb-3">
              <span className="font-medium text-gray-700">{community.postCount}</span> posts
            </div>
            <Link to="/create-post" state={{ communitySlug: slug }}
              className="block w-full text-center text-sm py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              Create Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
