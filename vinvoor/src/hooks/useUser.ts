import type { User, UserJSON } from "../types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { convertUserJSON } from "../types/user";
import { getApi, isResponseNot200Error, postApi } from "../util/fetch";

const ENDPOINT = "user";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      let user = {} as User;

      try {
        user = await getApi<User, UserJSON>(ENDPOINT, convertUserJSON);
      }
      catch (error) {
        if (!isResponseNot200Error(error))
          throw new Error("Failed to fetch user");
      }

      return user;
    },
    retry: 1,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => postApi("logout"),
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: ["user"],
      }),
  });
}
