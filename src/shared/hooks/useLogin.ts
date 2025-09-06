
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginValues {
    email: string;
    password: string;
}

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
            router.push("/meals");
        }
    };

    return { login, isLoading, error };
}
