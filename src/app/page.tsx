

"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue 👋</h1>
      {status === "authenticated" && session?.user ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg">Connecté en tant que :</p>
          <div className="rounded bg-gray-100 dark:bg-gray-800 px-4 py-2">
            <div><b>Nom :</b> {session.user.name}</div>
            <div><b>Email :</b> {session.user.email}</div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <div>
          <Link href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </div>
      )}
    </main>
  );
}
