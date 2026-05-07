import { create } from "zustand";

type SidebarState = {
  desktopOpen: boolean;
  mobileOpen: boolean;
  selectedId?: string;
};

type SidebarActions = {
  openDesktopSidebar: () => void;
  closeDesktopSidebar: () => void;
  toggleDesktopSidebar: () => void;

  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;

  setSelected: (id?: string) => void;
};

type SidebarStore = SidebarState & SidebarActions;

export const useSidebarStore = create<SidebarStore>()((set) => ({
  desktopOpen: true,
  mobileOpen: false,
  selectedId: undefined,

  openDesktopSidebar: () => {
    set({ desktopOpen: true });
  },

  closeDesktopSidebar: () => {
    set({ desktopOpen: false });
  },

  toggleDesktopSidebar: () => {
    set((state) => ({
      desktopOpen: !state.desktopOpen,
    }));
  },

  openMobileSidebar: () => {
    set({ mobileOpen: true });
  },

  closeMobileSidebar: () => {
    set({ mobileOpen: false });
  },

  toggleMobileSidebar: () => {
    set((state) => ({
      mobileOpen: !state.mobileOpen,
    }));
  },

  setSelected: (id) => {
    set({ selectedId: id });
  },
}));
