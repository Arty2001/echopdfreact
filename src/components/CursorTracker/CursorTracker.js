import React, { useState, useEffect, useRef } from "react";
import { useMouse } from "@mantine/hooks";
import "./CursorTracker.css";

// The highlight is carried by two elements at once: the active `.word` span and
// the `span[role="presentation"]` run it lives in (CursorTracker.css gives the
// run the softer `--highlight-color-parent` tint). Both are driven from a single
// reference to the active word so the two can never drift apart.
function clearHighlight(activeWordRef) {
  const active = activeWordRef.current;
  if (active) {
    active.classList.remove("selected");
    if (active.parentElement) {
      active.parentElement.classList.remove("selected");
    }
  }
  activeWordRef.current = null;
}

function highlightWord(activeWordRef, wordSpan) {
  if (!wordSpan || wordSpan === activeWordRef.current) return;
  clearHighlight(activeWordRef);
  wordSpan.classList.add("selected");
  if (wordSpan.parentElement) {
    wordSpan.parentElement.classList.add("selected");
  }
  activeWordRef.current = wordSpan;
}

// Groups a run of `.word` spans into sentence chunks. Each chunk keeps the spans
// it was built from, in order, together with the character offset at which each
// span's text starts inside the chunk's `text`. Because the text is assembled
// here rather than read back off the DOM, those offsets are exact — which is
// what makes a `boundary` event's charIndex resolvable to a specific span.
function buildSentenceQueue(wordSpans) {
  const queue = [];
  let words = [];
  let text = "";

  const flush = () => {
    if (!words.length) return;
    queue.push({ text, words });
    words = [];
    text = "";
  };

  for (const span of wordSpans) {
    // The text-layer rebuild also emits whitespace-only `.word` spans to keep
    // spacing; they are not speakable and must not consume a boundary event.
    const word = span.textContent.trim();
    if (!word) continue;

    const start = text.length ? text.length + 1 : 0;
    text = text.length ? `${text} ${word}` : word;
    words.push({ span, start });

    if (/[.!?]$/.test(word)) flush();
  }

  flush();
  return queue;
}

// Resolve a boundary event's charIndex to the chunk word that contains it: the
// last word that starts at or before the index. Mapping by offset rather than
// by counting boundary events keeps the highlight correct even when a voice
// skips a token, fires on punctuation, or repeats an index.
function wordAtCharIndex(chunk, charIndex) {
  let match = null;
  for (const word of chunk.words) {
    if (word.start > charIndex) break;
    match = word;
  }
  return match;
}

export function CursorTracker({ isCursorTracking }) {
  const { x, y } = useMouse();
  const timeoutRef = useRef(null);
  const cancelTimeoutRef = useRef(null);
  const activeWordRef = useRef(null);
  const [textQueue, setTextQueue] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSelectedSpan, setLastSelectedSpan] = useState(null);
  const [readingSpeed, setReadingSpeed] = useState(1.2);

  useEffect(() => {
    if (isCursorTracking) {
      const handleMouseMove = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          if (cancelTimeoutRef.current) {
            clearTimeout(cancelTimeoutRef.current);
          }
          cancelTimeoutRef.current = setTimeout(() => {
            window.speechSynthesis.cancel(); // Stop the current speech
            setIsSpeaking(false); // Allow new text to be read
            clearHighlight(activeWordRef);
          }, 300); // cursor wait delay

          const selectedSpan = document.elementFromPoint(x, y);
          var selectedText = "";
          if (selectedSpan && selectedSpan.classList.contains("word")) {
            selectedText = selectedSpan.innerText;
          }

          if (
            selectedText.replace(/\s/g, "").length &&
            selectedText &&
            selectedSpan !== lastSelectedSpan
          ) {
            const parentElement = selectedSpan.parentElement;
            if (parentElement) {
              const siblings = Array.from(parentElement.children);
              const startIndex = siblings.indexOf(selectedSpan);
              const updatedTextQueue = buildSentenceQueue(
                siblings.slice(startIndex)
              );

              clearHighlight(activeWordRef);
              setTextQueue(updatedTextQueue);
              setLastSelectedSpan(selectedSpan);
            }
          }
        }, 50); // Adjust the timeout as needed
      };

      handleMouseMove();
    }

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y, isCursorTracking]);

  useEffect(() => {
    // When textQueue changes, attempt to read the next text
    function getElementPositionRelativeToDocument(element) {
      const x = parseFloat(element.style.left);
      const y = parseFloat(element.style.top);
      return { x, y };
    }

    function readNextText() {
      if (textQueue.length > 0 && !isSpeaking) {
        const chunk = textQueue[0];
        const utterance = new SpeechSynthesisUtterance(chunk.text);

        utterance.addEventListener("boundary", (event) => {
          if (event.name !== "word") return;
          const word = wordAtCharIndex(chunk, event.charIndex);
          if (word) {
            highlightWord(activeWordRef, word.span);
          }
        });

        utterance.rate = readingSpeed;
        utterance.onstart = () => {
          // Start on the sentence's FIRST word, so the boundary events that
          // follow move the highlight forward through the sentence.
          highlightWord(activeWordRef, chunk.words[0].span);
        };
        utterance.onend = () => {
          clearHighlight(activeWordRef);
          setTextQueue((prevQueue) => prevQueue.slice(1));
          setIsSpeaking(false);
        };

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      } else if (!isSpeaking && lastSelectedSpan && isCursorTracking) {
        const spanPresentationElements = Array.from(
          lastSelectedSpan.parentElement.parentElement.querySelectorAll('span[role="presentation"]')
        );
        const pastCoordinates = getElementPositionRelativeToDocument(
          lastSelectedSpan.parentElement
        );

        let nextSpan = null;
        let minDx = Infinity;
        let minDy = Infinity;

        for (const spanPresentationElement of spanPresentationElements) {
          // Skip the iteration if it's the same element as lastSelectedSpan's parent
          if (lastSelectedSpan.parentElement === spanPresentationElement) {
            continue;
          }

          // Calculate the distance from spanPresentationElement
          const newCoordinates = getElementPositionRelativeToDocument(
            spanPresentationElement
          );

          const dx = newCoordinates.x - pastCoordinates.x;
          const dy = newCoordinates.y - pastCoordinates.y;

          if (dy < 0) {
            continue;
          }
          if (dy === 0 && dx >= 0) {
            if (dx < minDx || dy < minDy) {
              nextSpan = spanPresentationElement;
              minDx = dx;
              minDy = dy;
            }
          } else if (dy > 0) {
            if (dy < minDy) {
              nextSpan = spanPresentationElement;
              minDy = dy;
            }
          }
        }

        if (nextSpan) {
          const updatedTextQueue = buildSentenceQueue(
            Array.from(nextSpan.children)
          );
          const firstWord = updatedTextQueue.length
            ? updatedTextQueue[0].words[0].span
            : nextSpan.children[0];

          if (firstWord) {
            setTextQueue(updatedTextQueue);
            setLastSelectedSpan(firstWord);
          }
        }
      }
    }

    readNextText();
  }, [textQueue, isSpeaking, lastSelectedSpan, isCursorTracking, readingSpeed]);

  return (
    <div>
      <div style={{ display: "none" }}>
        {isCursorTracking ? "yes cursor" : "not Cursor"}
      </div>
      <label>
        Reading Speed:
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={readingSpeed}
          onChange={(e) => setReadingSpeed(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
