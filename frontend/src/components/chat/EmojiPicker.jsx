import { useState } from "react";
import "../../styles/components/EmojiPicker.css";

const EMOJIS = [
  "😀", "😂", "😍", "🥰", "😎", "🤔", "👍", "👋", "🙌", "💪",
  "🔥", "✨", "❤️", "🎉", "👏", "🚀", "💡", "📚", "💼", "🎯",
];

export default function EmojiPicker({ onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="emoji-picker-wrap">
      <button
        type="button"
        className="emoji-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Emoji picker"
      >
        😊
      </button>
      {open ? (
        <div className="emoji-panel">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="emoji-btn"
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
