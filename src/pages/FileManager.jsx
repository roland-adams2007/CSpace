import { useEffect, useState, useRef, useCallback } from "react";
import { useAssetStore, useWebsiteStore } from "../store/store";
import Pagination from "../components/ui/Pagination";
import { ImageCard } from "../components/ui/file-manager/ImageCard";
import ImageDetailsSidebar from "../components/ui/file-manager/ImageDetailsSidebar";
import { fileToBase64 } from "../utils/fileToBase64";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const FileManager = () => {
  const { selectedWebsite } = useWebsiteStore();
  const { assets, loading, pagination, fetchAssets, deleteAsset, uploadAsset } = useAssetStore();

  const [localAssets, setLocalAssets] = useState([]);
  const [localTotal, setLocalTotal] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDraggingOverModal, setIsDraggingOverModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const dragCounterRef = useRef(0);
  const modalDragCounterRef = useRef(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedWebsite?.id) {
      fetchAssets(selectedWebsite.id, 1, 24);
    }
  }, [selectedWebsite]);

  useEffect(() => {
    setLocalAssets(assets);
    setLocalTotal(pagination.total ?? assets.length);
  }, [assets, pagination.total]);

  const handlePageChange = (page) => {
    if (selectedWebsite?.id) {
      fetchAssets(selectedWebsite.id, page, 24);
    }
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    setLocalAssets((prev) => prev.filter((a) => a.id !== id));
    setLocalTotal((prev) => Math.max(0, prev - 1));
    if (selectedFile?.id === id) handleCloseSidebar();
    try {
      await deleteAsset(id);
    } catch {
      setLocalAssets(assets);
      setLocalTotal(pagination.total ?? assets.length);
    }
  };

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

  const addToast = (file, status, message) => {
    const id = `${file.name}-${Date.now()}`;
    setToasts((prev) => [
      ...prev,
      { id, fileName: file.name, fileSize: file.size, status, message },
    ]);
    return id;
  };

  const updateToast = (id, status, message) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, message } : t))
    );
    if (status === "success" || status === "error") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const processFiles = useCallback(
    async (files) => {
      if (!selectedWebsite?.id) return;
      setUploadModalOpen(false);

      for (const file of files) {
        const tempId = `temp-${file.name}-${Date.now()}`;
        const tempAsset = {
          id: tempId,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          file_path: URL.createObjectURL(file),
          created_at: new Date().toISOString(),
          _uploading: true,
        };

        setLocalAssets((prev) => [tempAsset, ...prev]);
        setLocalTotal((prev) => prev + 1);

        const toastId = addToast(file, "uploading", "Uploading...");

        try {
          const base64 = await fileToBase64(file);
          const result = await uploadAsset({
            website_id: selectedWebsite.id,
            file: base64,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
          });

          setLocalAssets((prev) =>
            prev.map((a) =>
              a.id === tempId
                ? { ...(result || a), id: result?.id || tempId, _uploading: false }
                : a
            )
          );

          updateToast(toastId, "success", "Upload complete!");
        } catch {
          setLocalAssets((prev) => prev.filter((a) => a.id !== tempId));
          setLocalTotal((prev) => Math.max(0, prev - 1));
          updateToast(toastId, "error", "Upload failed");
        }
      }
    },
    [selectedWebsite, uploadAsset]
  );

  const handleWindowDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      dragCounterRef.current++;
      if (!uploadModalOpen) setIsDraggingOver(true);
    },
    [uploadModalOpen]
  );

  const handleWindowDragLeave = useCallback(() => {
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDraggingOver(false);
  }, []);

  const handleWindowDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleWindowDrop = useCallback(
    (e) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsDraggingOver(false);
      if (!uploadModalOpen) {
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) processFiles(files);
      }
    },
    [uploadModalOpen, processFiles]
  );

  useEffect(() => {
    window.addEventListener("dragenter", handleWindowDragEnter);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);
    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, [handleWindowDragEnter, handleWindowDragLeave, handleWindowDragOver, handleWindowDrop]);

  const handleModalDragEnter = (e) => {
    e.preventDefault();
    modalDragCounterRef.current++;
    setIsDraggingOverModal(true);
  };

  const handleModalDragLeave = () => {
    modalDragCounterRef.current--;
    if (modalDragCounterRef.current === 0) setIsDraggingOverModal(false);
  };

  const handleModalDragOver = (e) => {
    e.preventDefault();
  };

  const handleModalDrop = (e) => {
    e.preventDefault();
    modalDragCounterRef.current = 0;
    setIsDraggingOverModal(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) processFiles(files);
    e.target.value = "";
  };

  return (
    <>
      {isDraggingOver && !uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-indigo-600/20 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none border-4 border-dashed border-indigo-500 m-4 rounded-2xl transition-all">
          <Upload className="w-16 h-16 text-indigo-500 mb-4 animate-bounce" />
          <p className="text-2xl font-bold text-indigo-700">Drop files to upload</p>
          <p className="text-sm text-indigo-500 mt-1">Release to start uploading</p>
        </div>
      )}

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onDragEnter={handleModalDragEnter}
            onDragLeave={handleModalDragLeave}
            onDragOver={handleModalDragOver}
            onDrop={handleModalDrop}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
                <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isDraggingOverModal
                    ? "border-indigo-400 bg-indigo-50 scale-[1.02]"
                    : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/50"
                  }`}
              >
                <Upload
                  className={`w-10 h-10 mb-3 transition-colors ${isDraggingOverModal ? "text-indigo-500" : "text-gray-400"
                    }`}
                />
                <p className="text-sm font-medium text-gray-700">
                  {isDraggingOverModal ? "Release to upload" : "Drop files here"}
                </p>
                <p className="text-xs text-gray-400 mt-1">or click to browse your files</p>
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                  {["image", "pdf", "video", "audio"].map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-3 animate-slide-in"
          >
            <div className="flex-shrink-0">
              {toast.status === "uploading" && (
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              )}
              {toast.status === "success" && (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              )}
              {toast.status === "error" && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{toast.fileName}</p>
              <p
                className={`text-xs ${toast.status === "error"
                    ? "text-red-500"
                    : toast.status === "success"
                      ? "text-emerald-500"
                      : "text-gray-400"
                  }`}
              >
                {toast.message}
              </p>
              {toast.status === "uploading" && (
                <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full animate-pulse w-2/3" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 flex-shrink-0">{formatFileSize(toast.fileSize)}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your uploaded assets</p>
          {selectedWebsite && (
            <p className="text-xs text-indigo-500 mt-0.5">
              Currently viewing: {selectedWebsite.name}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700">All Files</p>
            <p className="text-xs text-gray-400">
              {localTotal} files stored for {selectedWebsite?.name || "your website"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {localTotal} Files
            </span>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        {loading && localAssets.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : localAssets.length === 0 ? (
          <div
            onClick={() => setUploadModalOpen(true)}
            className="flex flex-col items-center justify-center py-20 text-center cursor-pointer group border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
          >
            <Upload className="w-10 h-10 text-gray-300 group-hover:text-indigo-400 transition-colors mb-3" />
            <p className="text-sm font-medium text-gray-500">No files yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Click or drag & drop files anywhere to upload
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {localAssets.map((file) => (
              <div
                key={file.id}
                className={`transition-opacity duration-300 ${file._uploading ? "opacity-60" : "opacity-100"
                  }`}
              >
                <ImageCard
                  file={file}
                  onSelect={file._uploading ? undefined : handleSelectFile}
                  onDelete={file._uploading ? undefined : handleDelete}
                  getFileUrl={getFileUrl}
                  formatFileSize={formatFileSize}
                />
              </div>
            ))}
          </div>
        )}

        {localAssets.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {sidebarOpen && selectedFile && (
        <ImageDetailsSidebar
          file={selectedFile}
          onClose={handleCloseSidebar}
          onDelete={handleDelete}
          getFileUrl={getFileUrl}
          formatFileSize={formatFileSize}
        />
      )}
    </>
  );
};

export default FileManager;