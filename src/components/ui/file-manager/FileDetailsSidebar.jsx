import {
  X,
  Download,
  Trash2,
  Calendar,
  HardDrive,
  FileType,
  Link as LinkIcon,
} from "lucide-react";

const FileDetailsSidebar = ({ file, isOpen, onClose, onDelete }) => {
  if (!isOpen || !file) return null;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(file.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setMenuOpen(false);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderFilePreview = () => {
    if (file.type === "image" && file.file_url) {
      return (
        <div className="p-4 border-b border-gray-700">
          <img
            src={file.file_url}
            alt={file.file_original_name}
            className="w-full rounded-lg"
          />
        </div>
      );
    }

    if (file.type === "pdf" && file.file_url) {
      return (
        <div className="p-4 border-b border-gray-700 h-96">
          <iframe
            src={file.file_url}
            title={file.file_original_name}
            className="w-full h-full rounded-lg"
          />
        </div>
      );
    }

    if (file.type === "video" && file.file_url) {
      return (
        <div className="p-4 border-b border-gray-700">
          <video src={file.file_url} controls className="w-full rounded-lg" />
        </div>
      );
    }

    if (file.type === "audio" && file.file_url) {
      return (
        <div className="p-4 border-b border-gray-700">
          <audio src={file.file_url} controls className="w-full" />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={onClose}
      />

      <aside className="fixed lg:relative right-0 top-0 h-full w-full sm:w-96 bg-[#1a2332] border-l border-gray-700 z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">File Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderFilePreview()}

          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">
                File Name
              </h4>
              <p className="text-sm break-words">{file.file_original_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                  <HardDrive size={14} />
                  Size
                </h4>
                <p className="text-sm">{formatFileSize(file.file_size)}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                  <FileType size={14} />
                  Type
                </h4>
                <p className="text-sm uppercase">{file.extension}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">
                  File Type
                </h4>
                <p className="text-sm capitalize">{file.type}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">
                  Source
                </h4>
                <p className="text-sm capitalize">{file.from}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                <Calendar size={14} />
                Created
              </h4>
              <p className="text-sm">{formatDate(file.created_at)}</p>
            </div>

            {file.updated_at && file.updated_at !== file.created_at && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                  <Calendar size={14} />
                  Modified
                </h4>
                <p className="text-sm">{formatDate(file.updated_at)}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">
                File ID
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-gray-300 break-all flex-1">
                  {file.uuid}
                </p>
                <button
                  onClick={() => copyToClipboard(file.uuid)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                  title="Copy UUID"
                >
                  <LinkIcon size={14} />
                </button>
              </div>
            </div>

            {file.file_url && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                  <LinkIcon size={14} />
                  File URL
                </h4>
                <div className="flex items-start gap-2">
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 break-all flex-1"
                  >
                    {file.file_url}
                  </a>
                  <button
                    onClick={() => copyToClipboard(file.file_url)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                    title="Copy URL"
                  >
                    <LinkIcon size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download size={18} />
            <span>Download</span>
          </button>
          <button
            onClick={() => onDelete(file.uuid)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default FileDetailsSidebar;
