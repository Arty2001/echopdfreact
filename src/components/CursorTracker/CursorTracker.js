import React from "react";
import { useMouse } from "@mantine/hooks";

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

	React.useEffect(()=>{
		if(isCursorTracking){

			const handleMouseMove = () => {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => {
					console.log("Focusing on", x, y);
					const selectedSpan = document.elementFromPoint(x,y);
					var selectedText = null;
					if (selectedSpan && selectedSpan.classList.contains("word") ){
						selectedText = selectedSpan.innerText;
					} 

					if (selectedText && selectedSpan !== lastSelectedSpan) {
						setTextQueue((prevQueue) => [...prevQueue, selectedText]);
                		setLastSelectedSpan(selectedSpan);
					}
				}, 100); // Adjust the timeout as needed
			};

			handleMouseMove();
		}
	},[x,y,isCursorTracking,lastSelectedSpan])

	React.useEffect(() => {
        // When textQueue changes, attempt to read the next text
		function readNextText(){
			if (textQueue.length > 0 && !isSpeaking) {
				const utterance = new SpeechSynthesisUtterance(textQueue[0]);
				utterance.onend = () => {
					// After speaking ends, remove the spoken text from the queue
					setTextQueue((prevQueue) => prevQueue.slice(1));
					setIsSpeaking(false);
				};
				setIsSpeaking(true);
				window.speechSynthesis.speak(utterance);
			}
		};

        readNextText();
    }, [textQueue,isSpeaking]);


  return (
		<div style={{display:"none"}} >{isCursorTracking ? 
			"yes cursor" :
			"not Cursor"
		}</div>
  );
}
