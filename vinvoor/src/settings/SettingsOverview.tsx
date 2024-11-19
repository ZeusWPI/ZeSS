import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useSettings } from "../hooks/useSettings";
import { Settings } from "./Settings";

export function SettingsOverview() {
  const settingsQuery = useSettings();

  return (
    <LoadingSkeleton queries={[settingsQuery]}>
      <Settings />
    </LoadingSkeleton>
  );
}
