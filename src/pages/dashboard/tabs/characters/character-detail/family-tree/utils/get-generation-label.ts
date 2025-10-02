export const getGenerationLabel = (generation: number): string => {
  switch (generation) {
    case -2:
      return "Bisavós";
    case -1:
      return "Pais e Tios";
    case 0:
      return "Personagem e Irmãos";
    case 1:
      return "Filhos";
    case 2:
      return "Netos";
    default:
      return generation < 0 ? "Ancestrais" : "Descendentes";
  }
};
