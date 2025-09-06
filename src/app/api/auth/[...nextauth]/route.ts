import NextAuth from "next-auth";
import { options } from "@/shared/directus/auth/options";

const handler = NextAuth(options);

export { handler as GET, handler as POST };
