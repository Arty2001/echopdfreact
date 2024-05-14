import React from "react";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import "./App.css";

function PdfPage({ pageNumber, pdf }) {
  const [page, setPage] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      const loadedPage = await pdf.getPage(pageNumber);
      setPage(loadedPage);
    };

    loadPage();
  }, [pageNumber, pdf]);

  return (
    <div className="PdfPage">
      {page && (
        <>
          <canvas
            ref={(canvas) => {
              if (!canvas) return;

              const viewport = page.getViewport({ scale: 1 });
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              page.render({ canvasContext: context, viewport });
            }}
          />
          <div
            className="PdfPage__textLayer"
            ref={(textLayerRef) => {
              if (!textLayerRef) return;
              page.getTextContent().then((textContent) => {
                const viewport = page.getViewport({ scale: 1 });
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

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs";

function App() {
  const [pdfData, setPdfData] = useState();

  async function pdfToHtml(file) {
    const reader = new FileReader();
    var arrayBuffer;
    reader.onload = async function (event) {
      arrayBuffer = event?.target?.result;
      console.log({ arrayBuffer });
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      console.log({ loadingTask });
      loadingTask.promise.then(function (pdf) {
        console.log(pdf);
        setPdfData(pdf);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div w={"100%"} h={"100vh"}>
      {pdfData ? (
        <div>
          {Array.from({ length: pdfData.numPages }, (_, index) => (
            <PdfPage key={index} pageNumber={index + 1} pdf={pdfData} />
          ))}
        </div>
      ) : (
        <Home pdfToHtml={pdfToHtml} />
      )}
    </div>
  );
}

export default App;
