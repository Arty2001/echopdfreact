import React, { useState, useEffect, useMemo } from "react";
import {useMouse} from "@mantine/hooks";
import * as pdfjs from "pdfjs-dist";
import "./PDFPage.css";

function PdfPage({ pageNumber, pdf, pageDim, setPageDim }) {
  const [page, setPage] = useState();
  const {x,y} = useMouse();

  useEffect(() => {
    const loadPage = async () => {
      const loadedPage = await pdf.getPage(pageNumber);
      setPage(loadedPage);
      const viewport = loadedPage.getViewport({ scale: 1 });
      setPageDim({ height: viewport.height, width: viewport.width });
    };

    loadPage();
  }, [pageNumber, pdf, setPageDim]);

  	const handleClick = async (event) => {

		const selectedSpan = document.elementFromPoint(x,y);
		var selectedText = null;
		console.log(selectedSpan.innerText);
		if (selectedSpan.innerText){
		 selectedText = selectedSpan.innerText;
	 } 
		

	 if (selectedText) {
		 console.log("Selected Text: ", selectedText);
		 readTextAloud(selectedText);
	 }
	 // } else {
	 //   console.log("No text found at this location");
	 // }
 };

 const readTextAloud = (text) => {
	 const utterance = new SpeechSynthesisUtterance(text);
	 window.speechSynthesis.cancel(); // Cancel any ongoing speech
	 window.speechSynthesis.speak(utterance);
 };

  const memoizedCanvas = useMemo(() => {
    if (!page) return null;

    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    page.render({ canvasContext: context, viewport });
    context.globalCompositeOperation = "difference";

    return canvas;
  }, [page]);

  const memoizedTextLayer = useMemo(() => {
    if (!page) return null;

    const textLayerRef = document.createElement("div");
    textLayerRef.className = "PdfPage__textLayer";
    const viewport = page.getViewport({ scale: 1 });
    page.getTextContent().then(async (textContent) => {
      await pdfjs.renderTextLayer({
        textContentSource: textContent,
        textContent: textContent,
        container: textLayerRef,
        viewport: viewport,
        textDivs: [],
      });

      const textElements = textLayerRef.querySelectorAll(
        'span[role="presentation"]'
      );

      textElements.forEach((textElement) => {
        // Get the text content of the current text element
        const textContent = textElement.innerHTML;

        // Split the text content into words and whitespaces
        const wordsAndWhitespaces = textContent.split(/(\s+)/);

        // Create an array to hold the newly created span elements
        const wrappedContent = wordsAndWhitespaces.map((item) => {
          // Create a new span element for each word
          const span = document.createElement("span");

          // Set the text content of the span element to the current item
          span.textContent = item;

          // Return the newly created span element
          return span.outerHTML;
        });

        // Join the wrapped content array into a single string
        const wrappedText = wrappedContent.join("");

        // Replace the content of the current text element with the wrapped text
        textElement.innerHTML = wrappedText;
      });
    });

    return textLayerRef;
  }, [page]);

  return (
    <div
      className="PdfPage"
      style={{
        height: pageDim.height,
        width: pageDim.width,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "3px",
        overflow: "hidden",
      }}
      onClick={(e)=>{handleClick(e)}}
    >
      {memoizedCanvas && (
        <canvas
          ref={(canvas) => canvas && canvas.replaceWith(memoizedCanvas)}
        />
      )}
      {memoizedTextLayer && (
        <div
          ref={(textLayerRef) =>
            textLayerRef && textLayerRef.replaceWith(memoizedTextLayer)
          }
        />
      )}
    </div>
  );
}

export default React.memo(PdfPage);
