import { useEffect } from "react";

import { useLocation } from "@tanstack/react-router";

import { NotFoundView } from "./view";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return <NotFoundView pathname={location.pathname} />;
};

export default NotFound;