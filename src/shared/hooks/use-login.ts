

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginValues {
    email: string;
    password: string;
}

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const login = async (values: LoginValues) => {
        setIsLoading(true);
        setError(null);
        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/",
            redirect: false,
        });
        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        } else {
            // Redirige vers la page d'origine si "from" existe, sinon vers l'accueil
            const from = searchParams.get("from");
            if (from && from !== "/login") {
                router.push(from);
            } else {
                router.push("/");
            }
        }
    };

    return { login, isLoading, error };
}
