import { Alert, AlertTitle } from "@mui/material";
import { EmoticonExcitedOutline, EmoticonFrownOutline } from "mdi-material-ui";
import { useScansContext } from "../../providers/dataproviders/scansProvider";
import { isTheSameDay } from "../../util/util";

export const CheckIn = () => {
  const { data: scans } = useScansContext();

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
