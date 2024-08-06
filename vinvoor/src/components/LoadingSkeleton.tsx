import { Skeleton, SkeletonProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface LoadingSkeletonProps extends SkeletonProps {
    loading: boolean;
    children: ReactNode;
}

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
    loading,
    children,
    ...props
}) => {
    return loading ? <Skeleton height={300} {...props} /> : children;
};
