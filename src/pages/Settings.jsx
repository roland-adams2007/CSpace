import { useState, useEffect } from "react";
import { useAuth } from "../context/Auth/UseAuth";
import { useWebsiteStore, useTeamStore } from "../store/store";
import { useSearchParams } from "react-router-dom";
import { useAlert } from "../context/Alert/UseAlert";
import axiosInstance from "../api/axiosInstance";


const OWNER_ROLES = ["owner", "admin"];

const SkeletonBox = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

const SettingsSkeleton = () => (
    <div className="max-w-3xl mx-auto">
        <div className="mb-6">
            <SkeletonBox className="h-6 w-32 mb-2" />
            <SkeletonBox className="h-4 w-64" />
        </div>
        <div className="flex gap-2 border-b border-gray-200 mb-6 pb-3">
            <SkeletonBox className="h-8 w-36" />
            <SkeletonBox className="h-8 w-32" />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <SkeletonBox className="h-5 w-40 mb-2" />
                <SkeletonBox className="h-4 w-28" />
            </div>
            <div className="p-6 space-y-5">
                <div>
                    <SkeletonBox className="h-4 w-28 mb-2" />
                    <SkeletonBox className="h-10 w-full" />
                </div>
                <div>
                    <SkeletonBox className="h-4 w-16 mb-2" />
                    <SkeletonBox className="h-10 w-full" />
                    <SkeletonBox className="h-3 w-72 mt-1" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <SkeletonBox className="h-4 w-20 mb-1.5" />
                        <SkeletonBox className="h-3 w-48" />
                    </div>
                    <SkeletonBox className="h-6 w-11 rounded-full" />
                </div>
                <div className="flex justify-end pt-2">
                    <SkeletonBox className="h-9 w-28" />
                </div>
            </div>
        </div>
    </div>
);

const Settings = () => {
    const { selectedWebsite, updateWebsite } = useWebsiteStore();
    const { user, updateUser } = useAuth();
    const { members, loading: teamLoading, getTeamMembers } = useTeamStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [teamReady, setTeamReady] = useState(false);
    const { showAlert } = useAlert();

    const activeTab = searchParams.get("tab") || "website";

    const currentMember = members.find(
        (m) => m.email === user?.email || m.user_id === user?.id
    );
    const userRole = teamReady ? (currentMember?.role || "viewer") : null;
    const canEditWebsite = teamReady && OWNER_ROLES.includes(userRole);

    const [websiteForm, setWebsiteForm] = useState({
        name: selectedWebsite?.name || "",
        slug: selectedWebsite?.slug || "",
        is_published: selectedWebsite?.is_published === 1,
    });

    const [userForm, setUserForm] = useState({
        fname: user?.fname || "",
        lname: user?.lname || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [websiteSaved, setWebsiteSaved] = useState(false);
    const [userSaved, setUserSaved] = useState(false);
    const [isSubmittingWebsite, setIsSubmittingWebsite] = useState(false);
    const [isSubmittingUser, setIsSubmittingUser] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (selectedWebsite?.id) {
            setTeamReady(false);
            getTeamMembers(selectedWebsite.id).finally(() => {
                setTeamReady(true);
            });
        }
    }, [selectedWebsite?.id, getTeamMembers]);

    useEffect(() => {
        setWebsiteForm({
            name: selectedWebsite?.name || "",
            slug: selectedWebsite?.slug || "",
            is_published: selectedWebsite?.is_published === 1,
        });
    }, [selectedWebsite]);

    useEffect(() => {
        setUserForm((prev) => ({
            ...prev,
            fname: user?.fname || "",
            lname: user?.lname || "",
            email: user?.email || "",
        }));
    }, [user]);

    const handleTabChange = (tab) => {
        setSearchParams({ tab });
    };

    const handleWebsiteChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWebsiteForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
        if (name === "newPassword" || name === "confirmPassword") {
            setPasswordError("");
        }
    };

    const handleWebsiteSubmit = async (e) => {
        e.preventDefault();
        if (!canEditWebsite) return;

        setIsSubmittingWebsite(true);
        setWebsiteSaved(false);

        try {
            const response = await updateWebsite({
                id: selectedWebsite.id,
                name: websiteForm.name,
                is_published: websiteForm.is_published,
                slug: websiteForm.slug
            });

            setWebsiteSaved(true);
            showAlert('Website settings updated successfully!', 'success');

            setTimeout(() => setWebsiteSaved(false), 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update website settings';
            showAlert(errorMessage, 'error');
            console.error('Website update error:', error);
        } finally {
            setIsSubmittingWebsite(false);
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");

        if (userForm.newPassword && userForm.newPassword !== userForm.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setIsSubmittingUser(true);
        setUserSaved(false);

        try {
            const updateData = {
                fname: userForm.fname,
                lname: userForm.lname,
                email: userForm.email,
            };

            if (userForm.currentPassword && userForm.newPassword) {
                updateData.currentPassword = userForm.currentPassword;
                updateData.newPassword = userForm.newPassword;
            }

            const response = await axiosInstance.put('/users/update', updateData);

            if (response.data.user) {
                updateUser(response.data.user);
            }

            setUserSaved(true);
            showAlert('Profile updated successfully!', 'success');

            setUserForm(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));

            setTimeout(() => setUserSaved(false), 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            showAlert(errorMessage, 'error');
            console.error('User update error:', error);
        } finally {
            setIsSubmittingUser(false);
        }
    };

    if (!teamReady || teamLoading) {
        return <SettingsSkeleton />;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage your website and account preferences</p>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => handleTabChange("website")}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "website"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <i data-lucide="globe" className="w-4 h-4"></i>
                        Website Settings
                    </span>
                </button>
                <button
                    onClick={() => handleTabChange("user")}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "user"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <i data-lucide="user" className="w-4 h-4"></i>
                        User Settings
                    </span>
                </button>
            </div>

            {activeTab === "website" && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Website Settings</h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {selectedWebsite?.name || "No website selected"}
                            </p>
                        </div>
                        {!canEditWebsite && (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                                <i data-lucide="lock" className="w-3.5 h-3.5"></i>
                                View Only
                            </span>
                        )}
                    </div>

                    {!canEditWebsite && (
                        <div className="mx-6 mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <i data-lucide="alert-triangle" className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"></i>
                            <p className="text-sm text-amber-800">
                                You need <strong>Owner</strong> or <strong>Admin</strong> role to edit website settings. Contact your website owner for access.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleWebsiteSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Website Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={websiteForm.name}
                                onChange={handleWebsiteChange}
                                disabled={!canEditWebsite || isSubmittingWebsite}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                placeholder="My Website"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Slug
                            </label>
                            <div className="flex items-center">
                                <span className="px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">
                                    /c/
                                </span>
                                <input
                                    type="text"
                                    name="slug"
                                    value={websiteForm.slug}
                                    onChange={handleWebsiteChange}
                                    disabled={!canEditWebsite || isSubmittingWebsite}
                                    className="flex-1 px-3 py-2 rounded-r-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    placeholder="my-website"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Used in your website URL. Only lowercase letters, numbers, and hyphens.</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Published</p>
                                <p className="text-xs text-gray-500 mt-0.5">Make your website visible to the public</p>
                            </div>
                            <label className={`relative inline-flex items-center ${!canEditWebsite ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={websiteForm.is_published}
                                    onChange={handleWebsiteChange}
                                    disabled={!canEditWebsite || isSubmittingWebsite}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {canEditWebsite && (
                            <div className="flex items-center justify-end gap-3 pt-2">
                                {websiteSaved && (
                                    <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                                        <i data-lucide="check-circle" className="w-4 h-4"></i>
                                        Saved successfully
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmittingWebsite}
                                    className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmittingWebsite ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}

            {activeTab === "user" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900">Profile Information</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Update your personal details</p>
                        </div>
                        <form onSubmit={handleUserSubmit} className="p-6 space-y-5">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                                    {(user?.fname?.[0] || "U").toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user?.fname} {user?.lname}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded capitalize">
                                        {userRole}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                    <input
                                        type="text"
                                        name="fname"
                                        value={userForm.fname}
                                        onChange={handleUserChange}
                                        disabled={isSubmittingUser}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder="First name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                    <input
                                        type="text"
                                        name="lname"
                                        value={userForm.lname}
                                        onChange={handleUserChange}
                                        disabled={isSubmittingUser}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userForm.email}
                                    onChange={handleUserChange}
                                    disabled={isSubmittingUser}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="border-t border-gray-100 pt-5">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={userForm.currentPassword}
                                            onChange={handleUserChange}
                                            disabled={isSubmittingUser}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={userForm.newPassword}
                                                onChange={handleUserChange}
                                                disabled={isSubmittingUser}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="New password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={userForm.confirmPassword}
                                                onChange={handleUserChange}
                                                disabled={isSubmittingUser}
                                                className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${passwordError ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                    {passwordError && (
                                        <p className="text-sm text-red-600 flex items-center gap-1.5">
                                            <i data-lucide="alert-circle" className="w-4 h-4"></i>
                                            {passwordError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                {userSaved && (
                                    <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                                        <i data-lucide="check-circle" className="w-4 h-4"></i>
                                        Saved successfully
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmittingUser}
                                    className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmittingUser ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;