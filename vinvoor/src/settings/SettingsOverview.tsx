import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useSettings } from "../hooks/useSettings";
import { Settings } from "./Settings";

export const SettingsOverview = () => {
  const { isLoading, isError } = useSettings();

  return (
    <LoadingSkeleton isLoading={isLoading} isError={isError}>
      <Settings />
    </LoadingSkeleton>
  );
};
