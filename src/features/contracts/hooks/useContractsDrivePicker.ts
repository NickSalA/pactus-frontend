"use client";

import { useCallback, useState } from "react";
import { openGooglePicker, type GooglePickerFile } from "@/lib/googlePicker";
import { useImportGoogleDriveFiles } from "@/queries/hooks/contracts/mutations";
import { mergeDriveSelections } from "@/features/contracts/lib/contractsUtils";
import { useAuthStore, useContractImportStore } from "@/store";

type UseContractsDrivePickerOptions = {
  folderId?: number | null;
};

export function useContractsDrivePicker({
  folderId = null,
}: UseContractsDrivePickerOptions = {}) {
  const googleLoginHint = useAuthStore((state) => state.user?.email ?? null);
  const [isOpeningDrivePicker, setIsOpeningDrivePicker] = useState(false);
  const [isImportingDriveFiles, setIsImportingDriveFiles] = useState(false);
  const [isDriveImportReviewOpen, setIsDriveImportReviewOpen] = useState(false);
  const [drivePickerError, setDrivePickerError] = useState<string | null>(null);
  const [driveImportError, setDriveImportError] = useState<string | null>(null);
  const [driveImportMessage, setDriveImportMessage] = useState<string | null>(null);
  const [googleDriveAccessToken, setGoogleDriveAccessToken] = useState<string | null>(null);
  const [googleDriveAccessTokenExpiresAt, setGoogleDriveAccessTokenExpiresAt] = useState<number | null>(null);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState<GooglePickerFile[]>([]);

  const { mutateAsync: importDriveFiles } = useImportGoogleDriveFiles();
  const startImportSession = useContractImportStore((state) => state.startImportSession);
  const markImportRequestFailed = useContractImportStore((state) => state.markImportRequestFailed);

  const openDrivePicker = useCallback(async () => {
    setDrivePickerError(null);
    setDriveImportError(null);
    setDriveImportMessage(null);
    setIsOpeningDrivePicker(true);

    try {
      const result = await openGooglePicker({
        accessToken: googleDriveAccessToken,
        accessTokenExpiresAt: googleDriveAccessTokenExpiresAt,
        loginHint: googleLoginHint,
      });

      if (!result || result.files.length === 0) {
        return;
      }

      setGoogleDriveAccessToken(result.accessToken);
      setGoogleDriveAccessTokenExpiresAt(result.accessTokenExpiresAt);
      setSelectedDriveFiles((files) => mergeDriveSelections(files, result.files));
      setIsDriveImportReviewOpen(true);
    } catch (err) {
      setDrivePickerError(
        err instanceof Error ? err.message : "No se pudo abrir el selector de Google Drive.",
      );
    } finally {
      setIsOpeningDrivePicker(false);
    }
  }, [googleDriveAccessToken, googleDriveAccessTokenExpiresAt, googleLoginHint]);

  const importSelectedDriveFiles = useCallback(async () => {
    setDriveImportError(null);
    setDriveImportMessage(null);

    if (!googleDriveAccessToken) {
      setDriveImportError("Vuelve a abrir Google Drive para autorizar la importacion de archivos.");
      return;
    }

    if (selectedDriveFiles.length === 0) {
      setDriveImportError("Selecciona al menos un archivo antes de iniciar la importacion.");
      return;
    }

    const filesToImport = selectedDriveFiles;
    const sessionId = startImportSession(filesToImport);

    setIsDriveImportReviewOpen(false);
    setSelectedDriveFiles([]);
    setIsImportingDriveFiles(true);

    try {
      const result = await importDriveFiles({
        accessToken: googleDriveAccessToken,
        files: filesToImport,
        folderId,
      });
      const skippedMessage =
        result.skipped_files > 0
          ? ` Se omitieron ${result.skipped_files} carpeta${result.skipped_files === 1 ? "" : "s"}.`
          : "";

      setDriveImportMessage(skippedMessage.trim() || null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudieron enviar los archivos seleccionados.";
      markImportRequestFailed(sessionId, message);
      setDriveImportError(message);
    } finally {
      setIsImportingDriveFiles(false);
    }
  }, [folderId, googleDriveAccessToken, importDriveFiles, markImportRequestFailed, selectedDriveFiles, startImportSession]);

  const clearDriveSelection = useCallback(() => {
    setSelectedDriveFiles([]);
    setDriveImportError(null);
    setDriveImportMessage(null);
  }, []);

  const closeDriveImportReview = useCallback(() => {
    setIsDriveImportReviewOpen(false);
  }, []);

  const removeDriveFile = useCallback((fileId: string) => {
    setSelectedDriveFiles((files) => files.filter((file) => file.id !== fileId));
  }, []);

  return {
    clearDriveSelection,
    closeDriveImportReview,
    driveImportError,
    driveImportMessage,
    drivePickerError,
    importSelectedDriveFiles,
    isDriveImportReviewOpen,
    isImportingDriveFiles,
    isOpeningDrivePicker,
    openDrivePicker,
    removeDriveFile,
    selectedDriveFiles,
  };
}
