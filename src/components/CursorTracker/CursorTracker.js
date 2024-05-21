import React from "react";
import { useMouse } from "@mantine/hooks";
import "./CursorTracker.css";

//1. timeout for every mouse movement to only capture and
// get the text content when someone actually stops and hovers around the same spot for 1* second

//2. read aloud that basically

//3. highlight what we are saying

//4. Queue structure so add on to text {messaging such rabbit mq}
export function CursorTracker({ isCursorTracking }) {
  const { x, y } = useMouse();
  const timeoutRef = React.useRef(null);
  const [textQueue, setTextQueue] = React.useState([]);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [lastSelectedSpan, setLastSelectedSpan] = React.useState(null);

  React.useEffect(() => {
    if (isCursorTracking) {
      const handleMouseMove = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
			console.log("test");
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
            const childElements = parentElement.children;
            const updatedTextQueue = [];
            let found = false;

            for (const childElement of childElements) {
              if (childElement.innerText === selectedText) {
                updatedTextQueue.push({
                  text: childElement.innerText,
                  spanElement: childElement,
                });
                found = true;
              } else if (
                found &&
                childElement.innerText.replace(/\s/g, "").length
              ) {
                updatedTextQueue.push({
                  text: childElement.innerText,
                  spanElement: childElement,
                });
              }
            }

            setTextQueue(updatedTextQueue);
            setLastSelectedSpan(selectedSpan);
          }
        }, 50); // Adjust the timeout as needed
      };

      handleMouseMove();
    }
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y, isCursorTracking]);

  React.useEffect(() => {
    // When textQueue changes, attempt to read the next text
    function getElementPositionRelativeToDocument(element) {
      const x = parseFloat(element.style.left)
      const y = parseFloat(element.style.top)
      return { x, y };
    }

    function readNextText() {
      if (textQueue.length > 0 && !isSpeaking) {
        const utterance = new SpeechSynthesisUtterance(textQueue[0].text);
        utterance.onend = () => {
          // After speaking ends, remove the spoken text from the queue
          textQueue[0].spanElement.parentElement.classList.remove("selected");
          textQueue[0].spanElement.classList.remove("selected");
          setTextQueue((prevQueue) => prevQueue.slice(1));
          setIsSpeaking(false);
        };
        textQueue[0].spanElement.parentElement.classList.add("selected");
        textQueue[0].spanElement.classList.add("selected");
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

          const distance = Math.sqrt(
            Math.pow(newCoordinates.x- pastCoordinates.x, 2) + Math.pow(newCoordinates.y- pastCoordinates.y, 2)
          );

		  const dx = newCoordinates.x - pastCoordinates.x;
		  const dy = newCoordinates.y - pastCoordinates.y;

		  
		  if (dy<0){
			continue;
		  }
		  if(dy===0 && dx>=0){
			if( dx < minDx || dy < minDy) {
				nextSpan = spanPresentationElement;
				minDx= dx;
				minDy= dy;
			}
		  } else if (dy > 0) {
			if (dy < minDy){
				nextSpan = spanPresentationElement;
				minDy = dy;
			}
		  }

        }
		
		const parentElement = nextSpan;
		const childElements = parentElement.children;
		const updatedTextQueue = [];

		for (const childElement of childElements) {
			updatedTextQueue.push({
				text: childElement.innerText,
				spanElement: childElement,
			});
		}

		setTextQueue(updatedTextQueue);
		setLastSelectedSpan(parentElement.children[0])
      }
    }

    readNextText();
  }, [textQueue, isSpeaking,lastSelectedSpan,isCursorTracking]);

  return (
    <div style={{ display: "none" }}>
      {isCursorTracking ? "yes cursor" : "not Cursor"}
    </div>
  );
}
