import { Title, Text  } from "@mantine/core";
import * as classes from "./Heading.css";

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Sustainability{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "red", to: "blue" }}
        >
          Resources
        </Text>
      </Title>
      <Text color="black" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This webpage provides the latest sustainability information from a diverse array of sources, 
        including news outlets, official government websites, and international organizations.
      </Text>
    </>
  );
}
