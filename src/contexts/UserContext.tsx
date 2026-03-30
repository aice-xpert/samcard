"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserProfile, updateUserProfile, ApiUser } from "@/lib/api";

export interface ConnectedAccountData {
    id: string;
    name: string;
    icon: string;
    connected: boolean;
    email?: string;
    url?: string;
}

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    timezone: string;
    language: string;
    avatar?: string;
}

interface UserContextType {
    profile: UserProfile;
    setProfile: (p: Partial<UserProfile>) => void;
    connectedAccounts: ConnectedAccountData[];
    setConnectedAccount: (acc: Partial<ConnectedAccountData> & { id: string }) => void;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
    name: "",
    email: "",
    phone: "",
    timezone: "UTC",
    language: "en",
    avatar: "",
};

const defaultAccounts: ConnectedAccountData[] = [
    { id: "google", name: "Google", icon: "G", connected: false },
    { id: "linkedin", name: "LinkedIn", icon: "in", connected: false },
    { id: "github", name: "GitHub", icon: "GH", connected: false },
    { id: "twitter", name: "Twitter", icon: "X", connected: false },
    { id: "instagram", name: "Instagram", icon: "IG", connected: false },
];

const STORAGE_KEY = "samcard_user_data";

function loadFromStorage(): { profile: UserProfile; accounts: ConnectedAccountData[] } {
    if (typeof window === "undefined") return { profile: defaultProfile, accounts: defaultAccounts };
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                profile: { ...defaultProfile, ...parsed.profile },
                accounts: parsed.accounts || defaultAccounts,
            };
        }
    } catch { }
    return { profile: defaultProfile, accounts: defaultAccounts };
}

function saveToStorage(profile: UserProfile, accounts: ConnectedAccountData[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, accounts }));
    } catch { }
}

const UserContext = createContext<UserContextType>({
    profile: defaultProfile,
    setProfile: () => { },
    connectedAccounts: defaultAccounts,
    setConnectedAccount: () => { },
    loading: true,
    refreshProfile: async () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountData[]>(defaultAccounts);

    const refreshProfile = async () => {
        try {
            const user = await getUserProfile();
            const newProfile: UserProfile = {
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                timezone: user.timezone || "UTC",
                language: user.language || "en",
                avatar: user.avatar || "",
            };
            setProfileState(newProfile);
            saveToStorage(newProfile, connectedAccounts);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    useEffect(() => {
        const data = loadFromStorage();
        setProfileState(data.profile);
        setConnectedAccounts(data.accounts);

        getUserProfile()
            .then((user: ApiUser) => {
                const newProfile: UserProfile = {
                    name: user.name || data.profile.name,
                    email: user.email || data.profile.email,
                    phone: user.phone || "",
                    timezone: user.timezone || "UTC",
                    language: user.language || "en",
                    avatar: user.avatar || "",
                };
                setProfileState(newProfile);
                saveToStorage(newProfile, data.accounts);
            })
            .catch(() => {
                console.log("Using stored profile data");
            })
            .finally(() => {
                setMounted(true);
                setLoading(false);
            });
    }, []);

    const setProfile = (updates: Partial<UserProfile>) => {
        setProfileState(prev => {
            const next = { ...prev, ...updates };
            saveToStorage(next, connectedAccounts);

            updateUserProfile({
                name: next.name,
                phone: next.phone,
                avatar: next.avatar,
                timezone: next.timezone,
                language: next.language,
            }).catch(() => undefined);

            return next;
        });
    };

    const setConnectedAccount = (updates: Partial<ConnectedAccountData> & { id: string }) => {
        setConnectedAccounts(prev => {
            const next = prev.map(acc =>
                acc.id === updates.id ? { ...acc, ...updates } : acc
            );
            saveToStorage(profile, next);
            return next;
        });
    };

    if (!mounted) return <>{children}</>;

    return (
        <UserContext.Provider value={{ profile, setProfile, connectedAccounts, setConnectedAccount, loading, refreshProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
