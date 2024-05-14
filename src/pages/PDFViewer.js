import React from "react";
import PdfPage from "../components/PDFPage/PDFPage";
import { Stack, Button, ActionIcon, useMantineColorScheme ,useComputedColorScheme} from "@mantine/core";
import classes from './PDFViewer.module.css';
import { IconEye,IconMoon, IconSun, IconHighlight, IconZoomIn } from "@tabler/icons-react";

export default function PdfViewer({ pdfData }) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  return (
    <Stack>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: '10px' }}>
        <div
          style={{
            height: '2rem',
            width: "500px",
            boxShadow:
              "0px 0px .9310142993927002px 0px rgba(0, 0, 0, .17), 0px 0px 3.1270833015441895px 0px rgba(0, 0, 0, .08), 0px 7px 14px 0px rgba(0, 0, 0, .05)",
            borderRadius: ".5rem",
            display:"flex",
            justifyContent:'space-between',
            backgroundColor: 'var(--mantine-color-default)'
          }}
        >
          <div>
            <Button classNames={{root:classes.root}} leftSection={<IconEye size={14} />} style={{height: '2rem'}} variant="default">
                Read Aloud 
            </Button>
          </div>
          <div style={{display:'flex' }}>
            <div style={{fontSize:'12px', textAlign: 'center', lineHeight: '2rem', marginRight: 8}}>Page 1 of 10</div>
            <ActionIcon classNames={{root:classes.root}} size={'2rem'} variant="default">
                <IconZoomIn size={14}/>
            </ActionIcon>
            <ActionIcon classNames={{root:classes.root}} size={'2rem'} variant="default">
                <IconHighlight size={14}/>
            </ActionIcon>
            <ActionIcon classNames={{root:classes.root}} size={'2rem'} variant="default" onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}>
                {computedColorScheme === 'light' ? <IconMoon size={14}/> : <IconSun size={14}/> }
            </ActionIcon>
          </div>
        </div>
      </div>
      <div
        style={{
          "--scale-factor": 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {Array.from({ length: pdfData.numPages }, (_, index) => (
          <PdfPage key={index} pageNumber={index + 1} pdf={pdfData} />
        ))}
      </div>
    </Stack>
  );
}
