"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
    Shield, Trash2, Key, X, CheckCircle2, Loader2, AlertTriangle,
    Eye, EyeOff, Download, CreditCard, Plus, Star, User,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { uploadFile, updateUserProfile, getPaymentMethods, savePaymentMethod, setDefaultPaymentMethod, deletePaymentMethod } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

interface PaymentCard {
    id: string; brand: string; last4: string; expiry: string; isDefault: boolean;
}
interface Toast {
    id: number; message: string; type: "success" | "error" | "info";
}

/* ═══════════════════════════════════════════════════════════════════════════
   Toast
   ═══════════════════════════════════════════════════════════════════════════ */
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
    const border = { success: "rgba(73,182,24,0.4)", error: "rgba(239,68,68,0.4)", info: "rgba(0,128,1,0.3)" };
    const color = { success: "#49B618", error: "#ef4444", info: "#008001" };
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => (
                <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-slide-up"
                    style={{ background: "#0a0f0a", borderColor: border[t.type] }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: color[t.type] }} />
                    <span className="text-sm text-white">{t.message}</span>
                    <button onClick={() => onRemove(t.id)} className="ml-2 text-[#555] hover:text-white transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
            <style>{`@keyframes slide-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.animate-slide-up{animation:slide-up .3s ease forwards}`}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Confirm Modal
   ═══════════════════════════════════════════════════════════════════════════ */
function ConfirmModal({ open, title, description, confirmLabel, danger, loading, onConfirm, onClose, children }: {
    open: boolean; title: string; description: string; confirmLabel: string; danger?: boolean;
    loading: boolean; onConfirm: () => void; onClose: () => void; children?: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
            <div className="bg-[#0a0f0a] border border-[#008001]/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: danger ? "rgba(239,68,68,0.15)" : "rgba(73,182,24,0.15)" }}>
                        <AlertTriangle className="w-5 h-5" style={{ color: danger ? "#ef4444" : "#49B618" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg">{title}</h3>
                        <p className="text-[#A0A0A0] text-sm mt-1 leading-relaxed">{description}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#1E1E1E] text-[#A0A0A0] hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {children}
                <div className="flex gap-3 mt-5">
                    <Button variant="outline" className="flex-1 text-sm h-10 border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 rounded-xl" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button className="flex-1 text-sm h-10 text-white rounded-xl" style={{ background: danger ? "linear-gradient(135deg,#dc2626,#ef4444)" : "linear-gradient(135deg,#008001,#49B618)" }} onClick={onConfirm} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Add Card Modal
   ═══════════════════════════════════════════════════════════════════════════ */
function AddCardModal({ open, loading, onSave, onClose }: {
    open: boolean; loading: boolean; onSave: (c: PaymentCard) => void; onClose: () => void;
}) {
    const [num, setNum] = useState(""); const [exp, setExp] = useState(""); const [cvc, setCvc] = useState(""); const [name, setName] = useState("");
    if (!open) return null;
    const fmt = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const fmtExp = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };
    const digits = num.replace(/\s/g, "");
    const canSave = digits.length >= 15 && exp.length >= 5 && cvc.length >= 3 && name.length >= 2;
    const handleSave = () => {
        onSave({ id: `card-${Date.now()}`, brand: digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : digits.startsWith("3") ? "Amex" : "Card", last4: digits.slice(-4), expiry: exp, isDefault: false });
        setNum(""); setExp(""); setCvc(""); setName("");
    };
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
            <div className="bg-[#0a0f0a] border border-[#008001]/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008001] to-[#49B618] flex items-center justify-center"><CreditCard className="w-5 h-5 text-white" /></div>
                        <h3 className="text-white font-bold text-lg">Add Payment Method</h3>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#1E1E1E] text-[#A0A0A0] hover:text-white flex items-center justify-center transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                    <div><label className="text-xs text-[#A0A0A0] mb-1.5 block">Cardholder Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full h-10 px-4 rounded-xl bg-[#1E1E1E] border border-[#008001]/20 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#49B618]/50 transition-colors" /></div>
                    <div><label className="text-xs text-[#A0A0A0] mb-1.5 block">Card Number</label>
                        <input type="text" value={num} onChange={(e) => setNum(fmt(e.target.value))} placeholder="4242 4242 4242 4242" className="w-full h-10 px-4 rounded-xl bg-[#1E1E1E] border border-[#008001]/20 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#49B618]/50 transition-colors" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-[#A0A0A0] mb-1.5 block">Expiry</label>
                            <input type="text" value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} placeholder="MM/YY" className="w-full h-10 px-4 rounded-xl bg-[#1E1E1E] border border-[#008001]/20 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#49B618]/50 transition-colors" /></div>
                        <div><label className="text-xs text-[#A0A0A0] mb-1.5 block">CVC</label>
                            <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" className="w-full h-10 px-4 rounded-xl bg-[#1E1E1E] border border-[#008001]/20 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#49B618]/50 transition-colors" /></div>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <Button variant="outline" className="flex-1 text-sm h-10 border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 rounded-xl" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button className="flex-1 text-sm h-10 text-white rounded-xl" style={{ background: "linear-gradient(135deg,#008001,#49B618)" }} onClick={handleSave} disabled={!canSave || loading}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Add Card
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Notification Row
   ═══════════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════════
   Section Header
   ═══════════════════════════════════════════════════════════════════════════ */
function SectionIcon({ icon: Icon, gradient }: { icon: React.ElementType; gradient?: string }) {
    return (
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${gradient || "bg-gradient-to-br from-[#008001] to-[#49B618]"}`}>
            <Icon className="w-4 h-4 text-white" />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════════════ */
export function Settings() {
    const [mounted, setMounted] = useState(false);
    const { profile, setProfile } = useUser();

    const [profileName, setProfileName] = useState(profile.name);
    const [profileEmail, setProfileEmail] = useState(profile.email);
    const [profilePhone, setProfilePhone] = useState(profile.phone);
    const [timezone, setTimezone] = useState(profile.timezone);
    const [language, setLanguage] = useState(profile.language);
    const [profileAvatar, setProfileAvatar] = useState(profile.avatar || "");
    const [profileSaving, setProfileSaving] = useState(false);

    useEffect(() => {
        setProfileName(profile.name);
        setProfileEmail(profile.email);
        setProfilePhone(profile.phone);
        setTimezone(profile.timezone);
        setLanguage(profile.language);
        setProfileAvatar(profile.avatar || "");
    }, [profile]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const res = await uploadFile(file);
                setProfileAvatar(res.url);
                setProfile({ avatar: res.url });
            } catch (err: any) {
                console.error("Avatar upload failed:", err);
                addToast("Failed to upload avatar: " + (err.message || 'Unknown error'), "error");
            }
        }
    };

    // Password
    const [currentPw, setCurrentPw] = useState(""); const [newPw, setNewPw] = useState(""); const [confirmPw, setConfirmPw] = useState("");
    const [showCurrentPw, setShowCurrentPw] = useState(false); const [showNewPw, setShowNewPw] = useState(false);
    const [pwLoading, setPwLoading] = useState(false); const [pwError, setPwError] = useState("");



    // Payment Cards
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [addCardModal, setAddCardModal] = useState(false); const [addCardLoading, setAddCardLoading] = useState(false);
    const [deleteCardId, setDeleteCardId] = useState<string | null>(null); const [deleteCardLoading, setDeleteCardLoading] = useState(false);

    // Load all payment methods from API on mount
    useEffect(() => {
        getPaymentMethods()
            .then(methods => {
                if (methods && Array.isArray(methods)) {
                    setCards(methods.map(m => ({
                        id: m.id || `card-${Date.now()}-${Math.random()}`,
                        brand: m.brand,
                        last4: m.last4,
                        expiry: m.expiry,
                        isDefault: m.isDefault || false
                    })));
                }
            })
            .catch(() => {});
    }, []);



    // Appearance
    const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
    const [compactMode, setCompactMode] = useState(false);




    // Danger Zone
    const [deleteModal, setDeleteModal] = useState(false); const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false); const [exportLoading, setExportLoading] = useState(false);

    // Toasts
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
        const id = Date.now() + Math.random();
        setToasts((p) => [...p, { id, message, type }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
    }, []);
    const removeToast = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

    useEffect(() => { setMounted(true); }, []);

    const fadeIn = (delay: number) => ({
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    });

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleSaveProfile = async () => {
        setProfileSaving(true);
        try {
            await updateUserProfile({ name: profileName, phone: profilePhone, timezone, language, avatar: profileAvatar });
            setProfile({ name: profileName, email: profileEmail, phone: profilePhone, timezone, language, avatar: profileAvatar });
            addToast("Profile updated successfully!");
        } catch (err: any) {
            addToast("Failed to update profile: " + (err.message || "Unknown error"), "error");
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        setPwError("");
        if (!currentPw) { setPwError("Current password is required"); return; }
        if (newPw.length < 8) { setPwError("New password must be at least 8 characters"); return; }
        if (newPw !== confirmPw) { setPwError("Passwords don't match"); return; }
        setPwLoading(true);
        try {
            const user = auth.currentUser;
            if (!user || !user.email) { setPwError("Not authenticated. Please log in again."); return; }
            const credential = EmailAuthProvider.credential(user.email, currentPw);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPw);
            setCurrentPw(""); setNewPw(""); setConfirmPw("");
            addToast("Password updated!");
        } catch (err: any) {
            const msg = err.code === "auth/wrong-password" || err.code === "auth/invalid-credential"
                ? "Current password is incorrect"
                : err.code === "auth/too-many-requests"
                ? "Too many attempts. Try again later."
                : err.message || "Failed to update password";
            setPwError(msg);
        } finally {
            setPwLoading(false);
        }
    };



    const handleAddCard = async (card: PaymentCard) => {
        setAddCardLoading(true);
        try {
            const added = await savePaymentMethod({ brand: card.brand, last4: card.last4, expiry: card.expiry });
            // Refresh list from API to be sure or just update local state
            setCards((p) => {
                if (added.isDefault) {
                    return [...p.map((c) => ({ ...c, isDefault: false })), { ...added, id: added.id!, isDefault: true }];
                }
                return [...p, { ...added, id: added.id!, isDefault: false }];
            });
            setAddCardModal(false);
            addToast(`${card.brand} •••• ${card.last4} added`);
        } catch (err: any) {
            addToast("Failed to add card: " + (err.message || "Unknown error"), "error");
        } finally {
            setAddCardLoading(false);
        }
    };

    const handleDeleteCard = async () => {
        if (!deleteCardId) return;
        setDeleteCardLoading(true);
        try {
            await deletePaymentMethod(deleteCardId);
            const c = cards.find((x) => x.id === deleteCardId);
            const remaining = cards.filter((x) => x.id !== deleteCardId);
            
            // If we deleted the default one, the backend will assign a new one
            // Let's just refresh the whole list to be safe
            const methods = await getPaymentMethods();
            setCards(methods.map(m => ({
                id: m.id!,
                brand: m.brand,
                last4: m.last4,
                expiry: m.expiry,
                isDefault: m.isDefault!
            })));
            
            addToast(`Removed ${c?.brand} •••• ${c?.last4}`, "info");
        } catch (err: any) {
            addToast("Failed to remove card: " + (err.message || "Unknown error"), "error");
        } finally {
            setDeleteCardLoading(false);
            setDeleteCardId(null);
        }
    };

    const handleSetDefault = async (cardId: string) => {
        const c = cards.find((x) => x.id === cardId);
        if (!c) return;
        try {
            await setDefaultPaymentMethod(cardId);
            setCards((p) => p.map((card) => ({ ...card, isDefault: card.id === cardId })));
            addToast(`${c.brand} •••• ${c.last4} set as default`);
        } catch (err: any) {
            addToast("Failed to update default: " + (err.message || "Unknown error"), "error");
        }
    };



    const handleDeleteAccount = async () => {
        setDeleteLoading(true); await new Promise((r) => setTimeout(r, 2000));
        setDeleteLoading(false); setDeleteModal(false); setDeleteConfirmText("");
        addToast("Account deletion requested. Check your email.", "info");
    };

    const handleExportData = async () => {
        setExportLoading(true); await new Promise((r) => setTimeout(r, 2000));
        const data = { exportDate: new Date().toISOString(), account: { name: profileName, email: profileEmail, plan: "Pro" }, cards: cards.map((c) => ({ brand: c.brand, last4: c.last4 })) };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob); const a = document.createElement("a");
        a.href = url; a.download = `samcard-export-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        setExportLoading(false); addToast("Data exported successfully!");
    };

    const pwStrength = !newPw ? 0 : newPw.length >= 12 && /[A-Z]/.test(newPw) && /[0-9]/.test(newPw) && /[^A-Za-z0-9]/.test(newPw) ? 4 : newPw.length >= 10 && /[A-Z]/.test(newPw) && /[0-9]/.test(newPw) ? 3 : newPw.length >= 8 ? 2 : 1;
    const pwLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
    const pwColors = ["", "#ef4444", "#fbbf24", "#49B618", "#49B618"];
    const deleteCard = deleteCardId ? cards.find((c) => c.id === deleteCardId) : null;

    return (
        <>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <AddCardModal open={addCardModal} loading={addCardLoading} onSave={handleAddCard} onClose={() => setAddCardModal(false)} />
            <ConfirmModal open={!!deleteCardId} title="Remove Payment Method?" description={`Remove ${deleteCard?.brand} ending in ${deleteCard?.last4}? This cannot be undone.`} confirmLabel="Remove Card" danger loading={deleteCardLoading} onConfirm={handleDeleteCard} onClose={() => setDeleteCardId(null)} />
            <ConfirmModal open={deleteModal} title="Delete Your Account?" description="This action is permanent. All cards, contacts, and data will be deleted." confirmLabel="Delete Account" danger loading={deleteLoading} onConfirm={handleDeleteAccount} onClose={() => { setDeleteModal(false); setDeleteConfirmText(""); }}>
                <div className="mt-3 space-y-3">
                    <div className="p-3 rounded-xl bg-[#ef4444]/5 border border-[#ef4444]/20"><p className="text-xs text-[#ef4444]">⚠ This will permanently delete everything.</p></div>
                    <div><Label className="text-xs text-[#A0A0A0] mb-1.5 block">Type <span className="text-[#ef4444] font-semibold">DELETE</span> to confirm</Label>
                        <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="DELETE" className="w-full h-10 px-4 rounded-xl bg-[#1E1E1E] border border-[#ef4444]/20 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#ef4444]/50 transition-colors" /></div>
                </div>
            </ConfirmModal>

            <div className="space-y-4 sm:space-y-6">
                {/* ═══ ROW 1: Profile + Payment Methods ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* ── Profile ──────────────────────────────────────────────── */}
                    <Card className="bg-[#000000] border-[#008001]/30 relative overflow-hidden" style={fadeIn(0)}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#008001] to-transparent opacity-[0.04] blur-3xl pointer-events-none" />
                        <CardHeader className="border-b border-[#008001]/20 pb-4">
                            <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                                <SectionIcon icon={User} /><span>Profile Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            {/* Avatar */}
                            <div className="flex items-center gap-4 mb-2">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#008001] to-[#49B618] shadow-lg shadow-[#008001]/20">
                                    {profileAvatar ? (
                                        <img src={profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                                            {profileName.split(" ").map((n) => n[0]).join("")}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{profileName}</p>
                                    <p className="text-xs text-[#A0A0A0] mt-0.5">{profileEmail}</p>
                                    <label className="text-[10px] text-[#49B618] hover:text-white mt-1 transition-colors cursor-pointer">
                                        Change avatar
                                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div><Label className="text-xs text-[#A0A0A0] mb-1.5">Full Name</Label>
                                    <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="bg-[#1E1E1E] border-[#008001]/30 text-white h-10 rounded-xl text-sm" /></div>
                                <div><Label className="text-xs text-[#A0A0A0] mb-1.5">Email</Label>
                                    <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="bg-[#1E1E1E] border-[#008001]/30 text-white h-10 rounded-xl text-sm" /></div>
                                <div><Label className="text-xs text-[#A0A0A0] mb-1.5">Phone</Label>
                                    <Input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="bg-[#1E1E1E] border-[#008001]/30 text-white h-10 rounded-xl text-sm" /></div>
                                <div><Label className="text-xs text-[#A0A0A0] mb-1.5">Timezone</Label>
                                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-[#1E1E1E] border border-[#008001]/30 text-white text-sm focus:outline-none focus:border-[#49B618]/50">
                                        <option value="America/Los_Angeles">Pacific (PT)</option><option value="America/Denver">Mountain (MT)</option>
                                        <option value="America/Chicago">Central (CT)</option><option value="America/New_York">Eastern (ET)</option>
                                        <option value="Europe/London">London (GMT)</option><option value="Asia/Karachi">Pakistan (PKT)</option>
                                    </select></div>
                            </div>
                            <div><Label className="text-xs text-[#A0A0A0] mb-1.5">Language</Label>
                                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-[#1E1E1E] border border-[#008001]/30 text-white text-sm focus:outline-none focus:border-[#49B618]/50">
                                    <option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="ur">اردو</option>
                                </select></div>
                            <Button className="text-white text-xs h-9 rounded-full gap-1.5" style={{ background: "linear-gradient(135deg,#008001,#49B618)" }} onClick={handleSaveProfile} disabled={profileSaving}>
                                {profileSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    {/* ── Payment Methods ──────────────────────────────────────── */}
                    <Card className="bg-[#000000] border-[#008001]/30 relative overflow-hidden" style={fadeIn(100)}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#49B618] to-transparent opacity-[0.03] blur-3xl pointer-events-none" />
                        <CardHeader className="border-b border-[#008001]/20 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                                    <SectionIcon icon={CreditCard} /><span>Payment Methods</span>
                                </CardTitle>
                                <Button size="sm" className="text-white text-xs h-9 rounded-full gap-1.5" style={{ background: "linear-gradient(135deg,#008001,#49B618)" }} onClick={() => setAddCardModal(true)}>
                                    <Plus className="w-3.5 h-3.5" />Add Card
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-3">
                            {cards.length === 0 && <p className="text-sm text-[#555] text-center py-8">No payment methods added</p>}
                            {cards.map((card) => (
                                <div key={card.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-[#008001]/20 bg-[#111a11] hover:bg-[#0f1f0f] transition-colors group">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${card.isDefault ? "bg-gradient-to-br from-[#008001] to-[#49B618] shadow-[#008001]/20" : "bg-[#1E1E1E] border border-[#008001]/20"}`}>
                                        <CreditCard className={`w-5 h-5 ${card.isDefault ? "text-white" : "text-[#A0A0A0]"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white">{card.brand} •••• {card.last4}</p>
                                            {card.isDefault && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#49B618]/15 text-[#49B618] border border-[#49B618]/20"><Star className="w-2.5 h-2.5" />Default</span>}
                                        </div>
                                        <p className="text-xs text-[#A0A0A0] mt-0.5">Expires {card.expiry}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {!card.isDefault && (
                                            <Button variant="outline" size="sm" className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 text-[10px] h-7 rounded-lg px-2" onClick={() => handleSetDefault(card.id)}>
                                                Set Default
                                            </Button>
                                        )}
                                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#555] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors" onClick={() => setDeleteCardId(card.id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <p className="text-[10px] text-[#555] pt-1">Your default payment method is used for subscription billing and orders.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ═══ ROW 2: Security + Notifications ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* ── Security ─────────────────────────────────────────────── */}
                    <Card className="bg-[#000000] border-[#008001]/30 relative overflow-hidden" style={fadeIn(200)}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#008001] to-transparent opacity-[0.04] blur-3xl pointer-events-none" />
                        <CardHeader className="border-b border-[#008001]/20 pb-4">
                            <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2"><SectionIcon icon={Shield} />Security</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-5">
                            {/* Password */}
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Key className="w-3.5 h-3.5 text-[#49B618]" />Change Password</h4>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Label className="text-xs text-[#A0A0A0] mb-1.5">Current Password</Label>
                                        <Input type={showCurrentPw ? "text" : "password"} value={currentPw} onChange={(e) => { setCurrentPw(e.target.value); setPwError(""); }} className="bg-[#1E1E1E] border-[#008001]/30 text-white pr-10 h-10 rounded-xl text-sm" placeholder="Enter current password" />
                                        <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 bottom-3 text-[#555] hover:text-white transition-colors">
                                            {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Label className="text-xs text-[#A0A0A0] mb-1.5">New Password</Label>
                                        <Input type={showNewPw ? "text" : "password"} value={newPw} onChange={(e) => { setNewPw(e.target.value); setPwError(""); }} className="bg-[#1E1E1E] border-[#008001]/30 text-white pr-10 h-10 rounded-xl text-sm" placeholder="Min. 8 characters" />
                                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 bottom-3 text-[#555] hover:text-white transition-colors">
                                            {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        {newPw && <div className="mt-2 flex items-center gap-2"><div className="flex gap-1 flex-1">{[1, 2, 3, 4].map((i) => <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= pwStrength ? pwColors[pwStrength] : "#1E1E1E" }} />)}</div><span className="text-[10px] text-[#555]">{pwLabel}</span></div>}
                                    </div>
                                    <div>
                                        <Label className="text-xs text-[#A0A0A0] mb-1.5">Confirm Password</Label>
                                        <Input type="password" value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); setPwError(""); }} className="bg-[#1E1E1E] border-[#008001]/30 text-white h-10 rounded-xl text-sm" placeholder="Re-enter new password" />
                                        {confirmPw && newPw && confirmPw !== newPw && <p className="text-[10px] text-[#ef4444] mt-1">Passwords don&apos;t match</p>}
                                    </div>
                                    {pwError && <div className="p-2.5 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20"><p className="text-xs text-[#ef4444]">{pwError}</p></div>}
                                    <Button className="text-white text-xs h-9 rounded-full gap-1.5" style={{ background: "linear-gradient(135deg,#008001,#49B618)" }} onClick={handlePasswordChange} disabled={pwLoading || !currentPw || !newPw || !confirmPw}>
                                        {pwLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}<Key className="w-3.5 h-3.5" />Update Password
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Danger Zone ──────────────────────────────────────── */}
                    <Card className="bg-[#000000] border-2 border-[#ef4444]/20 relative overflow-hidden" style={fadeIn(350)}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#ef4444] to-transparent opacity-[0.03] blur-3xl pointer-events-none" />
                        <CardHeader className="border-b border-[#ef4444]/10 pb-4">
                            <CardTitle className="text-[#ef4444] text-base sm:text-lg flex items-center gap-2"><SectionIcon icon={Trash2} gradient="bg-[#ef4444]/10 border border-[#ef4444]/20" />Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div><h4 className="text-sm font-semibold text-white">Delete Account</h4><p className="text-xs text-[#A0A0A0] mt-0.5">Permanently delete everything</p></div>
                                <Button variant="outline" className="text-[#ef4444] border-[#ef4444]/30 hover:bg-[#ef4444]/10 text-xs h-9 rounded-full gap-1.5 flex-shrink-0" onClick={() => setDeleteModal(true)}>
                                    <Trash2 className="w-3.5 h-3.5" />Delete Account
                                </Button>
                            </div>
                            <Separator className="bg-[#ef4444]/10" />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div><h4 className="text-sm font-semibold text-white">Export Data</h4><p className="text-xs text-[#A0A0A0] mt-0.5">Download all your data as JSON</p></div>
                                <Button variant="outline" className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 text-xs h-9 rounded-full gap-1.5 flex-shrink-0" onClick={handleExportData} disabled={exportLoading}>
                                    {exportLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}{exportLoading ? "Exporting…" : "Export Data"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
