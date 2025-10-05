import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MessageType = "update" | "team_response" | "data_research" | "news";

export interface InboxMessage {
  id: string;
  title: string;
  type: MessageType;
  content: string;
  date: Date;
  isDeleted: boolean;
  isRead: boolean;
}

interface InboxState {
  messages: InboxMessage[];
  addMessage: (
    message: Omit<InboxMessage, "id" | "isDeleted" | "isRead">
  ) => void;
  deleteMessage: (id: string) => void;
  deleteMessagePermanently: (id: string) => void;
  deleteMultipleMessages: (ids: string[]) => void;
  deleteMultipleMessagesPermanently: (ids: string[]) => void;
  clearAllMessages: () => void;
  clearAllDeletedMessages: () => void;
  restoreMessage: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useInboxStore = create<InboxState>()(
  persist(
    (set) => ({
      messages: [
        {
          id: crypto.randomUUID(),
          title: "Welcome to Grimorium",
          type: "update",
          content:
            "This is your inbox where you'll receive important updates, news, and notifications about your writing projects. Feel free to delete this message when you're ready!",
          date: new Date(),
          isDeleted: false,
          isRead: false,
        },
      ],

      addMessage: (message) => {
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
              isDeleted: false,
              isRead: false,
            },
          ],
        }));
      },

      deleteMessage: (id) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isDeleted: true } : msg
          ),
        }));
      },

      deleteMessagePermanently: (id) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        }));
      },

      deleteMultipleMessages: (ids) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            ids.includes(msg.id) ? { ...msg, isDeleted: true } : msg
          ),
        }));
      },

      deleteMultipleMessagesPermanently: (ids) => {
        set((state) => ({
          messages: state.messages.filter((msg) => !ids.includes(msg.id)),
        }));
      },

      clearAllMessages: () => {
        set((state) => ({
          messages: state.messages.map((msg) => ({ ...msg, isDeleted: true })),
        }));
      },

      clearAllDeletedMessages: () => {
        set((state) => ({
          messages: state.messages.filter((msg) => !msg.isDeleted),
        }));
      },

      restoreMessage: (id) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isDeleted: false } : msg
          ),
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isRead: true } : msg
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.isDeleted ? msg : { ...msg, isRead: true }
          ),
        }));
      },
    }),
    {
      name: "inbox-storage",
    }
  )
);
