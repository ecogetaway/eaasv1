import { Link } from 'react-router-dom';
import { designSystemComponents, getComponentsByGroup } from '../../config/designSystem.js';

function StatusBadge({ status }) {
  const statusColors = {
    stable: 'text-green-600',
    beta: 'text-blue-600',
    deprecated: 'text-red-600',
    wip: 'text-amber-600',
  };
  
  return (
    <span className={`text-sm font-medium ${statusColors[status] || 'text-gray-600'}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function DesignSystemPage() {
  const uiComponents = getComponentsByGroup('ui');
  const complexComponents = getComponentsByGroup('complex');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Design System</h1>

      <h2 className="text-2xl font-semibold mb-4 mt-6">UI Components</h2>
      <p className="text-gray-600 mb-4">Radix UI wrappers and small components</p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uiComponents.map((component) => (
              <tr key={component.name}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">{component.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={component.status} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{component.description}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={component.route} className="text-sm text-blue-600 hover:text-blue-800 underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {complexComponents.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 mt-8">Complex Components</h2>
          <p className="text-gray-600 mb-4">Composite components with business logic</p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complexComponents.map((component) => (
                  <tr key={component.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{component.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={component.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{component.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={component.route} className="text-sm text-blue-600 hover:text-blue-800 underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

