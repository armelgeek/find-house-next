import {
  authentication,
  createDirectus,
  rest,
  staticToken,
} from "@directus/sdk";

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_API ?? "";

export const createDirectusClient = (token?: string) => {
  const client = createDirectus(directusUrl).with(rest());

  if (token) {
    return client.with(staticToken(token));
  }

  return client.with(
    authentication("cookie", {
      autoRefresh: true,
      credentials: "include",
    })
  );
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_API}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );
  const user = await res.json();
  if (!res.ok && user) {
    throw new Error("Email address or password is invalid");
  }
  if (res.ok && user) {
    return user?.data;
  }
};
