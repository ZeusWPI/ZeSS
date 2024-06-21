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
import { User } from "../types/User";

interface UserProviderProps {
    children: ReactNode;
}

export const UserContext = createContext<{
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
}>({
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

        fetch("http://localhost:4000/api/user", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch(() => Cookies.remove("session_id"));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
