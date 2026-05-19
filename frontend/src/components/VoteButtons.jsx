import { useState } from 'react';
import api from '../api/axios';

export default function VoteButtons({ postId, initialScore = 0 }) {
  const [score, setScore] = useState(initialScore);
  const [voted, setVoted] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post('/votes', { postId, voteType });
      setScore(res.data.newVoteScore);

      if (voted === voteType) {
        setVoted(null);
      } else {
        setVoted(voteType);
      }
    } catch (err) {
      console.error('Vote failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote('UPVOTE')}
        disabled={loading}
        className={`flex items-center justify-center w-7 h-7 rounded transition
          ${voted === 'UPVOTE'
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
          fill={voted === 'UPVOTE' ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <span className={`text-sm font-semibold min-w-[24px] text-center
        ${voted === 'UPVOTE' ? 'text-blue-600' : voted === 'DOWNVOTE' ? 'text-red-500' : 'text-gray-700'}`}>
        {score}
      </span>

      <button
        onClick={() => handleVote('DOWNVOTE')}
        disabled={loading}
        className={`flex items-center justify-center w-7 h-7 rounded transition
          ${voted === 'DOWNVOTE'
            ? 'text-red-500 bg-red-50'
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
          fill={voted === 'DOWNVOTE' ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
