import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getApi } from "../util/fetch";

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

    useEffect(() => {
        getApi<T>(endpoint, convertData)
            .then((data) => setData(data))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, [endpoint]);

    return { loading, error };
};
