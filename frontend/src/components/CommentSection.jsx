import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Avatar({ username, size = 'sm' }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    xs: 'w-6 h-6 text-xs',
  };
  return (
    <div className={`${sizes[size]} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase shrink-0`}>
      {username?.[0]}
    </div>
  );
}

function ReplyInput({ targetUsername, onSubmit, onCancel, loading }) {
  const { user } = useAuth();
  const [text, setText] = useState('');

  return (
    <div className="flex gap-2 mt-2">
      <Avatar username={user?.username} size="xs" />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Reply to ${targetUsername}...`}
          rows={2}
          autoFocus
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition resize-none"
        />
        <div className="flex justify-end gap-2 mt-1.5">
          <button
            onClick={onCancel}
            className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (text.trim()) onSubmit(text.trim()); }}
            disabled={loading || !text.trim()}
            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Reply'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, postId, onCommentAdded, depth = 0 }) {
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);

  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 4;

  const handleSubmitReply = async (text) => {
    setReplyLoading(true);
    try {
      await api.post('/comments', {
        content: text,
        postId,
        parentCommentId: comment.id,
      });
      setShowReplyInput(false);
      setShowReplies(true);
      onCommentAdded();
    } catch (err) {
      console.error('Reply failed', err);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-4 pl-3 border-l-2 border-gray-100' : ''}`}>
      <div className="flex gap-2.5">
        <Avatar username={comment.authorUsername} size={depth > 0 ? 'xs' : 'sm'} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-gray-900">
              {comment.authorUsername}
            </span>
            {comment.authorUsername === user?.username && (
              <span className="text-xs bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded font-medium">
                You
              </span>
            )}
            <span className="text-xs text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line mb-1.5">
            {comment.content}
          </p>

          <div className="flex items-center gap-3">
            {depth < maxDepth && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs text-gray-400 hover:text-blue-600 font-medium transition"
              >
                {showReplyInput ? 'Cancel' : 'Reply'}
              </button>
            )}

            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium transition flex items-center gap-1"
              >
                {showReplies ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                    Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </button>
            )}
          </div>

          {showReplyInput && (
            <ReplyInput
              targetUsername={comment.authorUsername}
              onSubmit={handleSubmitReply}
              onCancel={() => setShowReplyInput(false)}
              loading={replyLoading}
            />
          )}

          {hasReplies && showReplies && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  onCommentAdded={onCommentAdded}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data);

      const countAll = (list) =>
        list.reduce((acc, c) => acc + 1 + countAll(c.replies || []), 0);
      setTotalCount(countAll(res.data));
    } catch (err) {
      console.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/comments', {
        content: newComment.trim(),
        postId,
        parentCommentId: null,
      });
      setNewComment('');
      await fetchComments();
    } catch (err) {
      setError('Failed to post comment. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmitComment();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">

      <h2 className="text-sm font-semibold text-gray-800 mb-5">
        {totalCount} Comment{totalCount !== 1 ? 's' : ''}
      </h2>

      <div className="flex gap-3 mb-6">
        <Avatar username={user?.username} />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition resize-none"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
              className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 mb-5" />

      {loading ? (
        <div className="space-y-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-2.5 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onCommentAdded={fetchComments}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
