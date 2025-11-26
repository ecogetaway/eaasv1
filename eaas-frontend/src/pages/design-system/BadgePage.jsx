import { Link } from 'react-router-dom';

export default function BadgePage() {
  return (
    <div className="p-8">
      <Link to="/design-system" className="text-sm text-gray-600 hover:text-gray-800 underline mb-4 inline-block">
        ← Back to Design System
      </Link>

      <h1 className="text-3xl font-bold mb-2 mt-4">Badge Component</h1>
      <p className="text-gray-600 mb-6">Badge component documentation coming soon</p>
    </div>
  );
}

