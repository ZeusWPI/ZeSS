import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";
import { Optional } from "../types/general";
import { getApi, isResponseNot200Error } from "../util/fetch";

export const useFetch = <T, U = unknown>(
  endpoint: string,
  setData: Dispatch<SetStateAction<T>>,
  convertData?: (data: U) => T,
  setLoading?: Dispatch<SetStateAction<boolean>>,
  setError?: Dispatch<SetStateAction<Optional<Error>>>,
) => {
  const { user, invalidateUser } = useContext(UserContext);

  useEffect(() => {
    if (user === undefined) return;

    getApi<T, U>(endpoint, convertData)
      .then(data => setData(data))
      .catch(error => {
        if (isResponseNot200Error(error) && error.response.status === 401) {
          invalidateUser(error);
        }

        setError?.(error as Error);
      })
      .finally(() => setLoading?.(false));
  }, [user, endpoint]);
};
