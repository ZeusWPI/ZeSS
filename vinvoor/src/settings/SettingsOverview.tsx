import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useSettings } from "../hooks/useSettings";
import { Settings } from "./Settings";

export const SettingsOverview = () => {
  const settingsQuery = useSettings();

  return (
    <LoadingSkeleton queries={[settingsQuery]}>
      <Settings />
    </LoadingSkeleton>
  );
};
