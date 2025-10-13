import { useEffect } from "react";

import { initializeMockInboxData } from "@/lib/mock-inbox-data";

export const InboxInitializer = () => {
  useEffect(() => {
    // Initialize mock data (it will check internally what to add)
    initializeMockInboxData();
  }, []);

  return null;
};
