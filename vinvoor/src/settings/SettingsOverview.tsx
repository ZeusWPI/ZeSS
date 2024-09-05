import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useSettings } from "../hooks/useSettings";
import { Settings } from "./Settings";

export const SettingsOverview = () => {
  const { isLoading } = useSettings();

  return (
    <LoadingSkeleton loading={isLoading}>
      <Settings />
    </LoadingSkeleton>
  );
};
