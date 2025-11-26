import { CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

const SuccessMessage = ({ 
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
      className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start justify-between ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="ml-4 text-green-500 hover:text-green-700 flex-shrink-0"
          aria-label="Dismiss success message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;

