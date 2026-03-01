import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTeamStore } from "../../store/store";
import { useAuth } from "../../context/Auth/UseAuth";
import { Shield, Mail, Clock, CheckCircle, XCircle, AlertCircle, LogIn, Loader2 } from "lucide-react";

const getRoleBadgeColor = (role) => {
    const colors = {
        owner: "bg-purple-100 text-purple-700 border-purple-200",
        admin: "bg-blue-100 text-blue-700 border-blue-200",
        editor: "bg-green-100 text-green-700 border-green-200",
        viewer: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[role] || colors.viewer;
};

const TeamInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const { user } = useAuth();
    const { fetchInvitationDetails, acceptTeamInvite, declineInvitation, loading } = useTeamStore();

    const [invitation, setInvitation] = useState(null);
    const [fetchError, setFetchError] = useState("");
    const [actionStatus, setActionStatus] = useState(null);
    const [actionError, setActionError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setFetchError("No invitation token found.");
            setIsLoading(false);
            return;
        }
        loadInvitation();
    }, [token]);

    const loadInvitation = async () => {
        setIsLoading(true);
        try {
            const data = await fetchInvitationDetails(token);
            setInvitation(data);
            setFetchError("");
        } catch {
            setFetchError("This invitation is invalid or has expired.");
            setInvitation(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async () => {
        setActionError("");
        try {
            await acceptTeamInvite({ token });
            setActionStatus("accepted");
        } catch (err) {
            setActionError(err.message || "Failed to accept invitation.");
        }
    };

    const handleDecline = async () => {
        setActionError("");
        try {
            await declineInvitation(invitation.id);
            setActionStatus("declined");
        } catch (err) {
            setActionError(err.message || "Failed to decline invitation.");
        }
    };

    const handleLogin = () => {
        const redirectTo = encodeURIComponent(`/team/invite?token=${token}`);
        navigate(`/login?redirect=${redirectTo}`);
    };

    if (!token || fetchError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-md w-full p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
                    <p className="text-sm text-gray-500 mb-6">{fetchError || "No invitation token found."}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-md w-full p-8 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500">Loading invitation details...</p>
                </div>
            </div>
        );
    }

    if (actionStatus === "accepted") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-md w-full p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">You're in!</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        You've successfully joined <span className="font-medium text-gray-800">{invitation?.website_name || "the team"}</span>.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (actionStatus === "declined") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-md w-full p-8 text-center">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Invitation Declined</h2>
                    <p className="text-sm text-gray-500 mb-6">You've declined the invitation. You can close this page.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-md w-full overflow-hidden">
                <div className="bg-indigo-600 px-6 py-8 text-center">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">You're Invited!</h2>
                    <p className="text-indigo-200 text-sm mt-1">You've been invited to join a team</p>
                </div>

                <div className="p-6">
                    {invitation && (
                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Website</span>
                                    <span className="font-medium text-gray-900">{invitation.website_name || `#${invitation.website_id}`}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Invited by</span>
                                    <span className="font-medium text-gray-900">{invitation.inviter_name}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Role</span>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(invitation.role)}`}>
                                        <Shield size={11} className="mr-1" />
                                        {invitation.role}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Expires</span>
                                    <span className="inline-flex items-center gap-1 text-gray-700">
                                        <Clock size={13} className="text-gray-400" />
                                        {new Date(invitation.expires_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {!user && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <p className="text-xs text-amber-700">
                                        <span className="font-medium">You need to be logged in</span> to accept this invitation.
                                        {invitation.email && (
                                            <> Please log in with <span className="font-medium">{invitation.email}</span>.</>
                                        )}
                                    </p>
                                </div>
                            )}

                            {user && invitation.email && user?.email?.toLowerCase() !== invitation.email.toLowerCase() && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-xs text-red-700">
                                        This invitation was sent to <span className="font-medium">{invitation.email}</span>, but you're logged in as <span className="font-medium">{user?.email}</span>. Please log in with the correct account.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {actionError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle size={15} />
                            {actionError}
                        </div>
                    )}

                    {!user ? (
                        <button
                            onClick={handleLogin}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            <LogIn size={16} />
                            Log In to Accept
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleDecline}
                                disabled={loading || (invitation?.email && user?.email?.toLowerCase() !== invitation.email.toLowerCase())}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={loading || (invitation?.email && user?.email?.toLowerCase() !== invitation.email.toLowerCase())}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        Accepting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={15} />
                                        Accept
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamInvite;