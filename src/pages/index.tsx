import { useState } from "react";

import { BookDashboard } from "@/components/book-dashboard";
import { HomePage } from "@/components/home-page";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "book">("home");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId);
    setCurrentView("book");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedBookId(null);
  };

  if (currentView === "book" && selectedBookId) {
    return <BookDashboard bookId={selectedBookId} onBack={handleBackToHome} />;
  }

  return <HomePage onBookSelect={handleBookSelect} />;
};

export default Index;
