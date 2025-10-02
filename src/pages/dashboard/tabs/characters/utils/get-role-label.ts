export const getRoleLabel = (role: string): string => {
  const labels: { [key: string]: string } = {
    protagonista: "Protagonista",
    antagonista: "Antagonista",
    vilao: "Vilão",
    secundario: "Secundário",
    figurante: "Figurante",
  };
  return labels[role.toLowerCase()] || role;
};
