import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

import { BookDashboard } from "@/pages/dashboard";

const DashboardPage = () => {
  const { dashboardId } = useParams({ from: "/dashboard/$dashboardId/" });
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate({ to: "/" });
  };

  return <BookDashboard bookId={dashboardId} onBack={handleBackToHome} />;
};

export const Route = createFileRoute("/dashboard/$dashboardId/")({
  component: DashboardPage,
});
