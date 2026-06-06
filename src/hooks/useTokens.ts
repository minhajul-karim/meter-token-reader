import { useState } from 'react';
import { parseTokens, groupOf } from '../utils/parse';

type NextResult =
  | { action: 'next-group'; group: string }
  | { action: 'await-enter' }
  | { action: 'next-token'; tokenNum: number; total: number; group: string }
  | { action: 'done' };

export function useTokens() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [gIdx, setGIdx] = useState(0);
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const [awaitEnter, setAwaitEnter] = useState(false);

  const curGrps = groupOf(tokens[tIdx] ?? '');
  const curGrp = curGrps[gIdx] ?? '';
  const isLastGrp = gIdx === curGrps.length - 1;
  const isLastTok = tIdx === tokens.length - 1;

  function start(text: string): { parsed: string[]; firstGroup: string } | null {
    const parsed = parseTokens(text);
    if (!parsed.length) return null;
    setTokens(parsed);
    setTIdx(0);
    setGIdx(0);
    setDoneSet(new Set());
    setAwaitEnter(false);
    return { parsed, firstGroup: groupOf(parsed[0])[0] ?? '' };
  }

  function next(): NextResult {
    if (awaitEnter) {
      setDoneSet(prev => new Set([...prev, tIdx]));
      if (isLastTok) {
        return { action: 'done' };
      }
      const newTIdx = tIdx + 1;
      const group = groupOf(tokens[newTIdx])[0] ?? '';
      setTIdx(newTIdx);
      setGIdx(0);
      setAwaitEnter(false);
      return { action: 'next-token', tokenNum: newTIdx + 1, total: tokens.length, group };
    }

    if (isLastGrp) {
      setAwaitEnter(true);
      return { action: 'await-enter' };
    }

    const newGIdx = gIdx + 1;
    const group = curGrps[newGIdx] ?? '';
    setGIdx(newGIdx);
    return { action: 'next-group', group };
  }

  function reset() {
    setTokens([]);
    setTIdx(0);
    setGIdx(0);
    setDoneSet(new Set());
    setAwaitEnter(false);
  }

  return {
    tokens, tIdx, gIdx, doneSet, awaitEnter,
    curGrps, curGrp, isLastGrp, isLastTok,
    start, next, reset,
  };
}
