import { toBN } from '../utils/bengali';

const SPEEDS: [string, number][] = [
  ['ধীর', 0.55],
  ['সাধারণ', 0.75],
  ['দ্রুত', 1.05],
];

interface Props {
  tokens: string[];
  tIdx: number;
  curGroups: string[];
  doneSet: Set<number>;
  awaitEnter: boolean;
  isSpeaking: boolean;
  isLastTok: boolean;
  ttsRate: number;
  onConfirmEnter: () => void;
  onRepeat: () => void;
  onBack: () => void;
  onSetSpeed: (rate: number) => void;
}

export default function ReadingScreen({
  tokens, tIdx, curGroups, doneSet,
  awaitEnter, isSpeaking, isLastTok, ttsRate,
  onConfirmEnter, onRepeat, onBack, onSetSpeed,
}: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[18px] pb-3 border-b border-slate-200">
        <button className="text-slate-500 px-2 py-1" onClick={onBack}>
          ← হোম
        </button>
        <p className="text-amber-600 text-[16px] font-semibold tracking-[.12em] uppercase">
          টোকেন {toBN(tIdx + 1)} / {toBN(tokens.length)}
        </p>
        {/* <button className={`text-xl px-2 py-1 ${isSpeaking ? 'animate-pulse' : ''}`} onClick={onRepeat}>
          🔊
        </button> */}
      </div>

      {/* Token progress dots */}
      <div className="flex gap-[5px] justify-center flex-wrap px-4 py-2.5">
        {tokens.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === tIdx ? 22 : 14,
              background: doneSet.has(i) ? '#16a34a' : i === tIdx ? '#d97706' : '#e2e8f0',
            }}
          />
        ))}
      </div>

      {/* All 5 groups */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="w-full max-w-xs flex flex-col gap-2">
          {curGroups.map((g, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
              <span className="text-slate-400 text-xs w-4 shrink-0">{toBN(i + 1)}</span>
              <span className="font-mono text-[24px] font-bold text-amber-600 tracking-[.22em]">
                {g}
              </span>
            </div>
          ))}
        </div>

        {awaitEnter && (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-3xl text-amber-600">
              ↵
            </div>
            <p className="text-slate-900 font-semibold text-sm">মিটারে Enter চাপুন</p>
          </div>
        )}
      </div>

      {/* Speed + confirm button */}
      <div className="px-5 pb-8 flex flex-col gap-2.5">
        <div className="flex gap-2">
          <button
            className="flex-1 py-3.5 bg-white text-slate-600 text-sm border border-slate-200 rounded-xl active:bg-slate-50"
            onClick={onRepeat}
          >
            🔊 আবার শুনুন
          </button>
          {SPEEDS.map(([label, r]) => (
            <button
              key={r}
              className={`px-3 py-3 text-sm border rounded-xl transition-colors ${
                ttsRate === r
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
              onClick={() => onSetSpeed(r)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className={`py-5 font-bold text-[17px] rounded-2xl transition-colors ${
            awaitEnter
              ? 'bg-green-600 text-white active:bg-green-700 cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          disabled={!awaitEnter}
          onClick={onConfirmEnter}
        >
          {awaitEnter
            ? `✓ Enter চাপলাম${isLastTok ? ' — সম্পন্ন' : ' — পরবর্তী টোকেন'}`
            : 'পড়া হচ্ছে…'}
        </button>
      </div>
    </div>
  );
}
