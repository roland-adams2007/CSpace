import { useEffect, useState } from "react";
import { useWebsiteStore, useTeamStore } from "../store/store";
import { useAuth } from "../context/Auth/UseAuth"
import Pagination from "../components/ui/Pagination";
import ConfirmModal from "../components/ui/modals/ConfirmModal";
import { Mail, UserPlus, MoreVertical, Shield, Clock, Check, X, AlertCircle, Search, Filter } from "lucide-react";

const Team = () => {
    const { selectedWebsite } = useWebsiteStore();
    const { user } = useAuth();
    const {
        members,
        pendingInvitations,
        loading,
        error,
        getTeamMembers,
        getPendingInvitations,
        sendTeamInvite,
        removeMember,
        declineInvitation,
        clearTeam
    } = useTeamStore();

    const memberCount = useTeamStore((state) => state.memberCount);
    const invitationCount = useTeamStore((state) => state.invitationCount);

    const [activeTab, setActiveTab] = useState("members");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("editor");
    const [searchTerm, setSearchTerm] = useState("");
    const [membersPage, setMembersPage] = useState(1);
    const [invitationsPage, setInvitationsPage] = useState(1);
    const [showActionsMenu, setShowActionsMenu] = useState(null);
    const [inviteError, setInviteError] = useState("");

    const itemsPerPage = 10;

    const currentUserRole = members.find(m => m.email === user?.email)?.role;

    const canManageTeam = currentUserRole === 'owner' || currentUserRole === 'admin';

    useEffect(() => {
        if (selectedWebsite?.id) {
            loadTeamData();
        }
        return () => {
            clearTeam();
        };
    }, [selectedWebsite]);

    const loadTeamData = async () => {
        if (selectedWebsite?.id) {
            await Promise.all([
                getTeamMembers(selectedWebsite.id),
                getPendingInvitations(selectedWebsite.id)
            ]);
        }
    };

    const filteredMembers = members.filter(member =>
        `${member.fname} ${member.lname} ${member.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedMembers = filteredMembers.slice(
        (membersPage - 1) * itemsPerPage,
        membersPage * itemsPerPage
    );

    const paginatedInvitations = pendingInvitations.slice(
        (invitationsPage - 1) * itemsPerPage,
        invitationsPage * itemsPerPage
    );

    const handleSendInvite = async () => {
        if (!inviteEmail || !selectedWebsite?.id || !canManageTeam) return;

        setInviteError("");
        try {
            await sendTeamInvite({
                email: inviteEmail,
                websiteId: selectedWebsite.id,
                role: inviteRole,
                expiresIn: 7 * 24 * 60 * 60 * 1000
            });
            setShowInviteModal(false);
            setInviteEmail("");
            setInviteRole("editor");
        } catch (error) {
            setInviteError(error.message || "Failed to send invitation");
        }
    };

    const handleRemoveMember = async () => {
        if (selectedMember && canManageTeam) {
            await removeMember(selectedMember.id);
            setSelectedMember(null);
        }
    };

    const handleDeclineInvitation = async (invitationId) => {
        if (canManageTeam) {
            await declineInvitation(invitationId);
        }
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            owner: "bg-purple-100 text-purple-700 border-purple-200",
            admin: "bg-blue-100 text-blue-700 border-blue-200",
            editor: "bg-green-100 text-green-700 border-green-200",
            viewer: "bg-gray-100 text-gray-700 border-gray-200"
        };
        return colors[role] || colors.viewer;
    };

    const getInitials = (fname, lname) => {
        return `${fname?.charAt(0) || ''}${lname?.charAt(0) || ''}`.toUpperCase();
    };

    if (!selectedWebsite) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Website Selected</h3>
                    <p className="text-sm text-gray-500 mt-1">Please select a website to manage team members</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Team Management</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Manage team members and invitations for {selectedWebsite.name}</p>
                    </div>
                    {canManageTeam && (
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                            <UserPlus size={18} />
                            Invite Member
                        </button>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter size={18} className="text-gray-500" />
                    </button>
                </div>

                <div className="mt-6 border-b border-gray-200">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab("members")}
                            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "members"
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Members ({memberCount})
                        </button>
                        <button
                            onClick={() => setActiveTab("invitations")}
                            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "invitations"
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Pending Invitations ({invitationCount})
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {!canManageTeam && activeTab === "invitations" && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-700 text-sm">
                    <AlertCircle size={16} />
                    You have view-only access to invitations. Only owners and admins can manage invitations.
                </div>
            )}

            {activeTab === "members" && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading && members.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center">
                                                <div className="flex items-center justify-center gap-2 text-gray-500">
                                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                                    Loading members...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : paginatedMembers.length > 0 ? (
                                        paginatedMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                                                            {getInitials(member.fname, member.lname)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {member.fname} {member.lname}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{member?.email}</div>
                                                            {member.email === user?.email && (
                                                                <span className="text-xs text-indigo-600">(You)</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role)}`}>
                                                        <Shield size={12} className="mr-1" />
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${member.is_active
                                                        ? "bg-green-100 text-green-700 border border-green-200"
                                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                                        }`}>
                                                        {member.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(member.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right relative">
                                                    {canManageTeam && member.role !== 'owner' && member.email !== user?.email && (
                                                        <button
                                                            onClick={() => setShowActionsMenu(showActionsMenu === member.id ? null : member.id)}
                                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        >
                                                            <MoreVertical size={16} className="text-gray-500" />
                                                        </button>
                                                    )}
                                                    {showActionsMenu === member.id && (
                                                        <div className="absolute right-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedMember(member);
                                                                    setShowConfirmModal(true);
                                                                    setShowActionsMenu(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                Remove from team
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No team members found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination
                        currentPage={membersPage}
                        totalPages={Math.ceil(filteredMembers.length / itemsPerPage)}
                        onPageChange={setMembersPage}
                        loading={loading}
                        totalItems={filteredMembers.length}
                        itemsPerPage={itemsPerPage}
                    />
                </>
            )}

            {activeTab === "invitations" && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading && pendingInvitations.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center">
                                                <div className="flex items-center justify-center gap-2 text-gray-500">
                                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                                    Loading invitations...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : paginatedInvitations.length > 0 ? (
                                        paginatedInvitations.map((invitation) => (
                                            <tr key={invitation?.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <Mail size={18} className="text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{invitation?.email}</div>
                                                            <div className="text-xs text-gray-400">Invited by {invitation?.inviter_name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(invitation?.role)}`}>
                                                        <Shield size={12} className="mr-1" />
                                                        {invitation?.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                                                        <Clock size={12} className="mr-1" />
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(invitation?.expires_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {canManageTeam && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleDeclineInvitation(invitation?.id)}
                                                                className="p-1 hover:bg-red-50 rounded transition-colors group"
                                                                title="Decline invitation"
                                                            >
                                                                <X size={16} className="text-gray-400 group-hover:text-red-500" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No pending invitations
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination
                        currentPage={invitationsPage}
                        totalPages={Math.ceil(pendingInvitations.length / itemsPerPage)}
                        onPageChange={setInvitationsPage}
                        loading={loading}
                        totalItems={pendingInvitations.length}
                        itemsPerPage={itemsPerPage}
                    />
                </>
            )}

            {showInviteModal && canManageTeam && (
                <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
                            <button
                                onClick={() => {
                                    setShowInviteModal(false);
                                    setInviteEmail("");
                                    setInviteRole("editor");
                                    setInviteError("");
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            {inviteError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                    <AlertCircle size={16} />
                                    {inviteError}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="colleague@company.com"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <select
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    >
                                        <option value="admin">Admin - Full access</option>
                                        <option value="editor">Editor - Can edit content</option>
                                        <option value="viewer">Viewer - Can only view</option>
                                    </select>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-xs text-blue-700">
                                        <span className="font-medium">Note:</span> The invitation will expire in 7 days.
                                        The user will receive an email with instructions to join your team.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setShowInviteModal(false);
                                    setInviteEmail("");
                                    setInviteRole("editor");
                                    setInviteError("");
                                }}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendInvite}
                                disabled={!inviteEmail || loading}
                                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail size={16} />
                                        Send Invitation
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedMember(null);
                }}
                onConfirm={handleRemoveMember}
                title="Remove Team Member"
                message={`Are you sure you want to remove ${selectedMember?.fname} ${selectedMember?.lname} from the team? This action cannot be undone.`}
                confirmDisabled={!canManageTeam}
            />
        </>
    );
};

export default Team;