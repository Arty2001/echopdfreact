import { Text, SimpleGrid, Container } from "@mantine/core";
import { IconTruck, IconCertificate, IconCoin, IconShield, IconBrowser, IconNavigationCode } from "@tabler/icons-react";
import classes from "./FeaturesAsymmetrical.module.css";

function Feature({ icon, title, description, className, ...others }) {
  return (
    <div className={classes.feature} {...others}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        {title === "Seamless PDF Interaction" && <IconNavigationCode/>}
        {title === "Secure and Private" && <IconShield/>}
        {title === "Modern and Minimalistic Design" && <IconBrowser/>}
        <Text fw={700} fz="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}

const features = [
  {
    icon: IconTruck,
    title: "Seamless PDF Interaction",
    description:
      "Effortlessly navigate through PDFs using your eyes or cursor. With EchoPDF, you can customize your reading path for an intuitive and personalized experience. Gain full control over how you engage with your documents, making reading more enjoyable and efficient.",
  },
  {
    icon: IconCertificate,
    title: "Secure and Private",
    description:
      "Your privacy is our utmost priority. EchoPDF ensures that your files are never stored on any server or backend system. Enjoy complete peace of mind knowing that your reading habits and documents are kept confidential and secure at all times.",
  },
  {
    icon: IconCoin,
    title: "Modern and Minimalist Design",
    description:
      "Experience a distraction-free reading environment with our simplistic, modern UI. EchoPDF provides a clean interface with no ads or overlays, allowing you to focus solely on your content. We prioritize a seamless reading experience to enhance your productivity and enjoyment.",
  },
];

export function FeaturesAsymmetrical() {
  const items = features.map((item) => <Feature {...item} key={item.title} />);

  return (
    <Container mt={30} mb={30} size="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={50}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
