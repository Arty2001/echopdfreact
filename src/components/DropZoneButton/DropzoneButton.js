import React, { useRef } from "react";
import { Text, Group, Button, useMantineTheme } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import classes from "./DropZoneButton.module.css";
import { useMediaQuery } from "@mantine/hooks";

export function DropzoneButton({ pdfToHtml }) {
  const theme = useMantineTheme();
  const openRef = useRef(null);
  const matches = useMediaQuery('(min-width: 56.25em)');

  return (
    <div className={classes.center}>
      <div className={classes.wrapper}>
        <Dropzone
          openRef={openRef}
          onDrop={(files) => pdfToHtml(files[0])}
          className={classes.dropzone}
          radius="md"
          accept={[MIME_TYPES.pdf]}
        >
          <div style={{ pointerEvents: "none", width:'100%', height:'100%'}}>
            <Group justify="center" style={{width:'100%', height:'40%'}}>
              <Dropzone.Accept>
                <IconDownload
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                  width={"90%"}
                  height={"90%"}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  color={theme.colors.red[6]}
                  stroke={1.5}
                  width={"90%"}
                  height={"90%"}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload
                  width={"90%"}
                  height={"90%"}
                  stroke={1.5}
                />
              </Dropzone.Idle>
            </Group>
            <div style={{height:'50%'}}>
            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
              <Dropzone.Idle>Upload PDF</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Interactive PDF Listening : Follow Your Path , Hear What Matters !
            </Text>
            </div>
          </div>
        </Dropzone>

        <Button
          className={classes.control}
          size="md"
          radius="xl"
          onClick={() => openRef.current?.()}
        >
          Try it out
        </Button>
      </div>
    </div>
  );
}
