"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
}

const defaultProfile: UserProfile = {
    name: "Sam Wilson",
    email: "sam@samcard.io",
    phone: "+1 (555) 123-4567",
    timezone: "America/Los_Angeles",
    language: "en",
    avatar: "",
};

const defaultAccounts: ConnectedAccountData[] = [
    { id: "google", name: "Google", icon: "G", connected: true, email: "sam@gmail.com" },
    { id: "linkedin", name: "LinkedIn", icon: "in", connected: false, url: "" },
    { id: "github", name: "GitHub", icon: "GH", connected: false, url: "" },
    { id: "twitter", name: "Twitter", icon: "X", connected: false, url: "" },
    { id: "instagram", name: "Instagram", icon: "IG", connected: false, url: "" },
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
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountData[]>(defaultAccounts);

    useEffect(() => {
        const data = loadFromStorage();
        setProfileState(data.profile);
        setConnectedAccounts(data.accounts);
        setMounted(true);
    }, []);

    const setProfile = (updates: Partial<UserProfile>) => {
        setProfileState(prev => {
            const next = { ...prev, ...updates };
            saveToStorage(next, connectedAccounts);
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
        <UserContext.Provider value={{ profile, setProfile, connectedAccounts, setConnectedAccount }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
