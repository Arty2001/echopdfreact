import React from "react";
import Home from "./pages/Home";
import { useState } from "react";
import * as pdfjs from "pdfjs-dist";
import "./App.css";
import PdfViewer from "./pages/PDFViewer";

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
        <PdfViewer pdfData={pdfData}/>
      ) : (
        <Home pdfToHtml={pdfToHtml} />
      )}
    </div>
  );
}

export default App;
