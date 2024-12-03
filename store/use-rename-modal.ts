import { create } from "zustand";

const defaultValues = { id: "", title: "" };

interface IRenameModalStore {
  isOpen: boolean;
  initialValues: typeof defaultValues;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
}

export const useRenameModel = create<IRenameModalStore>((set) => ({
  isOpen: false,
  initialValues: defaultValues,
  onOpen: (id, title) => set({ initialValues: { id, title }, isOpen: true }),
  onClose: () => set({ isOpen: false, initialValues: defaultValues }),
}));
