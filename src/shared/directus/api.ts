import {
  readItems,
  createItem as createItemDirectus,
  updateItem as updateItemDirectus,
  deleteItem as deleteItemDirectus,
} from "@directus/sdk";
import { createDirectusClient } from "../services/directus";
import { getSession } from "next-auth/react";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const getDirectusClient = async () => {
  const session = await getSession();
  return createDirectusClient(session?.access_token);
};

export const fetchData = async (resource: string, query: Record<string, unknown> = {}) => {
  const client = await getDirectusClient();
  return client.request(readItems(resource, query));
};

export const createItem = async (
  resource: string,
  item: Record<string, unknown>,
  queryClient?: QueryClient
) => {
  try {
    const client = await getDirectusClient();
    const result = await client.request(createItemDirectus(resource, item));

    if (!result) {
      throw new Error("Failed to create item");
    }

    // Invalidate queries if queryClient is provided
    queryClient?.invalidateQueries({ queryKey: [resource] });

    return result;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const updateItem = async (
  resource: string,
  id: string,
  item: Record<string, unknown>
) => {
  try {
    const client = await getDirectusClient();
    const result = await client.request(updateItemDirectus(resource, id, item));

    if (!result) {
      throw new Error("Failed to update item");
    }

    queryClient.invalidateQueries({ queryKey: [resource] });
    return result;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const deleteItem = async (resource: string, id: string) => {
  const client = await getDirectusClient();
  return client.request(deleteItemDirectus(resource, id));
};
