import { useEffect, useRef, useState } from 'react';

interface FitTextProps {
  text: string;
  className?: string;
  startSize?: number;
  minSize?: number;
}

export function FitText({ text, className, startSize = 12, minSize = 7 }: FitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(startSize);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let size = startSize;
    el.style.fontSize = `${size}px`;
    while (el.scrollWidth > el.clientWidth && size > minSize) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
    }
    setFontSize(size);
  }, [text, startSize, minSize]);

  return (
    <span
      ref={ref}
      className={`block whitespace-nowrap ${className ?? ''}`}
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.4 }}
      title={text}
    >
      {text}
    </span>
  );
}
