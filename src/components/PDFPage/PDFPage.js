import React, { useState, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import "./PDFPage.css";

function PdfPage({ pageNumber, pdf }) {
  const [page, setPage] = useState();
  const [pageDim, setPageDim] = useState({height:0,width:0});

  useEffect(() => {
    const loadPage = async () => {
      const loadedPage = await pdf.getPage(pageNumber);
      setPage(loadedPage);
      const viewport = loadedPage.getViewport({ scale: 1 });
      setPageDim({height: viewport.height, width: viewport.width});
    };

    loadPage();
  }, [pageNumber, pdf]);

  return (
    <div
      className="PdfPage"
      style={{height: pageDim.height, width: pageDim.width,boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adding shadow
      borderRadius: "3px", // Adding border radius for a modern look
      overflow: "hidden", // Ensure overflow is hidden to contain the shadow
    }}

    >
      {page && (
        <>
          <canvas
            ref={(canvas) => {
              if (!canvas || !page) return;

              const viewport = page.getViewport({ scale: 1 })
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              page.render({ canvasContext: context, viewport });
              context.globalCompositeOperation = 'difference';
            }}
          />
          <div
            className="PdfPage__textLayer"
            ref={(textLayerRef) => {
              if (!textLayerRef || !page) return;
              const viewport = page.getViewport({ scale: 1 })
              page.getTextContent().then((textContent) => {
                // Pass the data to the method for rendering of text over the pdf canvas.
                pdfjs.renderTextLayer({
                  textContentSource: textContent,
                  textContent: textContent,
                  container: textLayerRef,
                  viewport: viewport,
                  textDivs: [],
                });
              });
            }}
          ></div>
        </>
      )}
    </div>
  );
}

export default PdfPage;
