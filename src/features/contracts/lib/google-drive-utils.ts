import type { GooglePickerFile } from "@/lib/googlePicker";

export const GOOGLE_DRIVE_FOLDER_MIME_TYPE =
  "application/vnd.google-apps.folder";

export const filterImportableFiles = (
  files: GooglePickerFile[]
): { importable: GooglePickerFile[]; skippedFolders: number } => {
  const importable = files.filter(
    (file) => file.mimeType !== GOOGLE_DRIVE_FOLDER_MIME_TYPE
  );
  return {
    importable,
    skippedFolders: files.length - importable.length,
  };
};

export const isDriveFolder = (
  file: Pick<GooglePickerFile, "mimeType">
): boolean => {
  return file.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE;
};