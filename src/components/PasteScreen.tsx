import { useState, useEffect } from 'react';
import { parseTokens } from '../utils/parse';
import { toBN } from '../utils/bengali';

const LINKEDIN_URL = 'https://www.linkedin.com/in/minhajul/';
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/profile.php?id=61590279887504';
const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfhzCDRaTqxwwDBAD5s1pXASrN1tbJB0lxsjBZAjc3gUC37Tg/viewform';
const GITHUB_URL = 'https://github.com/minhajul-karim/meter-token-reader';
const COUNTER_URL = 'https://script.google.com/macros/s/AKfycbwE1llbsvFK3UkhLUe_NbwjTv2ulCHzhA5dkjQjq_UMKlwk3gH7u0cgNzUMyEaZ0PTdgg/exec';

const SAMPLE_SMS =
  'Successful!Your BPDBprepaid Prepaid Token is 1234-5678-9012-3456-7890,2345-6789-0123-4567-8901,3456-7890-1234-5678-9012';

interface Props {
  onStart: (text: string) => void;
  ttsSupported: boolean;
  lang: 'bn' | 'en';
}

export default function PasteScreen({ onStart, ttsSupported, lang }: Props) {
  const [text, setText] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${COUNTER_URL}?count=true`)
      .then(r => r.json())
      .then(d => setUserCount(d.count))
      .catch(() => {});
  }, []);

  const tokenCount = parseTokens(text).length;
  const hasText = text.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col p-5 gap-5">
      <div className="pt-3">
        <p className="text-amber-600 text-[11px] font-semibold tracking-[.12em] uppercase">
          বিপিডিবি প্রিপেইড মিটার
        </p>
        <h1 className="text-[26px] font-bold text-slate-900 mt-1">টোকেন রিডার</h1>
        <p className="text-slate-500 text-sm leading-7 mt-1.5">
          রিচার্জের SMS পেস্ট করুন। অ্যাপ প্রতিটি টোকেন বাংলায় পড়বে — একা মিটারে টোকেন দেওয়া যাবে, কারো সাহায্য লাগবে না।
        </p>
        {userCount !== null && (
          <p className="text-xs text-slate-400 mt-2">
            এখন পর্যন্ত {toBN(userCount)}টি টোকেন পড়া হয়েছে
          </p>
        )}
      </div>

      {!ttsSupported && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3">
          <p className="text-amber-700 text-sm leading-snug">
            ⚠️ আপনার ব্রাউজার ভয়েস সাপোর্ট করছে না। Chrome বা Samsung Browser-এ খুলুন।
          </p>
        </div>
      )}
      {ttsSupported && lang === 'en' && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-3">
          <p className="text-slate-500 text-sm leading-snug">
            ℹ️ Bengali voice not found — reading digits in English.
          </p>
        </div>
      )}

      <div>
        <p className="text-slate-500 text-xs mb-1.5">রিচার্জের SMS</p>
        <textarea
          className="w-full h-32 bg-white border border-slate-200 rounded-2xl p-3.5 text-slate-800 text-sm leading-relaxed resize-none outline-none focus:border-amber-500 transition-colors"
          placeholder="সম্পূর্ণ SMS এখানে পেস্ট করুন…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {hasText && (
          <p className={`text-xs mt-1.5 ${tokenCount > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {tokenCount > 0
              ? `✓ ${toBN(tokenCount)}টি টোকেন পাওয়া গেছে`
              : '✗ কোনো টোকেন নেই — সম্পূর্ণ SMS পেস্ট করুন'}
          </p>
        )}
      </div>

      <div className="flex gap-2.5">
        <button
          className="px-4 py-3 bg-white text-slate-600 text-sm border border-slate-200 rounded-xl active:bg-slate-50"
          onClick={() => setText(SAMPLE_SMS)}
        >
          নমুনা দেখুন
        </button>
        <button
          className="flex-1 py-3.5 bg-amber-400 text-slate-900 font-bold text-base rounded-2xl disabled:opacity-35 active:bg-amber-500 cursor-pointer"
          disabled={tokenCount === 0}
          onClick={() => onStart(text)}
        >
          পড়া শুরু করুন →
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
        <p className="text-amber-600 font-semibold text-sm mb-1">কিভাবে কাজ করে</p>
        <p className="text-slate-600 text-sm leading-relaxed">
          প্রতিটি ২০ সংখ্যার টোকেন একবারে পড়া হবে — ৫টি গ্রুপ একে একে বলা হবে।{' '}
          শুনুন → মিটারে সব সংখ্যা টাইপ করুন →{' '}
          <strong className="text-slate-800">মিটারে Enter চাপুন</strong> →{' '}
          অ্যাপে <strong className="text-slate-800">Enter চাপলাম</strong> বোতাম চাপুন।
        </p>
      </div>

      <div className="mt-auto pt-2 pb-1 flex flex-col items-center gap-2 text-xs text-slate-400">
        <div className="flex items-center justify-center flex-wrap gap-3">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">LinkedIn</a>
          <span>·</span>
          <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Facebook</a>
          <span>·</span>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">GitHub</a>
          <span>·</span>
          <a href={FEEDBACK_FORM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">মতামত</a>
        </div>
        <span>তৈরি করেছেন Minhajul Karim</span>
      </div>
    </div>
  );
}
