import { Link } from 'react-router-dom';
import VoteButtons from './VoteButtons';

export default function PostCard({ post }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition">

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <Link
          to={`/c/${post.communitySlug}`}
          className="font-semibold text-gray-700 hover:text-blue-600 transition"
        >
          c/{post.communityName}
        </Link>
        <span>·</span>
        <span>by {post.authorUsername}</span>
      </div>

      <Link to={`/post/${post.id}`}>
        <h2 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition leading-snug mb-2">
          {post.title}
        </h2>
      </Link>

      {post.imageUrl && (
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-100">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full max-h-72 object-cover"
          />
        </div>
      )}

      {post.content && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {post.content}
        </p>
      )}

      <div className="flex items-center gap-4 mt-1">
        <VoteButtons postId={post.id} initialScore={post.voteScore} />

        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.commentCount} comments
        </Link>
      </div>
    </div>
  );
}
