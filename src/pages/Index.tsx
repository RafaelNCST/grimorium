import { useState } from "react";
import { HomePage } from "@/components/HomePage";
import { BookDashboard } from "@/components/BookDashboard";

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

  const handleCreateBook = () => {
    // Placeholder for book creation
    console.log("Creating new book...");
  };

  if (currentView === "book" && selectedBookId) {
    return (
      <BookDashboard 
        bookId={selectedBookId} 
        onBack={handleBackToHome} 
      />
    );
  }

  return (
    <HomePage 
      onBookSelect={handleBookSelect}
      onCreateBook={handleCreateBook}
    />
  );
};

export default Index;