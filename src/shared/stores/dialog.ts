import { create } from "zustand";

interface DialogState {
  openDialogs: Set<string>;
  openDialog: (name: string) => void;
  closeDialog: (name: string) => void;
  isOpen: (name: string) => boolean;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  openDialogs: new Set(),
  openDialog: (name) =>
    set((state) => ({ openDialogs: new Set(state.openDialogs).add(name) })),
  closeDialog: (name) =>
    set((state) => {
      const newSet = new Set(state.openDialogs);
      newSet.delete(name);
      return { openDialogs: newSet };
    }),
  isOpen: (name) => get().openDialogs.has(name),
}));
