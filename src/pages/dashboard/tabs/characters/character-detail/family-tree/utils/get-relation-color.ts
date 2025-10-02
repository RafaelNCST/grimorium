export const getRelationColor = (relation: string): string => {
  switch (relation) {
    case "main":
      return "bg-primary text-primary-foreground";
    case "pai":
    case "mãe":
      return "bg-blue-500 text-white";
    case "cônjuge":
      return "bg-red-500 text-white";
    case "irmão/irmã":
      return "bg-green-500 text-white";
    case "meio-irmão/irmã":
      return "bg-green-400 text-white";
    case "filho/filha":
      return "bg-purple-500 text-white";
    case "avô/avó":
      return "bg-orange-500 text-white";
    case "tio/tia":
      return "bg-yellow-500 text-white";
    case "primo/prima":
      return "bg-indigo-500 text-white";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};
