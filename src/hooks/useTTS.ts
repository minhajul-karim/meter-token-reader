import { useEffect, useRef, useState } from 'react';

const EN_W: Record<string, string> = {
  '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
  '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
};

export function useTTS() {
  const [rate, setRate] = useState(0.75);
  const [supported] = useState(() => 'speechSynthesis' in window);
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!supported) return;

    function loadVoices() {
      const voices = speechSynthesis.getVoices();
      const bnVoice =
        voices.find(v => v.lang === 'bn-BD') ??
        voices.find(v => v.lang === 'bn-IN') ??
        voices.find(v => v.lang.startsWith('bn')) ??
        null;
      if (bnVoice) {
        voiceRef.current = bnVoice;
        setLang('bn');
      } else {
        voiceRef.current =
          voices.find(v => v.lang === 'en-US') ??
          voices.find(v => v.lang.startsWith('en')) ??
          null;
        setLang('en');
      }
    }

    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices();
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [supported]);

  function makeUtterance(text: string, overrideRate?: number) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    u.rate = overrideRate ?? rate;
    if (voiceRef.current) u.voice = voiceRef.current;
    return u;
  }

  function say(text: string, overrideRate?: number) {
    if (!supported) return;
    speechSynthesis.cancel();
    speechSynthesis.speak(makeUtterance(text, overrideRate));
  }

  function sayFullToken(groups: string[], onDone: () => void) {
    if (!supported) { onDone(); return; }
    speechSynthesis.cancel();
    setIsSpeaking(true);

    groups.forEach(g => {
      const u = new SpeechSynthesisUtterance(g.split('').map(d => EN_W[d] ?? d).join(', '));
      u.lang = 'en-US';
      u.rate = rate;
      speechSynthesis.speak(u);
    });

    const enterText = lang === 'bn'
      ? 'এখন মিটারে Enter চাপুন'
      : 'Now press Enter on the meter';
    const finalU = makeUtterance(enterText);
    finalU.onend = () => {
      setIsSpeaking(false);
      onDone();
    };
    speechSynthesis.speak(finalU);
  }

  function cancel() {
    if (supported) speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  return { supported, lang, isSpeaking, rate, setRate, say, sayFullToken, cancel };
}
