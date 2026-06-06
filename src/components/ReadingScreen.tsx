import { toBN } from '../utils/bengali';

const SPEEDS: [string, number][] = [
  ['ধীর', 0.55],
  ['সাধারণ', 0.75],
  ['দ্রুত', 1.05],
];

interface Props {
  tokens: string[];
  tIdx: number;
  curGrps: string[];
  curGrp: string;
  gIdx: number;
  doneSet: Set<number>;
  awaitEnter: boolean;
  isLastTok: boolean;
  ttsRate: number;
  onNext: () => void;
  onRepeat: () => void;
  onBack: () => void;
  onSetSpeed: (rate: number) => void;
}

export default function ReadingScreen({
  tokens, tIdx, curGrps, curGrp, gIdx, doneSet,
  awaitEnter, isLastTok, ttsRate,
  onNext, onRepeat, onBack, onSetSpeed,
}: Props) {
  const shownGroups = awaitEnter ? curGrps : curGrps.slice(0, gIdx);

  const nextLabel = awaitEnter
    ? `✓ দেওয়া হয়েছে — ${isLastTok ? 'সম্পন্ন' : 'পরবর্তী টোকেন'}`
    : gIdx === curGrps.length - 1
    ? 'টাইপ শেষ → মিটারে Enter চাপুন'
    : 'পরবর্তী গ্রুপ →';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[18px] pb-3 border-b border-slate-900">
        <button className="text-slate-500 text-sm px-2 py-1" onClick={onBack}>
          ← ফিরে
        </button>
        <div className="text-center">
          <p className="text-amber-400 text-[11px] font-semibold tracking-[.12em] uppercase">
            টোকেন {toBN(tIdx + 1)} / {toBN(tokens.length)}
          </p>
          {!awaitEnter && (
            <p className="text-slate-500 text-xs">গ্রুপ {toBN(gIdx + 1)} এর ৫</p>
          )}
        </div>
        <button className="text-xl px-2 py-1" onClick={onRepeat}>🔊</button>
      </div>

      {/* Token progress dots */}
      <div className="flex gap-[5px] justify-center flex-wrap px-4 py-2.5">
        {tokens.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === tIdx ? 22 : 14,
              background: doneSet.has(i) ? '#22c55e' : i === tIdx ? '#f59e0b' : '#1e293b',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-[22px]">
        {shownGroups.length > 0 && (
          <div className="w-full max-w-xs flex flex-col gap-1.5">
            {shownGroups.map((g, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-slate-900 rounded-xl px-3 py-2">
                <span className="text-green-500 text-xs">✓</span>
                <span className="font-mono text-slate-500 tracking-[.18em] text-[15px]">{g}</span>
                <span className="text-slate-800 text-[11px] ml-auto">গ্রুপ {toBN(i + 1)}</span>
              </div>
            ))}
          </div>
        )}

        {awaitEnter ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-[76px] h-[76px] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl text-amber-400">
              ↵
            </div>
            <div>
              <p className="text-xl font-bold text-white">Enter চাপুন</p>
              <p className="text-slate-500 text-sm mt-1">আপনার মিটারে</p>
            </div>
          </div>
        ) : (
          <>
            {/* Group progress dots */}
            <div className="flex gap-2 items-center">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="h-[5px] rounded-full transition-all"
                  style={{
                    width: i === gIdx ? 20 : 12,
                    background: i < gIdx ? '#22c55e' : i === gIdx ? '#f59e0b' : '#1e293b',
                  }}
                />
              ))}
            </div>

            {/* Digit cards */}
            <div className="flex gap-2.5">
              {(curGrp || '----').split('').map((d, i) => (
                <div key={i} className="digit-card">
                  <span className="font-mono text-[44px] font-bold text-amber-300 leading-none">{d}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-500 text-sm">মিটারে এই ৪টি সংখ্যা দিন</p>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="px-5 pb-8 flex flex-col gap-2.5">
        <div className="flex gap-2">
          <button
            className="flex-1 py-3.5 bg-transparent text-slate-500 text-sm border border-slate-800 rounded-xl active:bg-slate-900"
            onClick={onRepeat}
          >
            🔊 আবার শুনুন
          </button>
          {SPEEDS.map(([label, r]) => (
            <button
              key={r}
              className={`px-3 py-3 text-sm border rounded-xl transition-colors ${
                ttsRate === r
                  ? 'bg-slate-900 text-amber-400 border-amber-400/40'
                  : 'bg-transparent text-slate-500 border-slate-800'
              }`}
              onClick={() => onSetSpeed(r)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className={`py-5 font-bold text-[17px] rounded-2xl ${
            awaitEnter
              ? 'bg-green-600 text-white active:bg-green-700'
              : 'bg-amber-400 text-slate-900 active:bg-amber-500'
          }`}
          onClick={onNext}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
