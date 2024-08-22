import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useFetch } from "../hooks/useFetch";
import { Optional } from "../types/general";

interface DataProviderProps {
  children: ReactNode;
}

interface DataContextProps<T> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  loading: boolean;
  error?: Error;
}

export const createDataContext = <T,>(
  endpoint: string,
  defaultValue: T,
  convertData?: (data: unknown) => T,
) => {
  const DataContext = createContext<DataContextProps<T>>({
    data: defaultValue,
    setData: () => {
      // No operation, placeholder function
    },
    loading: true,
    error: undefined,
  });

  const DataProvider: FC<DataProviderProps> = ({ children }) => {
    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Optional<Error>>(undefined);

    useFetch<T>(endpoint, setData, convertData, setLoading, setError);

    return (
      <DataContext.Provider value={{ data, setData, loading, error }}>
        {children}
      </DataContext.Provider>
    );
  };

  const useDataContext = () => useContext(DataContext);

  return { DataProvider, useDataContext };
};
