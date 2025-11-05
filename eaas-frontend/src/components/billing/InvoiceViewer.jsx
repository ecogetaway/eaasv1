// This component can be used to display invoice in an iframe or embed
// For now, we'll just redirect to download since PDFs are better handled via download

const InvoiceViewer = ({ billId }) => {
  return (
    <div className="card">
      <p className="text-gray-600 mb-4">
        Invoice PDF will be downloaded. Click the download button to view your invoice.
      </p>
      <iframe
        src={`${import.meta.env.VITE_API_URL}/bills/${billId}/invoice`}
        className="w-full h-screen border-0"
        title="Invoice"
      />
    </div>
  );
};

export default InvoiceViewer;

