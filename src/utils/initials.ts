export function getInitials(name: string): string {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    // Multi-word: first letter of first two words
    return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  }
  // Single word: up to first 3 characters
  return trimmed.slice(0, 3).toUpperCase();
}
