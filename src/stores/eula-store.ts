import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EULAState {
  hasAccepted: boolean;
  acceptedAt: string | null;
  acceptEULA: () => void;
}

export const useEULAStore = create<EULAState>()(
  persist(
    (set) => ({
      hasAccepted: false,
      acceptedAt: null,
      acceptEULA: () =>
        set({
          hasAccepted: true,
          acceptedAt: new Date().toISOString(),
        }),
    }),
    {
      name: "eula-storage",
    }
  )
);
