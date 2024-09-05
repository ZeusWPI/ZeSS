import { Alert, AlertTitle } from "@mui/material";
import { EmoticonExcitedOutline, EmoticonFrownOutline } from "mdi-material-ui";
import { isTheSameDay } from "../../util/util";
import { useScans } from "../../hooks/useScan";

export const CheckIn = () => {
  const { data: scans } = useScans();
  if (!scans) return null; // Can never happen

  const checkedIn = isTheSameDay(scans[scans.length - 1].scanTime, new Date());

  return checkedIn ? (
    <Alert
      variant="outlined"
      severity="success"
      icon={<EmoticonExcitedOutline fontSize="large" />}
    >
      <AlertTitle>Checked in</AlertTitle>
      Nice of you to stop by !
    </Alert>
  ) : (
    <Alert
      variant="outlined"
      severity="error"
      icon={<EmoticonFrownOutline fontSize="large" />}
    >
      <AlertTitle>Not checked in</AlertTitle>
      We miss you !
    </Alert>
  );
};
