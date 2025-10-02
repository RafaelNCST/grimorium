export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "História":
      return "bg-accent text-accent-foreground";
    case "Geografia":
      return "bg-success text-success-foreground";
    case "Cultura":
      return "bg-primary text-primary-foreground";
    case "Política":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};
