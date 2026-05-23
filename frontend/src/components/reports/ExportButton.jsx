import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { downloadPdfReport } from '../../api/reports.api';
import { useToast } from '../../hooks/useToast';

const ExportButton = ({ repoId, repoName }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { showToast } = useToast();

  const handleDownload = async () => {
    if (!repoId) {
      showToast('Select a repository first', 'warning');
      return;
    }

    setIsDownloading(true);
    showToast('Generating and downloading PDF report...', 'info');

    try {
      const blobData = await downloadPdfReport(repoId);
      
      // Create element link to trigger browser download
      const blob = new Blob([blobData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DevTrackr-Report-${repoName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast('PDF report downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      let errorMessage = 'Failed to export PDF report. Please try again.';
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed && parsed.message) {
            errorMessage = parsed.message;
          }
        } catch (e) {
          // ignore
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="gradient"
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2 text-xs font-semibold py-2 px-3 shadow-indigo-500/20"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-white" />
          <span>Export PDF</span>
        </>
      )}
    </Button>
  );
};

export default ExportButton;
