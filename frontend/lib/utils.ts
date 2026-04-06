export function cn(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

export function truncate(text: string, max = 140): string {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}...`;
}