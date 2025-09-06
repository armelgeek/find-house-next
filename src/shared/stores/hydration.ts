import { create } from "zustand";
import { useAuthStore } from "./auth";
import { useUserStore } from "./user";
import { Session } from "next-auth";

interface HydrationState {
  isHydrating: boolean;
  hasHydrated: boolean;
  hydrationError: Error | null;
  hydrate: (session: Session | null) => Promise<void>;
}

export const useHydrationStore = create<HydrationState>((set, get) => ({
  isHydrating: false,
  hasHydrated: false,
  hydrationError: null,
  hydrate: async (session: Session | null) => {
    if (get().isHydrating || get().hasHydrated) return;

    set({ isHydrating: true, hydrationError: null });

    try {
      const authStore = useAuthStore.getState();
      const userStore = useUserStore.getState();

      // Update auth store
      authStore.setSession(session);
      authStore.setIsAuthenticated(!!session);
      authStore.setIsLoading(false);

      // If authenticated, hydrate user store
      if (session) {
        await userStore.hydrate(session);
      }

      set({ hasHydrated: true });
    } catch (error) {
      set({ hydrationError: error as Error });
    } finally {
      set({ isHydrating: false });
    }
  },
}));
