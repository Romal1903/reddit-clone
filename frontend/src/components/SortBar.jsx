export default function SortBar({ sort, onSortChange }) {
  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit">
      <button
        onClick={() => onSortChange('new')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
          sort === 'new'
            ? 'bg-blue-600 text-white'
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        New
      </button>
      <button
        onClick={() => onSortChange('top')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
          sort === 'top'
            ? 'bg-blue-600 text-white'
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Top
      </button>
    </div>
  );
}
