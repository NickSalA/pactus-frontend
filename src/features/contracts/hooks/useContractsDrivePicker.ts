"use client";

import { useCallback, useState } from "react";
import {
  isDriveFolder,
  openGooglePicker,
  type GooglePickerFile,
} from "@/lib/googlePicker";
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
  const [googleDriveAccessToken, setGoogleDriveAccessToken] = useState<
    string | null
  >(null);
  const [googleDriveAccessTokenExpiresAt, setGoogleDriveAccessTokenExpiresAt] =
    useState<number | null>(null);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState<
    GooglePickerFile[]
  >([]);

  const { mutateAsync: importDriveFiles } = useImportGoogleDriveFiles();
  const startImportSession = useContractImportStore(
    (state) => state.startImportSession,
  );
  const attachJobToSession = useContractImportStore(
    (state) => state.attachJobToSession,
  );
  const markImportRequestFailed = useContractImportStore(
    (state) => state.markImportRequestFailed,
  );

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
      setSelectedDriveFiles((files) =>
        mergeDriveSelections(files, result.files),
      );
      setIsDriveImportReviewOpen(true);
    } catch (err) {
      setDrivePickerError(
        err instanceof Error
          ? err.message
          : "No se pudo abrir el selector de Google Drive.",
      );
    } finally {
      setIsOpeningDrivePicker(false);
    }
  }, [googleDriveAccessToken, googleDriveAccessTokenExpiresAt, googleLoginHint]);

  const importSelectedDriveFiles = useCallback(async () => {
    setDriveImportError(null);
    setDriveImportMessage(null);

    if (!googleDriveAccessToken) {
      setDriveImportError(
        "Vuelve a abrir Google Drive para autorizar la importacion de archivos.",
      );
      return;
    }

    if (selectedDriveFiles.length === 0) {
      setDriveImportError(
        "Selecciona al menos un archivo antes de iniciar la importacion.",
      );
      return;
    }

    const currentSession = useContractImportStore.getState().session;
    if (currentSession?.status === "running") {
      setDriveImportError(
        "Ya hay una importacion en progreso. Espera a que termine antes de iniciar otra.",
      );
      return;
    }

    const filesToImport = selectedDriveFiles.filter(
      (file) => !isDriveFolder(file),
    );
    const skippedFolders = selectedDriveFiles.length - filesToImport.length;

    if (filesToImport.length === 0) {
      setDriveImportError(
        "Selecciona al menos un archivo de Google Drive. Las carpetas no se pueden importar.",
      );
      return;
    }

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
      attachJobToSession(sessionId, result.job_id);

      const skippedCount = skippedFolders + result.skipped_files;
      const skippedMessage =
        skippedCount > 0
          ? `Se omitieron ${skippedCount} carpeta${skippedCount === 1 ? "" : "s"}.`
          : "";

      setDriveImportMessage(
        skippedMessage ||
          "Importacion iniciada. Puedes seguir el progreso en el indicador inferior.",
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudieron enviar los archivos seleccionados.";
      markImportRequestFailed(sessionId, message);
      setDriveImportError(message);
    } finally {
      setIsImportingDriveFiles(false);
    }
  }, [
    attachJobToSession,
    folderId,
    googleDriveAccessToken,
    importDriveFiles,
    markImportRequestFailed,
    selectedDriveFiles,
    startImportSession,
  ]);

  const clearDriveSelection = useCallback(() => {
    setSelectedDriveFiles([]);
    setDriveImportError(null);
    setDriveImportMessage(null);
  }, []);

  const closeDriveImportReview = useCallback(() => {
    setIsDriveImportReviewOpen(false);
  }, []);

  const removeDriveFile = useCallback((fileId: string) => {
    setSelectedDriveFiles((files) =>
      files.filter((file) => file.id !== fileId),
    );
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
