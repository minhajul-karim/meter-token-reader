const TOKEN_RE = /\d{4}-\d{4}-\d{4}-\d{4}-\d{4}/g;

export function parseTokens(text: string): string[] {
  const normalized = text.replace(/\s+/g, '');
  return (normalized.match(TOKEN_RE) ?? []).map(t => t.replace(/-/g, ''));
}

export function groupOf(token: string): string[] {
  const groups: string[] = [];
  for (let i = 0; i < token.length; i += 4) {
    groups.push(token.slice(i, i + 4));
  }
  return groups;
}
