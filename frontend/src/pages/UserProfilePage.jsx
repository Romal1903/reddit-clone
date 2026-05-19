import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UserProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold uppercase">
            {user?.username?.[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.username}</h1>
            <p className="text-sm text-gray-500">Posta member</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Username</span>
            <span className="text-sm font-medium text-gray-900">{user?.username}</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Link
            to="/create-post"
            className="block w-full text-center text-sm py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Post
          </Link>
          <Link
            to="/create-community"
            className="block w-full text-center text-sm py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Create Community
          </Link>
          <button
            onClick={logout}
            className="w-full text-sm py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
