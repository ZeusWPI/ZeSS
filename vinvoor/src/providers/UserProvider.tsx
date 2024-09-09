import Cookies from "js-cookie";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { Optional } from "../types/general";
import { User } from "../types/user";
import { getApi, isResponseNot200Error } from "../util/fetch";

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextProps {
  user?: User;
  loading: boolean;
  error?: Error;
}

const defaultUserContextProps: UserContextProps = {
  user: undefined,
  loading: true,
  error: undefined,
};

export const UserContext = createContext<UserContextProps>(
  defaultUserContextProps,
);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Optional<User>>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Optional<Error>>(undefined);

  useEffect(() => {
    const sessionId = Cookies.get("session_id");

    if (!sessionId) {
      setLoading(false);

      return;
    }

    getApi<User>("user")
      .then(data => setUser(data))
      .catch(error => {
        Cookies.remove("session_id");
        setUser(undefined);
        if (!isResponseNot200Error(error)) setError(error as Error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
