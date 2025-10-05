import { useEffect } from "react";

import { initializeMockInboxData } from "@/lib/mock-inbox-data";
import { useInboxStore } from "@/stores/inbox-store";

export const InboxInitializer = () => {
  useEffect(() => {
    // Initialize mock data (it will check internally what to add)
    initializeMockInboxData();
  }, []);

  return null;
};
