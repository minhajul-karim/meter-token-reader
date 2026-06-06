import { useState } from 'react';
import { parseTokens } from '../utils/parse';
import { toBN } from '../utils/bengali';

const SAMPLE_SMS =
  'Successful!Your BPDBprepaid Prepaid Token is 1234-5678-9012-3456-7890,2345-6789-0123-4567-8901,3456-7890-1234-5678-9012';

interface Props {
  onStart: (text: string) => void;
  ttsSupported: boolean;
}

export default function PasteScreen({ onStart, ttsSupported }: Props) {
  const [text, setText] = useState('');

  const tokenCount = parseTokens(text).length;
  const hasText = text.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col p-5 gap-5">
      <div className="pt-3">
        <p className="text-amber-400 text-[11px] font-semibold tracking-[.12em] uppercase">
          বিপিডিবি প্রিপেইড মিটার
        </p>
        <h1 className="text-[26px] font-bold text-white mt-1">টোকেন রিডার</h1>
        <p className="text-slate-500 text-sm leading-7 mt-1.5">
          রিচার্জের SMS পেস্ট করুন। অ্যাপ প্রতিটি ৪ সংখ্যার গ্রুপ বাংলায় পড়বে — একা মিটারে টোকেন দেওয়া যাবে, কারো সাহায্য লাগবে না।
        </p>
      </div>

      {!ttsSupported && (
        <div className="bg-[#1a0a00] border border-amber-400/30 rounded-xl px-3.5 py-3">
          <p className="text-amber-300 text-sm leading-snug">
            ⚠️ আপনার ব্রাউজার ভয়েস সাপোর্ট করছে না। Chrome বা Samsung Browser-এ খুলুন।
          </p>
        </div>
      )}

      <div>
        <p className="text-slate-500 text-xs mb-1.5">রিচার্জের SMS</p>
        <textarea
          className="w-full h-32 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-slate-300 text-sm leading-relaxed resize-none outline-none focus:border-amber-400 transition-colors"
          placeholder="সম্পূর্ণ SMS এখানে পেস্ট করুন…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {hasText && (
          <p className={`text-xs mt-1.5 ${tokenCount > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {tokenCount > 0
              ? `✓ ${toBN(tokenCount)}টি টোকেন পাওয়া গেছে`
              : '✗ কোনো টোকেন নেই — সম্পূর্ণ SMS পেস্ট করুন'}
          </p>
        )}
      </div>

      <div className="flex gap-2.5">
        <button
          className="px-4 py-3 bg-transparent text-slate-500 text-sm border border-slate-800 rounded-xl active:bg-slate-900"
          onClick={() => setText(SAMPLE_SMS)}
        >
          নমুনা দেখুন
        </button>
        <button
          className="flex-1 py-3.5 bg-amber-400 text-slate-900 font-bold text-base rounded-2xl disabled:opacity-35 active:bg-amber-500"
          disabled={tokenCount === 0}
          onClick={() => onStart(text)}
        >
          পড়া শুরু করুন →
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
        <p className="text-amber-400 font-semibold text-sm mb-1">কিভাবে কাজ করে</p>
        <p className="text-slate-400 text-sm leading-relaxed">
          প্রতিটি ২০ সংখ্যার টোকেন পাঁচটি ৪-সংখ্যার গ্রুপে পড়া হয়। একটি গ্রুপ শুনুন → মিটারে টাইপ করুন →{' '}
          <strong className="text-slate-200">পরবর্তী গ্রুপ</strong> চাপুন। ৫টি গ্রুপ শেষে মিটারে Enter চাপতে বলা হবে।
        </p>
      </div>
    </div>
  );
}
