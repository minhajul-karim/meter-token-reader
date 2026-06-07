import { useState } from 'react';
import PasteScreen from './components/PasteScreen';
import ReadingScreen from './components/ReadingScreen';
import DoneScreen from './components/DoneScreen';
import { useTTS } from './hooks/useTTS';
import { useTokens } from './hooks/useTokens';

type Screen = 'paste' | 'reading' | 'done';

export default function App() {
  const [screen, setScreen] = useState<Screen>('paste');
  const [awaitEnter, setAwaitEnter] = useState(false);
  const tts = useTTS();
  const tok = useTokens();

  function handleStart(text: string) {
    const groups = tok.start(text);
    if (!groups) return;
    setScreen('reading');
    setAwaitEnter(false);
    tts.sayFullToken(groups, 1, () => setAwaitEnter(true));
  }

  function handleConfirmEnter() {
    const result = tok.advance();
    if (result.action === 'done') {
      tts.say(tts.lang === 'bn'
        ? 'সব টোকেন দেওয়া হয়ে গেছে। মিটারের ডিসপ্লে দেখুন।'
        : 'All tokens entered. Check your meter display.');
      setScreen('done');
    } else {
      setAwaitEnter(false);
      tts.sayFullToken(result.groups, result.tokenNum, () => setAwaitEnter(true));
    }
  }

  function handleRepeat() {
    setAwaitEnter(false);
    tts.sayFullToken(tok.curGroups, tok.tIdx + 1, () => setAwaitEnter(true));
  }

  function handleBack() {
    tts.cancel();
    setAwaitEnter(false);
    setScreen('paste');
  }

  function handleNewSession() {
    tok.reset();
    setScreen('paste');
  }

  if (screen === 'paste') {
    return <PasteScreen onStart={handleStart} ttsSupported={tts.supported} lang={tts.lang} />;
  }

  if (screen === 'reading') {
    return (
      <ReadingScreen
        tokens={tok.tokens}
        tIdx={tok.tIdx}
        curGroups={tok.curGroups}
        doneSet={tok.doneSet}
        awaitEnter={awaitEnter}
        isSpeaking={tts.isSpeaking}
        isLastTok={tok.isLastTok}
        ttsRate={tts.rate}
        onConfirmEnter={handleConfirmEnter}
        onRepeat={handleRepeat}
        onBack={handleBack}
        onSetSpeed={tts.setRate}
      />
    );
  }

  return <DoneScreen tokenCount={tok.tokens.length} onNewSession={handleNewSession} />;
}
