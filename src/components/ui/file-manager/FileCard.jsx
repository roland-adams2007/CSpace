import { useState, useRef, useEffect } from "react";
import {
  File,
  Image,
  FileText,
  Download,
  Trash2,
  MoreVertical,
  FolderInput,
} from "lucide-react";

const FileCard = ({ file, viewMode, onDelete, onImageClick, onMove }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const getFileIcon = (fileType) => {
    if (fileType === "image")
      return <Image className="w-12 h-12 text-gray-600" />;
    if (fileType === "pdf")
      return <FileText className="w-12 h-12 text-gray-600" />;
    return <File className="w-12 h-12 text-gray-600" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const truncateFileName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf("."));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
    return `${truncatedName}...${extension}`;
  };

  const handleFileClick = () => {
    if (file.type === "image" || file.type === "pdf" || file.type === "video" || file.type === "audio") {
      onImageClick(file);
    }
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

  const menuItems = [
    {
      icon: <Download size={16} />,
      label: "Download",
      action: handleDownload,
    },
    {
      icon: <FolderInput size={16} />,
      label: "Move to...",
      action: () => {
        onMove(file);
        setMenuOpen(false);
      },
    },
    {
      icon: <Trash2 size={16} />,
      label: "Delete",
      action: () => {
        onDelete(file.uuid);
        setMenuOpen(false);
      },
      danger: true,
    },
  ];

  if (viewMode === "grid") {
    return (
      <div className="bg-[#1e293b] border border-gray-700 rounded-lg p-3 group">
        <div
          className={`aspect-square bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden ${
            (file.type === "image" || file.type === "pdf" || file.type === "video" || file.type === "audio") ? "cursor-pointer" : ""
          }`}
          onClick={handleFileClick}
        >
          {file.type === "image" && file.file_url ? (
            <img
              src={file.file_url}
              alt={file.file_original_name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          ) : (
            getFileIcon(file.type)
          )}
        </div>
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" title={file.file_original_name}>
              {truncateFileName(file.file_original_name)}
            </p>
            <p className="text-xs text-gray-400">
              {formatFileSize(file.file_size)}
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-[#0f172a] border border-gray-600 rounded-lg shadow-lg z-10">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      item.danger ? "text-red-400 hover:text-red-300" : ""
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] border border-gray-700 rounded-lg p-4 flex items-center group">
      <div
        className={`w-10 h-10 bg-gray-800 rounded flex items-center justify-center overflow-hidden mr-4 flex-shrink-0 ${
          (file.type === "image" || file.type === "pdf" || file.type === "video" || file.type === "audio") ? "cursor-pointer" : ""
        }`}
        onClick={handleFileClick}
      >
        {file.type === "image" && file.file_url ? (
          <img
            src={file.file_url}
            alt={file.file_original_name}
            className="w-full h-full object-cover"
          />
        ) : (
          getFileIcon(file.type)
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" title={file.file_original_name}>
          {file.file_original_name}
        </p>
        <p className="text-sm text-gray-400">
          {formatFileSize(file.file_size)} •{" "}
          {new Date(file.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="relative ml-4" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical size={18} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-40 bg-[#0f172a] border border-gray-600 rounded-lg shadow-lg z-10">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  item.danger ? "text-red-400 hover:text-red-300" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileCard;