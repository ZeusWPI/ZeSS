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

interface UserState {
    user: User | undefined;
    loading: boolean;
    error: Error | undefined;
}

interface UserContextProps {
    userState: UserState;
    setUserState: Dispatch<SetStateAction<UserState>>;
}

const defaultUserState: UserState = {
    user: undefined,
    loading: true,
    error: undefined,
};

export const UserContext = createContext<UserContextProps>({
    userState: defaultUserState,
    setUserState: () => {},
});

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [userState, setUserState] = useState<UserState>(defaultUserState);

    useEffect(() => {
        const sessionId = Cookies.get("session_id");

        if (!sessionId) {
            setUserState({
                user: undefined,
                loading: false,
                error: new Error("No session ID"),
            });

            return;
        }

        let newUserState = { ...userState };

        fetchApi("user")
            .then((data) => (newUserState.user = data))
            .catch((error) => {
                Cookies.remove("session_id");
                newUserState.error = error;
            })
            .finally(() => {
                newUserState.loading = false;
                setUserState(newUserState);
            });
    }, []);

    return (
        <UserContext.Provider value={{ userState, setUserState }}>
            {children}
        </UserContext.Provider>
    );
};
