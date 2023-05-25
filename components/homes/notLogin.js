import Image from "next/image";
import {
  Flex,
  Box,
  Center,
  Text,
  Heading,
  HStack,
  Button,
} from "@chakra-ui/react";
import AppContext from "../globalContext";
import { useState, useContext } from "react";
import CustomImage from "../customImage";
import Right from "./right";

export default function NotLogin() {
  const context = useContext(AppContext);

  function LeftAll() {
    const [backgroundWidth, setBackgroundWidth] = useState(900);
    const [leftDownWidth, setLeftDownWidth] = useState(500);
    function LeftDownImage() {
      return (
        <Box position={"absolute"} bottom="0">
          <Image
            priority={true}
            src={"/images/home/Asset3.png"}
            width={leftDownWidth}
            height="0"
            alt={"asset"}
          />
        </Box>
      );
    }
    function LeftBackground() {
      return (
        <Box position={"absolute"}>
          <Image
            priority={true}
            src={"/images/home/BG_Deco.png"}
            width={backgroundWidth}
            height={'0'}
            alt={"asset"}
          />
        </Box>
      );
    }
    function LeftText() {
      return (
        <Box
          position={"relative"}
          width={backgroundWidth}
          height={backgroundWidth}
        >
          <Flex
            height={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Heading fontSize={"7rem"} color={"#1166EE"}>
              Tally Book
            </Heading>
            <Text color={"gray"} fontSize={"2rem"} width={"50%"}>
              lorem hjkhkjdh hfjkshfjsk fhkjshadfjk shf hdsjklf hjksl fhj
            </Text>
            <Buttons position={"absolute"} />
          </Flex>
        </Box>
      );
    }
    function Buttons() {
      return (
        <HStack spacing="24px">
          <Button
            background={"#1166EE"}
            color={"white"}
            fontSize={"2rem"}
            width={"8rem"}
            height={"4rem"}
          >
            SignUp
          </Button>
          <Button
            background={"#1166EE"}
            color={"white"}
            fontSize={"2rem"}
            width={"8rem"}
            height={"4rem"}
          >
            Login
          </Button>
        </HStack>
      );
    }
    return (
      <Box>
        <Box position={"relative"}>
          <LeftBackground />
          <LeftText position={"absolute"} />
        </Box>
        <LeftDownImage />
      </Box>
    );
  }
  return (
    <>
      <Flex
        width={"100vw"}
        height="calc(100vh - 7rem)"
        position={"relative"}
        className={"chinko"}
      >
        <LeftAll flexBasis={"30%"}/>
        <Right flexBasis={"70%"} position={'absolute'}/>
      </Flex>
    </>
  );
}
