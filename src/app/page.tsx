

"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useLogin } from "@/shared/hooks/use-login";

export default function Home() {
  const { data: session, status } = useSession();
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xs">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      )}
    </main>
  );
}
