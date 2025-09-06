import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { fetchData, createItem, updateItem, deleteItem } from "@/shared/directus/api";

type QueryResult<T> = UseQueryResult<T, Error>;

type CreateMutationResult<T> = UseMutationResult<
  unknown,
  Error,
  Partial<T>,
  unknown
>;
type UpdateMutationResult<T> = UseMutationResult<
  unknown,
  Error,
  { id: string; item: Partial<T> },
  unknown
>;
type DeleteMutationResult = UseMutationResult<unknown, Error, string, unknown>;


export function useDirectusQuery<T = unknown, Q extends Record<string, unknown> = Record<string, unknown>>(
  resource: string,
  query: Q = {} as Q
): QueryResult<T> {
  return useQuery<T, Error>({
    queryKey: [resource, query],
    queryFn: () => fetchData(resource, query) as Promise<T>,
    staleTime: 5 * 60 * 1000,
  });
}


export function useDirectusMutation<T = unknown>(resource: string) {
  const queryClient = useQueryClient();

  const create: CreateMutationResult<T> = useMutation({
    mutationFn: (item: Partial<T>) => createItem(resource, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });

  const update: UpdateMutationResult<T> = useMutation({
    mutationFn: ({ id, item }: { id: string; item: Partial<T> }) =>
      updateItem(resource, id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });

  const remove: DeleteMutationResult = useMutation({
    mutationFn: (id: string) => deleteItem(resource, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });

  return { create, update, remove };
}
