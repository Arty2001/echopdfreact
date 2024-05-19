import React, { useEffect } from "react";
import PdfPage from "../components/PDFPage/PDFPage";
import { CursorTracker } from "../components/CursorTracker/CursorTracker";
import {
  Stack,
  Menu,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  rem,
  Center,
  Slider,
  Popover,
} from "@mantine/core";
import { useWindowScroll ,useMouse} from "@mantine/hooks";
import classes from "./PDFViewer.module.css";
import {
  IconEye,
  IconMoon,
  IconSun,
  IconHighlight,
  IconZoomIn,
  IconChevronDown,
  IconPointer,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function PdfViewer({ pdfData }) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [scroll] = useWindowScroll();
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageDim, setPageDim] = React.useState({ height: 0, width: 0 });
  const [isVisible, setIsVisible] = React.useState(true);
  const [zoomOpened, setZoomOpened] = React.useState(false);
  const [scaleFactor, setScaleFactor] = React.useState(50);
  const [isCursorTracking, setIsCursorTracking] = React.useState(false);
  const { y } = useMouse();


  useEffect(() => {
    const headerHeight = 35; // Height of the header
    const gapBetweenPages = 10; // Gap between PDF pages
    const totalHeightPerPage = pageDim.height + gapBetweenPages; // Total height of each PDF page including the gap
    const pageNum =
      Math.round((scroll.y - headerHeight) / (totalHeightPerPage / 2) / 2) + 1;
    setPageNumber(pageNum);
    if (scroll.y > 0 && isVisible){
      setIsVisible(false);
      setZoomOpened(false);
    } else if ( scroll.y < 35 & !isVisible){
      setIsVisible(true);
    }
  }, [scroll,isVisible, pageDim]);

  useEffect(() => {
    if(y < 40){
      setIsVisible(true);
    }
  }, [y]);



  return (
      <Stack >
        <CursorTracker isCursorTracking={isCursorTracking}/>
        <div style={{ width: "100%", height: 35 }}></div>
          <motion.div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              position: "fixed",
              zIndex: 2,
            }}
            animate={ isVisible ? { opacity: 1 } : {opacity:0,y:-20}}
          >
            <div
              style={{
                height: 32,
                width: "500px",
                boxShadow:
                  "0px 0px .9310142993927002px 0px rgba(0, 0, 0, .17), 0px 0px 3.1270833015441895px 0px rgba(0, 0, 0, .08), 0px 7px 14px 0px rgba(0, 0, 0, .05)",
                borderRadius: ".5rem",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "var(--mantine-color-default)",
              }}
            >
              <div>
                <Menu
                  transitionProps={{ transition: "pop" }}
                  position="bottom-end"
                  withinPortal
                >
                  <Menu.Target>
                    <ActionIcon
                      variant="default"
                      className={classes.menuControl}
                      classNames={{ root: classes.readaloudbutton }}
                    >
                      <IconSpeakerphone
                        style={{ width: 14, height: 14, margin: 5 }}
                        stroke={1.5}
                      />
                      <div
                        style={{
                          fontFamily: "var(--mantine-font-family)",
                          fontSize: 14,
                          margin: 2,
                        }}
                      >
                        {" "}
                        Read Aloud{" "}
                      </div>{" "}
                      <IconChevronDown
                        style={{ width: 14, height: 14 }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={
                        <IconPointer
                          style={{ width: 14, height: 14 }}
                          stroke={1.5}
                          color={isCursorTracking ? "red" : "black"}
                        />
                      }
                      onClick={() => {
                        if (isCursorTracking){
                          setIsCursorTracking(false);
                        } else{
                          setIsCursorTracking(true);
                        }
                      }}
                    >
                      Cursor Tracking
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <IconEye
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      rightSection={
                        <Center width={"100%"} height={"100%"}>
                          <div className={classes.chip}> BETA </div>
                        </Center>
                      }
                    >
                      Eye Tracking
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                    lineHeight: "2rem",
                    marginRight: 8,
                  }}
                >
                  Page {pageNumber} of {pdfData.numPages}
                </div>
                <Popover opened={zoomOpened} onChange={setZoomOpened}>
                  <Popover.Target>
                    <ActionIcon
                      classNames={{ root: classes.root }}
                      size={"2rem"}
                      variant="default"
                      onClick={() => setZoomOpened((o) => !o)}
                    >
                      <IconZoomIn size={14} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <div style={{width:100}}>
                      <Slider
                        size="xs"
                        color="blue"
                        value={scaleFactor}
                        onChange={setScaleFactor}
                      />
                    </div>
                  </Popover.Dropdown>
                </Popover>
                <ActionIcon
                  classNames={{ root: classes.root }}
                  size={"2rem"}
                  variant="default"
                >
                  <IconHighlight size={14} />
                </ActionIcon>
                <ActionIcon
                  classNames={{ root: classes.root }}
                  size={"2rem"}
                  variant="default"
                  onClick={() =>
                    setColorScheme(
                      computedColorScheme === "light" ? "dark" : "light"
                    )
                  }
                >
                  {computedColorScheme === "light" ? (
                    <IconMoon size={14} />
                  ) : (
                    <IconSun size={14} />
                  )}
                </ActionIcon>
              </div>
            </div>
          </motion.div>
        <div
          style={{
            "--scale-factor": 1 * (scaleFactor/50),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {Array.from({ length: pdfData.numPages }, (_, index) => (
            <PdfPage
              key={index}
              pageNumber={index + 1}
              pdf={pdfData}
              pageDim={pageDim}
              setPageDim={setPageDim}
            />
          ))}
        </div>
      </Stack> 
       );
}
