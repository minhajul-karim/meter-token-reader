import { toBN } from '../utils/bengali';

interface Props {
  tokenCount: number;
  onNewSession: () => void;
}

export default function DoneScreen({ tokenCount, onNewSession }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-6 text-center">
      <div
        className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-[44px]"
        style={{ background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)' }}
      >
        ⚡
      </div>
      <div>
        <h2 className="text-[22px] font-bold text-white">
          সব {toBN(tokenCount)}টি টোকেন দেওয়া হয়েছে!
        </h2>
        <p className="text-slate-500 text-sm leading-7 mt-2">
          রিচার্জ নিশ্চিত করতে মিটারের ডিসপ্লে দেখুন।
        </p>
      </div>
      <button
        className="px-7 py-3.5 bg-amber-400 text-slate-900 font-bold rounded-2xl active:bg-amber-500"
        onClick={onNewSession}
      >
        নতুন সেশন
      </button>
    </div>
  );
}
