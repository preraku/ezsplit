const PALETTE = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#14b8a6', // teal-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f59e0b', // amber-500
];

export function pickColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}
