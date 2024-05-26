import React, { useState, useEffect, useRef } from "react";
import { useMouse } from "@mantine/hooks";
import "./CursorTracker.css";

export function CursorTracker({ isCursorTracking }) {
  const { x, y } = useMouse();
  const timeoutRef = useRef(null);
  const cancelTimeoutRef = useRef(null);
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
            if (lastSelectedSpan) {
              lastSelectedSpan.parentElement.classList.remove("selected");
              lastSelectedSpan.classList.remove("selected");
            }
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
            // Remove the highlight from the last selected span
            if (lastSelectedSpan) {
              lastSelectedSpan.parentElement.classList.remove("selected");
              lastSelectedSpan.classList.remove("selected");
            }

            const parentElement = selectedSpan.parentElement;
            if (parentElement) {
              const childElements = parentElement.children;
              const updatedTextQueue = [];
              let found = false;
              let sentence = "";

              for (let i = 0; i < childElements.length; i++) {
                const childElement = childElements[i];
                if (childElement.innerText === selectedText) {
                  found = true;
                }
                if (found) {
                  sentence += childElement.innerText + " ";
                  if (sentence.trim().endsWith(".") || sentence.trim().endsWith("!") || sentence.trim().endsWith("?")) {
                    updatedTextQueue.push({
                      text: sentence.trim(),
                      spanElement: childElement,
                    });
                    sentence = "";
                  }
                }
              }

              // Add any remaining text as the last chunk
              if (sentence.trim().length > 0) {
                updatedTextQueue.push({
                  text: sentence.trim(),
                  spanElement: selectedSpan,
                });
              }

              setTextQueue(updatedTextQueue);
              setLastSelectedSpan(selectedSpan);
            }
          }
        }, 50); // Adjust the timeout as needed
      };

      handleMouseMove();
    }
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
        const utterance = new SpeechSynthesisUtterance(textQueue[0].text);
        utterance.addEventListener('boundary', (event) => {
    if (event.name === 'word') {
        // The current word being spoken
        const selectedElement = document.querySelector('.selected');
        const currentWord = utterance.text.substring(event.charIndex, event.charIndex + event.charLength);
        if (selectedElement) {
          const parentChildren = Array.from(selectedElement.parentElement.children);
          let index = parentChildren.findIndex(child => child === selectedElement);
          selectedElement.classList.remove("selected");
          while(index + 1 < parentChildren.length ){
            if(parentChildren[index+1].innerText.trim().length !== 0 && parentChildren[index+1].innerText.trim() === currentWord){
              break
            } 
            index+=1;
          }
          if( index + 1 < parentChildren.length){
            parentChildren[index+1].classList.add("selected");
          }
        }
        console.log({currentWord});
    }
});
        utterance.rate = readingSpeed; 
        utterance.onend = () => {
          // After speaking ends, remove the spoken text from the queue
          textQueue[0].spanElement.parentElement.classList.remove("selected");
          textQueue[0].spanElement.classList.remove("selected");
          setTextQueue((prevQueue) => prevQueue.slice(1));
          setIsSpeaking(false);
        };
        utterance.onstart = () => {
          if (textQueue[0] && textQueue[0].spanElement) {
            textQueue[0].spanElement.parentElement.classList.add("selected");
            textQueue[0].spanElement.classList.add("selected");
          }
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
          const parentElement = nextSpan;
          const childElements = parentElement.children;
          const updatedTextQueue = [];
          let sentence = "";

          for (let i = 0; i < childElements.length; i++) {
            const childElement = childElements[i];
            sentence += childElement.innerText + " ";
            if (sentence.trim().endsWith(".") || sentence.trim().endsWith("!") || sentence.trim().endsWith("?")) {
              updatedTextQueue.push({
                text: sentence.trim(),
                spanElement: childElement,
              });
              sentence = "";
            }
          }

          // Add any remaining text as the last chunk
          if (sentence.trim().length > 0) {
            updatedTextQueue.push({
              text: sentence.trim(),
              spanElement: parentElement.children[0], // Using first child element of parentElement
            });
          }

          setTextQueue(updatedTextQueue);
          setLastSelectedSpan(parentElement.children[0]);
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
