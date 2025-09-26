import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

import { BookDashboard } from "@/pages/dashboard";

const BookDashboardPage = () => {
  const { bookId } = useParams({ from: "/book/$bookId/dashboard" });
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate({ to: "/" });
  };

  return <BookDashboard bookId={bookId} onBack={handleBackToHome} />;
};

export const Route = createFileRoute("/book/$bookId/dashboard")({
  component: BookDashboardPage,
});
