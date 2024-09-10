import { Skeleton, SkeletonProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface LoadingSkeletonProps extends SkeletonProps {
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
}

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  isLoading,
  isError,
  children,
  ...props
}) => {
  if (isError)
    throw new Error("Error fetching data, unable to reach the server");

  return isLoading ? <Skeleton {...props} /> : <>{children}</>;
};
