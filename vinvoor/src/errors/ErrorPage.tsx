import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{get_error(error)}</i>
            </p>
        </div>
    );
};

const get_error = (error: unknown) => {
    if (isRouteErrorResponse(error)) {
        return `${error.status} ${error.statusText}`;
    } else if (error instanceof Error) {
        return error.message;
    } else if (typeof error === "string") {
        return error;
    } else {
        console.error(error);
        return "Unknown error";
    }
};
