import React from "react";
import { useMouse } from "@mantine/hooks";

//1. timeout for every mouse movement to only capture and
// get the text content when someone actually stops and hovers around the same spot for 1* second

//2. read aloud that basically

//3. highlight what we are saying

//4. Queue structure so add on to text {messaging such rabbit mq}
export function CursorTracker({ isCursorTracking }) {
	const { x, y } = useMouse();

	React.useEffect(()=>{
		if(isCursorTracking){
			///complicated stuff
		}
	},[x,y,isCursorTracking])
// 	const handleClick = async (event) => {

// 		const selectedSpan = document.elementFromPoint(x,y);
// 		var selectedText = null;
// 		console.log(selectedSpan.innerText);
// 		if (selectedSpan.innerText){
// 		 selectedText = selectedSpan.innerText;
// 	 } 
		

// 	 if (selectedText) {
// 		 console.log("Selected Text: ", selectedText);
// 		 readTextAloud(selectedText);
// 	 }
// 	 // } else {
// 	 //   console.log("No text found at this location");
// 	 // }
//  };

//  const readTextAloud = (text) => {
// 	 const utterance = new SpeechSynthesisUtterance(text);
// 	 window.speechSynthesis.cancel(); // Cancel any ongoing speech
// 	 window.speechSynthesis.speak(utterance);
//  };


  return (
		<div style={{display:"none"}} >{isCursorTracking ? 
			"yes cursor" :
			"not Cursor"
		}</div>
  );
}
