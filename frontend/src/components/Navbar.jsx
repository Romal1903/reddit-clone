import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        <Link to="/" className="text-xl font-bold text-blue-600 shrink-0">
          Posta
        </Link>

        {user && (
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts or communities..."
              className="w-full px-4 py-1.5 text-sm border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white transition"
            />
          </form>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                to="/create-post"
                className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                + Post
              </Link>
              <Link
                to="/create-community"
                className="text-sm px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition hidden sm:block"
              >
                + Community
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                    {user.username?.[0]}
                  </div>
                  <span className="hidden sm:block">{user.username}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-700 truncate">{user.username}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/create-community"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:hidden"
                    >
                      + Community
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition">
                Login
              </Link>
              <Link to="/signup" className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
