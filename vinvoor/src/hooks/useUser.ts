import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApi, isResponseNot200Error, postApi } from "../util/fetch";
import { convertUserJSON, User, UserJSON } from "../types/user";

const ENDPOINT = "user";

export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      let user = {} as User;

      try {
        user = await getApi<User, UserJSON>(ENDPOINT, convertUserJSON);
      } catch (error) {
        if (!isResponseNot200Error(error))
          throw new Error("Failed to fetch user");
      }

      return user;
    },
    retry: 1,
  });

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postApi("logout"),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user"],
      }),
  });
};
