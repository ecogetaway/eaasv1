import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

const ErrorMessage = ({ 
  message, 
  onDismiss,
  className = '' 
}) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (dismissed) return null;

  return (
    <div 
      className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start justify-between ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="ml-4 text-red-500 hover:text-red-700 flex-shrink-0"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

