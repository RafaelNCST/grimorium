import { create } from "zustand";

interface MapState {
  scale: number;
  positionX: number;
  positionY: number;
}

interface RegionMapStore {
  mapStates: Record<string, MapState>; // key = regionId or imagePath
  setMapState: (regionId: string, state: MapState) => void;
  getMapState: (regionId: string) => MapState | undefined;
  clearMapState: (regionId: string) => void;
}

export const useRegionMapStore = create<RegionMapStore>((set, get) => ({
  mapStates: {},

  setMapState: (regionId: string, state: MapState) => {
    set((prev) => ({
      mapStates: {
        ...prev.mapStates,
        [regionId]: state,
      },
    }));
  },

  getMapState: (regionId: string) => {
    const { mapStates } = get();
    return mapStates[regionId];
  },

  clearMapState: (regionId: string) => {
    set((prev) => {
      const newMapStates = { ...prev.mapStates };
      delete newMapStates[regionId];
      return { mapStates: newMapStates };
    });
  },
}));
