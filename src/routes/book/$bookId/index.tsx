import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/book/$bookId/")({
  beforeLoad: ({ params }) => {
    // Redirect to the book dashboard
    throw redirect({
      to: "/book/$bookId/dashboard",
      params: { bookId: params.bookId },
      replace: true,
    });
  },
});
