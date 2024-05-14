import React from "react";
import { DropzoneButton } from "../components/DropZoneButton/DropzoneButton";
import Header from "../components/Header/Header";
import { Stack } from "@mantine/core";
import { FeaturesAsymmetrical } from "../components/FeaturesAsymmetrical/FeaturesAsymmetrical";

export default function Home({ pdfToHtml }) {
  return (
    <Stack h={"95vh"} p={"3vh"} justify="space-between">
      <Header />
      <DropzoneButton pdfToHtml={pdfToHtml} />
      <FeaturesAsymmetrical />
    </Stack>
  );
}
