import { useEffect, useState, useCallback } from "react";
import { useFormStore, useWebsiteStore } from "../store/store";
import Pagination from "../components/ui/Pagination";

// Modal for full form data
const FormModal = ({ form, onClose }) => {
    let parsedData = {};
    try {
        parsedData = typeof form.form_data === "string" ? JSON.parse(form.form_data) : form.form_data;
    } catch {
        parsedData = {};
    }

    const sectionType = parsedData?.section_type || "Unknown";
    const sectionId = parsedData?.section_id || null;
    const data = parsedData?.data || {};

    useEffect(() => {
        const handleKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <i data-lucide="mail" className="w-4 h-4 text-indigo-600"></i>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{sectionType}</p>
                            {sectionId && <p className="text-xs text-gray-400">Section #{sectionId}</p>}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i data-lucide="x" className="w-4 h-4"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Form Fields</p>
                    {Object.entries(data).length > 0 ? (
                        <div className="space-y-3">
                            {Object.entries(data).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 rounded-lg px-4 py-3">
                                    <p className="text-xs font-medium text-gray-400 capitalize mb-0.5">{key}</p>
                                    <p className="text-sm text-gray-800 break-words">{String(value)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No form data available</p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                        Submitted on {new Date(form.created_at).toLocaleString()}
                    </span>
                    <button
                        onClick={onClose}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Table row
const FormRow = ({ form, onDelete }) => {
    const [selected, setSelected] = useState(false);

    let parsedData = {};
    try {
        parsedData = typeof form.form_data === "string" ? JSON.parse(form.form_data) : form.form_data;
    } catch {
        parsedData = {};
    }

    const sectionType = parsedData?.section_type || "Unknown";
    const sectionId = parsedData?.section_id || null;
    const data = parsedData?.data || {};
    const entries = Object.entries(data);

    // Build a short preview: first 2 field values joined
    const preview = entries
        .slice(0, 2)
        .map(([, v]) => String(v))
        .join(" · ");

    return (
        <>
            <tr
                className="group border-b border-gray-100 hover:bg-indigo-50/40 cursor-pointer transition-colors"
                onClick={() => setSelected(true)}
            >
                {/* Icon + type */}
                <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-indigo-100 rounded-md flex items-center justify-center flex-shrink-0">
                            <i data-lucide="mail" className="w-3.5 h-3.5 text-indigo-600"></i>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">{sectionType}</p>
                            {sectionId && <p className="text-xs text-gray-400">Section #{sectionId}</p>}
                        </div>
                    </div>
                </td>

                {/* Preview */}
                <td className="px-5 py-3.5 max-w-xs">
                    <p className="text-sm text-gray-500 truncate">{preview || <span className="italic text-gray-300">No data</span>}</p>
                </td>

                {/* Fields count */}
                <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-semibold rounded-full w-6 h-6">
                        {entries.length}
                    </span>
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                    {new Date(form.created_at).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setSelected(true)}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-500 transition-colors"
                            title="View full submission"
                        >
                            <i data-lucide="eye" className="w-3.5 h-3.5"></i>
                        </button>
                        <button
                            onClick={() => onDelete(form.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                            title="Delete submission"
                        >
                            <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </td>
            </tr>

            {selected && <FormModal form={form} onClose={() => setSelected(false)} />}
        </>
    );
};

const Forms = () => {
    const { selectedWebsite } = useWebsiteStore();
    const {
        forms,
        loading,
        error,
        fetchForms,
        deleteForm,
        clearForms,
        pagination,
        totalPages,
        totalItems,
    } = useFormStore();

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12;

    const loadForms = useCallback(
        (page = 1) => {
            if (selectedWebsite?.id) {
                fetchForms(selectedWebsite.id, page, perPage);
            }
        },
        [selectedWebsite, fetchForms]
    );

    useEffect(() => {
        setCurrentPage(1);
        clearForms();
        loadForms(1);
    }, [selectedWebsite]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        loadForms(page);
    };

    const handleDelete = async (formId) => {
        if (!window.confirm("Are you sure you want to delete this form submission?")) return;
        try {
            await deleteForm(formId);
        } catch { }
    };

    return (
        <>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Form Submissions</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    All form submissions for{" "}
                    <span className="font-medium text-indigo-700">
                        {selectedWebsite?.name || "No website selected"}
                    </span>
                </p>
            </div>

            {!selectedWebsite ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="globe" className="w-6 h-6 text-gray-400"></i>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No website selected</h3>
                    <p className="text-sm text-gray-500">Please select a website to view its form submissions.</p>
                </div>
            ) : loading && forms.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {["Type", "Preview", "Fields", "Date", ""].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50 animate-pulse">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 bg-gray-200 rounded-md"></div>
                                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5"><div className="h-3 bg-gray-100 rounded w-48"></div></td>
                                    <td className="px-5 py-3.5"><div className="h-5 w-5 bg-gray-100 rounded-full mx-auto"></div></td>
                                    <td className="px-5 py-3.5"><div className="h-3 bg-gray-100 rounded w-20"></div></td>
                                    <td className="px-5 py-3.5"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <i data-lucide="alert-circle" className="w-6 h-6 text-red-500 mx-auto mb-2"></i>
                    <p className="text-sm font-medium text-red-700">{error}</p>
                    <button
                        onClick={() => loadForms(currentPage)}
                        className="mt-3 text-sm text-red-600 underline hover:text-red-800"
                    >
                        Try again
                    </button>
                </div>
            ) : forms.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="inbox" className="w-6 h-6 text-indigo-400"></i>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No submissions yet</h3>
                    <p className="text-sm text-gray-500">Form submissions for this website will appear here.</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Preview</th>
                                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Fields</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {forms.map((form) => (
                                    <FormRow key={form.id} form={form} onDelete={handleDelete} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={perPage}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                </>
            )}
        </>
    );
};

export default Forms;