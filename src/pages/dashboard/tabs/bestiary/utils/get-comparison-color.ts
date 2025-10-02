export function getComparisonColor(comparison: string): string {
  switch (comparison) {
    case "impotente":
      return "text-green-600";
    case "mais fraco":
      return "text-green-500";
    case "ligeiramente mais fraco":
      return "text-blue-500";
    case "igual":
      return "text-gray-500";
    case "ligeiramente mais forte":
      return "text-yellow-500";
    case "mais forte":
      return "text-orange-500";
    case "impossível de ganhar":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}
