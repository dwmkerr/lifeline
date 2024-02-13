import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

interface DialogContextValue {
  showImportDialog: boolean;
  setShowImportDialog: (show: boolean) => void;
  showExportDialog: boolean;
  setShowExportDialog: (show: boolean) => void;
  showAddEventDialog: boolean;
  setShowAddEventDialog: (show: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const DialogContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [showAddEventDialog, setShowAddEventDialog] = useState<boolean>(false);

  const value: DialogContextValue = {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
    showAddEventDialog,
    setShowAddEventDialog,
  };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      "useDialogContext must be used within a DialogContextProvider",
    );
  }
  return context;
};
