"use client";

import { useEffect, useRef } from "react";
import StarBullet from "./StarBullet";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  /** Placeholder shown when an item is empty */
  itemPlaceholder?: string;
  /** Hides the "+ 添加一句" button when true */
  hideAdd?: boolean;
};

/**
 * Editable list of essence sentences.
 * Each row: gold star + auto-growing textarea + × delete button.
 * Bottom: "+ 添加一句" button.
 */
export default function EssenceEditor({
  value,
  onChange,
  itemPlaceholder = "我...",
  hideAdd = false,
}: Props) {
  function updateAt(i: number, text: string) {
    const next = value.slice();
    next[i] = text;
    onChange(next);
  }
  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...value, ""]);
  }

  return (
    <div>
      <ul className="space-y-1">
        {value.map((s, i) => (
          <li key={i} className="group flex items-start gap-2">
            <span className="pt-[10px] flex-shrink-0">
              <StarBullet size={14} />
            </span>
            <AutoGrowTextarea
              value={s}
              onChange={(v) => updateAt(i, v)}
              placeholder={itemPlaceholder}
              className="flex-1 min-w-0 bg-transparent resize-none outline-none border-none text-[14px] leading-[24px] text-ink placeholder:text-ink/35 py-1 break-words"
            />
            <button
              type="button"
              aria-label="删除这一句"
              onClick={() => removeAt(i)}
              className="mt-1.5 w-6 h-6 rounded-full flex items-center justify-center text-ink/30 hover:text-ink hover:bg-ink/5 active:bg-ink/10 transition-colors flex-shrink-0"
            >
              <CloseIcon />
            </button>
          </li>
        ))}
      </ul>
      {!hideAdd && (
        <button
          type="button"
          onClick={add}
          className="mt-2 ml-6 inline-flex items-center gap-1 text-[12px] text-ink/55 hover:text-ink transition-colors"
        >
          <PlusIcon />
          添加一句
        </button>
      )}
    </div>
  );
}

function AutoGrowTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
