import React, { useEffect, useState } from "react";

interface TextTypeProps {
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  className?: string;
  loop?: boolean;
}

export default function TextType({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "|",
  className,
  loop = true,
}: TextTypeProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const currentPhrase = text[phraseIndex] ?? "";

    if (typing) {
      if (display.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplay(currentPhrase.slice(0, display.length + 1));
        }, typingSpeed);
      } else {
        // finished typing
        timeout = setTimeout(() => setTyping(false), pauseDuration);
      }
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => {
          setDisplay(currentPhrase.slice(0, display.length - 1));
        }, Math.max(20, Math.floor(typingSpeed / 2)));
      } else {
        const next = phraseIndex + 1;
        if (next >= text.length && !loop) return undefined;
        setPhraseIndex(next % text.length);
        setTyping(true);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [display, typing, phraseIndex, text, typingSpeed, pauseDuration, loop]);

  return (
    <span className={className} aria-live="polite">
      {display}
      {showCursor && <span className="ml-1 animate-blink">{cursorCharacter}</span>}
    </span>
  );
}
