import { useState } from 'react';
import { parseTokens, groupOf } from '../utils/parse';

export function useTokens() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());

  const curGroups = groupOf(tokens[tIdx] ?? '');
  const isLastTok = tIdx === tokens.length - 1;

  function start(text: string): string[] | null {
    const parsed = parseTokens(text);
    if (!parsed.length) return null;
    setTokens(parsed);
    setTIdx(0);
    setDoneSet(new Set());
    return groupOf(parsed[0]);
  }

  function advance(): { action: 'done' } | { action: 'next'; groups: string[]; tokenNum: number } {
    setDoneSet(prev => new Set([...prev, tIdx]));
    if (isLastTok) return { action: 'done' };
    const nextIdx = tIdx + 1;
    setTIdx(nextIdx);
    return { action: 'next', groups: groupOf(tokens[nextIdx]), tokenNum: nextIdx + 1 };
  }

  function goBack(): { groups: string[]; tokenNum: number } | null {
    if (tIdx === 0) return null;
    const prevIdx = tIdx - 1;
    setTIdx(prevIdx);
    setDoneSet(prev => { const s = new Set(prev); s.delete(prevIdx); return s; });
    return { groups: groupOf(tokens[prevIdx]), tokenNum: prevIdx + 1 };
  }

  function goForward(): { groups: string[]; tokenNum: number } | null {
    if (tIdx >= tokens.length - 1) return null;
    const nextIdx = tIdx + 1;
    setTIdx(nextIdx);
    return { groups: groupOf(tokens[nextIdx]), tokenNum: nextIdx + 1 };
  }

  function reset() {
    setTokens([]);
    setTIdx(0);
    setDoneSet(new Set());
  }

  return { tokens, tIdx, doneSet, curGroups, isLastTok, start, advance, goBack, goForward, reset };
}
