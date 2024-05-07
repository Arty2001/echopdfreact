import { Center, Group, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import './App.css';



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
    <div className='PdfPage'>
      {page && (
        <><canvas
          ref={(canvas) => {
            if (!canvas) return;

            const viewport = page.getViewport({ scale: 1 });
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: context, viewport });
          } } /><div className="PdfPage__textLayer" ref={(textLayerRef)=>{
            if(!textLayerRef) return;
            page.getTextContent().then(textContent => {
              const viewport = page.getViewport({ scale: 1 });
              // Pass the data to the method for rendering of text over the pdf canvas.
              pdfjs.renderTextLayer({
                textContentSource: textContent,
                textContent: textContent,
                container: textLayerRef,
                viewport: viewport,
                textDivs: []
              });
            });
          }} >

          </div></>
      )}
    </div>
  );
}


pdfjs.GlobalWorkerOptions.workerSrc ="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs";

function App() {

  const [pdfData, setPdfData] = useState();

  async function pdfToHtml(file){
    const reader = new FileReader();
    var arrayBuffer;
    reader.onload = async function(event) {
      arrayBuffer = event?.target?.result;
      console.log({arrayBuffer})
      const loadingTask = pdfjs.getDocument({data: arrayBuffer});
      console.log({loadingTask})
      loadingTask.promise.then(function(pdf) {
        console.log(pdf);
        setPdfData(pdf);
      });
    };
    reader.readAsArrayBuffer(file);

  }

  return (
    <Center w={'100%'} h={'100vh'}>
      {pdfData ? (
        <div>
          {Array.from({ length: pdfData.numPages }, (_, index) => (
            <PdfPage key={index} pageNumber={index + 1} pdf={pdfData} />
          ))}
        </div>
      ): (<Dropzone accept={['application/pdf']} onDrop={(files) => pdfToHtml(files[0])} >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
      </Dropzone>)}
    </Center>
  );
}

export default App;
