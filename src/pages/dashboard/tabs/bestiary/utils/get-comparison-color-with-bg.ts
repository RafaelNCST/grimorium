export function getComparisonColorWithBg(comparison: string): string {
  switch (comparison) {
    case "impotente":
      return "text-green-600 bg-green-50";
    case "mais fraco":
      return "text-green-500 bg-green-50";
    case "ligeiramente mais fraco":
      return "text-blue-500 bg-blue-50";
    case "igual":
      return "text-gray-500 bg-gray-50";
    case "ligeiramente mais forte":
      return "text-yellow-600 bg-yellow-50";
    case "mais forte":
      return "text-orange-500 bg-orange-50";
    case "impossível de ganhar":
      return "text-red-500 bg-red-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
}
