import { Alert, AlertTitle } from "@mui/material";
import { EmoticonExcitedOutline, EmoticonFrownOutline } from "mdi-material-ui";
import { useContext } from "react";
import { isTheSameDay } from "../../util/util";
import { ScanContext } from "../Overview";

export const CheckIn = () => {
    const { scans } = useContext(ScanContext);

    const checkedIn =
        scans.length > 0 &&
        isTheSameDay(scans[scans.length - 1].scanTime, new Date());

    return checkedIn ? (
        <Alert
            variant="outlined"
            severity="success"
            iconMapping={{
                success: <EmoticonExcitedOutline fontSize="large" />,
            }}
        >
            <AlertTitle>Checked in</AlertTitle>
            Nice of you to stop by!
        </Alert>
    ) : (
        <Alert
            variant="outlined"
            severity="error"
            iconMapping={{
                error: <EmoticonFrownOutline fontSize="large" />,
            }}
        >
            <AlertTitle>Not checked in</AlertTitle>
            We miss you!
        </Alert>
    );
};
