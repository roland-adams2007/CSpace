import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Search,
} from "lucide-react";
import { useAssetStore } from "../../../store/store";
import { fileToBase64 } from "../../../utils/fileToBase64";
import Pagination from "../Pagination";
import { ImageCard } from "../ImageCard";

export default function FilePickerModal({
  isOpen,
  onClose,
  onSelectFile,
  websiteId,
  allowedTypes = ["image"],
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { assets, loading, pagination, fetchAssets, uploadAsset, deleteAsset } = useAssetStore();

  useEffect(() => {
    if (isOpen && websiteId) {
      setCurrentPage(1);
      fetchAssets(websiteId, 1);
    }
  }, [isOpen, websiteId, fetchAssets]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (allowedTypes.includes("image") && !file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const base64Data = await fileToBase64(file);
      const payload = {
        file: base64Data,
        filename: file.name,
        filetype: file.type,
        website_id: websiteId,
        file_size: file.size,
        file_original_name: file.name,
      };
      const newFile = await uploadAsset(payload);
      setSelectedFile(newFile);
      setCurrentPage(1);
      await fetchAssets(websiteId, 1);
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteAsset(fileId);
      if (selectedFile?.id === fileId) setSelectedFile(null);
      await fetchAssets(websiteId, currentPage);
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAssets(websiteId, page);
  };

  const handleSelect = () => {
    if (selectedFile) {
      onSelectFile(selectedFile);
      onClose();
    }
  };

  const filteredFiles = assets.filter((file) => {
    const matchesSearch = file.file_original_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      allowedTypes.includes("all") ||
      (allowedTypes.includes("image") && file.mime_type?.startsWith("image"));
    return matchesSearch && matchesType;
  });

  const getFileUrl = (file) => {
    if (file.file_path && file.file_path.startsWith("http")) return file.file_path;
    return `${import.meta.env.VITE_APP_URL}${file.file_path}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-gray-900">Select File</h2>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
              Choose a file or upload a new one
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors ml-2 shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-b border-gray-100 shrink-0">
          <div className="flex gap-2">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <label className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 text-sm font-medium">
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline text-xs">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">Upload</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept={allowedTypes.includes("image") ? "image/*" : "*"}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-40 sm:h-64">
              <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {filteredFiles.map((file) => (
                <ImageCard
                  key={file.id}
                  file={file}
                  isSelected={selectedFile?.id === file.id}
                  onSelect={setSelectedFile}
                  onDelete={handleDeleteFile}
                  getFileUrl={getFileUrl}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 sm:h-64 text-center px-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">No files found</h3>
              <p className="text-xs text-gray-400">Upload your first file to get started</p>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-1.5 shrink-0">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.lastPage}
            onPageChange={handlePageChange}
            loading={loading}
            totalItems={pagination.total}
            itemsPerPage={pagination.perPage}
          />
        </div>

        <div className="px-4 sm:px-6 py-3 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-gray-400 truncate min-w-0 flex-1">
            {selectedFile ? `Selected: ${selectedFile.file_original_name}` : "No file selected"}
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedFile}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}