import { useMemo } from "react";
import type { GooglePickerFile } from "@/lib/googlePicker";
import { filterImportableFiles } from "@/features/contracts/lib/google-drive-utils";

export const useGoogleDriveSelection = (selectedFiles: GooglePickerFile[]) => {
  return useMemo(() => {
    return filterImportableFiles(selectedFiles);
  }, [selectedFiles]);
};