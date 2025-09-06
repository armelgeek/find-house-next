import { Role, User } from "@directus/types";
import { Session } from "next-auth";

export type AppUser = User & {
  admin_access: boolean;
  app_access: boolean;
  roles: Role[];
};

export interface UserState {
  currentUser: AppUser | null;
  loading: boolean;
  error: Error | string | null;
  hydrate: (session: Session) => Promise<void>;
  fullName: () => string | null;
  isAdmin: () => boolean;
}
