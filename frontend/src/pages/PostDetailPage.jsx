import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import VoteButtons from '../components/VoteButtons';
import CommentSection from '../components/CommentSection';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Link
            to={`/c/${post.communitySlug}`}
            className="font-semibold text-gray-700 hover:text-blue-600 transition"
          >
            c/{post.communityName}
          </Link>
          <span>·</span>
          <span>Posted by {post.authorUsername}</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
          {post.title}
        </h1>

        {/* Image */}
        {post.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {post.content && (
          <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
            {post.content}
          </p>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <VoteButtons postId={post.id} initialScore={post.voteScore} />
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.commentCount} comments
          </span>
        </div>
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
}
