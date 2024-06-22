import Cookies from "js-cookie";
import {
    createContext,
    Dispatch,
    FC,
    ReactNode,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { User } from "../types/user";
import { fetchApi } from "../util/fetch";

interface UserProviderProps {
    children: ReactNode;
}

interface UserContextProps {
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
}

export const UserContext = createContext<UserContextProps>({
    user: undefined,
    setUser: () => {},
});

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const sessionId = Cookies.get("session_id");

        if (!sessionId) {
            return;
        }

        fetchApi("user")
            .then((data) => setUser(data))
            .catch(() => Cookies.remove("session_id"));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
