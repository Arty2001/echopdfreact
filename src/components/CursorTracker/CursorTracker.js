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


  return (
		<div style={{display:"none"}} >{isCursorTracking ? 
			"yes cursor" :
			"not Cursor"
		}</div>
  );
}
