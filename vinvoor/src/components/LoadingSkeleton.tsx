import { Skeleton, SkeletonProps } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { isResponseNot200Error } from "../util/fetch";

interface LoadingSkeletonProps extends SkeletonProps {
  queries: UseQueryResult<unknown, Error>[];
  children: ReactNode;
}

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  queries,
  children,
  ...props
}) => {
  const isError = queries.some(query => query.isError);
  if (isError)
    throw (
      queries.find(query => isResponseNot200Error(query.error))?.error ??
      new Error("Error fetching data, unable to reach the server")
    );

  const isLoading = queries.some(query => query.isLoading);

  return isLoading ? <Skeleton {...props} /> : <>{children}</>;
};
