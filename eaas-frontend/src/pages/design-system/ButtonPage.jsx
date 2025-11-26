import { Link } from 'react-router-dom';

export default function ButtonPage() {
  return (
    <div className="p-8">
      <Link to="/design-system" className="text-sm text-gray-600 hover:text-gray-800 underline mb-4 inline-block">
        ← Back to Design System
      </Link>

      <h1 className="text-3xl font-bold mb-2 mt-4">Button Component</h1>
      <p className="text-gray-600 mb-6">Button component examples using Tailwind CSS</p>

      <h2 className="text-xl font-semibold mb-4 mt-6">Variants</h2>
      <div className="flex gap-3 flex-wrap mb-6">
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-outline">Outline</button>
        <button className="btn btn-ghost">Ghost</button>
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-6">Sizes</h2>
      <div className="flex gap-3 items-center flex-wrap mb-6">
        <button className="btn btn-primary btn-sm">Small</button>
        <button className="btn btn-primary">Medium</button>
        <button className="btn btn-primary btn-lg">Large</button>
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-6">Examples</h2>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Primary Button</p>
          <button className="btn btn-primary">Primary Button</button>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Success Button</p>
          <button className="btn bg-green-600 hover:bg-green-700 text-white">Success Button</button>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Error Button</p>
          <button className="btn btn-outline border-red-600 text-red-600 hover:bg-red-50">Error Button</button>
        </div>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-4">Usage</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="text-sm font-mono whitespace-pre-wrap">
{`<button className="btn btn-primary">
  Click Me
</button>`}
        </pre>
      </div>
    </div>
  );
}

