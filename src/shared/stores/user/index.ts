import { create } from "zustand";
import { AppUser, UserState } from "./types";
import { userName } from "../../utils/user-name";
import { createDirectusClient } from "../../services/directus";
import { readMe } from "@directus/sdk";

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null as AppUser | null,
  loading: false,
  error: null,
  // Getters
  fullName: (): string | null => {
    const currentUser = get().currentUser;
    if (currentUser === null) return null;
    return userName(currentUser);
  },
  isAdmin: () => {
    return get().currentUser?.admin_access === true || false;
  },
  // Actions
  hydrate: async (session) => {
    set({ loading: true, error: null });

    try {
      if (!session) {
        throw new Error("No session provided");
      }

      if (!session.access_token) {
        throw new Error("No access token in session");
      }

      if (new Date(session.expires) < new Date()) {
        throw new Error("Session has expired");
      }

      const fields = ["*"];
      const api = createDirectusClient(session.access_token);

      const user = await api.request(readMe({ fields }));

      if (!user) {
        throw new Error("Failed to fetch user data");
      }

      set({
        currentUser: user as AppUser,
        error: null,
      });
    } catch (error) {
      console.error("Error hydrating user store:", error);

      let errorMessage = "Failed to load user data";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      set({
        currentUser: null,
        error: new Error(errorMessage),
      });
    } finally {
      set({ loading: false });
    }
  },
  clearUser: () => {
    set({ currentUser: null, error: null });
  },
}));
