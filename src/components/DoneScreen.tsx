const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfhzCDRaTqxwwDBAD5s1pXASrN1tbJB0lxsjBZAjc3gUC37Tg/viewform';

interface Props {
  onNewSession: () => void;
}

export default function DoneScreen({ onNewSession }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-6 text-center">
      <div
        className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-[44px]"
        style={{ background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.25)' }}
      >
        ⚡
      </div>
      <div>
        <h2 className="text-[22px] font-bold text-slate-900">
          সব টোকেন দেওয়া হয়েছে!
        </h2>
        <p className="text-slate-600 text-sm leading-7 mt-2">
          রিচার্জ নিশ্চিত করতে মিটারের ডিসপ্লে দেখুন।
        </p>
      </div>
      <button
        className="px-7 py-3.5 bg-amber-400 text-slate-900 font-bold rounded-2xl active:bg-amber-500"
        onClick={onNewSession}
      >
        নতুন সেশন
      </button>

      <a
        href={FEEDBACK_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-2xl text-slate-700 text-sm active:bg-slate-50"
      >
        <span>💬</span>
        <span>অ্যাপটি কেমন লাগলো? মতামত দিন</span>
      </a>
    </div>
  );
}
