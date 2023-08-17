import { create } from "zustand";

export type StoreState = {
  connection?: signalR.HubConnection;
  setConnection: (connection: signalR.HubConnection) => void;
};

export const useBoundStore = create<StoreState>()((set) => ({
  connection: undefined,
  setConnection: (connection?: signalR.HubConnection) => set(() => ({ connection: connection })),
}));
