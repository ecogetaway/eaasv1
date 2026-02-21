import { FileText, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';

const DocumentChecklist = ({ documents = [], showUploadButton = false }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'uploaded':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'uploaded':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'uploaded':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Required';
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primary-600" />
          Required Documents
        </h3>
        <p className="text-gray-500 text-sm">No documents required at this stage.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-primary-600" />
        Required Documents
      </h3>
      
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              getStatusColor(doc.status)
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <div className="mr-3 mt-0.5">
                  {getStatusIcon(doc.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{doc.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                      doc.status === 'uploaded' ? 'bg-yellow-100 text-yellow-700' :
                      doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                  <p className="text-sm opacity-75 mb-2">{doc.description}</p>
                  
                  {doc.uploaded_at && (
                    <p className="text-xs opacity-60">
                      Uploaded: {formatDate(doc.uploaded_at)}
                    </p>
                  )}
                  {doc.verified_at && (
                    <p className="text-xs opacity-60">
                      Verified: {formatDate(doc.verified_at)}
                    </p>
                  )}
                </div>
              </div>
              
              {showUploadButton && doc.status === 'required' && (
                <button
                  className="ml-4 px-3 py-1.5 text-sm btn btn-outline flex items-center"
                  onClick={() => {
                    // In demo mode, simulate upload
                    alert(`Demo Mode: Document "${doc.name}" would be uploaded here.\n\nIn production, this would open a file upload dialog.`);
                  }}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showUploadButton && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> In demo mode, document uploads are simulated. 
            In production, you would upload actual files (PDF, JPG, PNG) for verification.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentChecklist;

