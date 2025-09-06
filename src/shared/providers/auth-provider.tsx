"use client";
import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth";
import { useHydrationStore } from "../stores/hydration";
import { Session } from "next-auth";

const queryClient = new QueryClient();


function AuthHydrationContent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const setIsLoading = useAuthStore((state) => state.setIsLoading);
    const { hydrate, isHydrating, hasHydrated, hydrationError } = useHydrationStore();

    useEffect(() => {
        const handleHydration = async () => {
            if (status === "loading") {
                setIsLoading(true);
            } else {
                setIsLoading(false);
                if (status === "authenticated" && session) {
                    if (!hasHydrated && !isHydrating) {
                        await hydrate(session);
                    }
                } else if (status === "unauthenticated") {
                    await hydrate(null);
                }
            }
        };
        handleHydration();
    }, [status, session, setIsLoading, hasHydrated, isHydrating, hydrate]);

    if (status === "loading" || isHydrating) {
        return <p>Chargement...</p>;
    }
    if (hydrationError) {
        return <div>Error: {hydrationError.message}</div>;
    }
    // Afficher le contenu quelle que soit l'authentification
    return (
        <div className="relative flex w-full flex-col">
            <div className="flex w-full flex-col bg-muted/40">
                <main className="p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}


export default function AuthProvider({
    session,
    children,
}: Readonly<{
    session: Session | null;
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <AuthHydrationContent>{children}</AuthHydrationContent>
            </QueryClientProvider>
        </SessionProvider>
    );
}
