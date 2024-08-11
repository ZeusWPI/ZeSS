import {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { UserContext } from "../providers/UserProvider";
import { getApi, isResponseNot200Error } from "../util/fetch";

interface useFetchResult {
    loading: boolean;
    error: Error | undefined;
}

export const useFetch = <T>(
    endpoint: string,
    setData: Dispatch<SetStateAction<T>>,
    convertData?: (data: any) => T
): useFetchResult => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | undefined>(undefined);

    const { setUserState } = useContext(UserContext);

    useEffect(() => {
        getApi<T>(endpoint, convertData)
            .then((data) => setData(data))
            .catch((error) => {
                if (
                    isResponseNot200Error(error) &&
                    error.response.status === 401
                ) {
                    setUserState({
                        user: undefined,
                        loading: false,
                        error: error,
                    });
                }

                setError(error);
            })
            .finally(() => setLoading(false));
    }, [endpoint]);

    return { loading, error };
};
