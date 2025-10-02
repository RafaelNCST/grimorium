export const getRoleColor = (role: string): string => {
  switch (role.toLowerCase()) {
    case "protagonista":
      return "bg-accent text-accent-foreground";
    case "antagonista":
    case "vilao":
      return "bg-destructive text-destructive-foreground";
    case "secundario":
      return "bg-primary text-primary-foreground";
    case "figurante":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};
