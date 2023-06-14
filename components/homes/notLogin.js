import Image from "next/legacy/image";
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
import { useState, useContext, useEffect } from "react";
import CustomImage from "../customImage";
import Cookies from "universal-cookie";
import Right from "./right";

function LeftAll({ onOpen, setButtonAttr }) {
  const [innerWidth, setInnerWidth] = useState(0);
  useEffect(() => {
    if (window !== "undefined") {
      addEventListener(
        "resize",
        () => setInnerWidth(window.innerWidth),
      );
      return () =>
        window.removeEventListener(
          "resize",
          () => setInnerWidth(window.innerWidth),
        );
    }
  }, []);

  
  return (
    <>
      <Box position={{ base: "absolute", lg: "relative" }} w="100%">
        <LeftText position={"absolute"}setButtonAttr={setButtonAttr} onOpen={onOpen} innerWidth={innerWidth}/>
      </Box>
      <LeftDownImage innerWidth={innerWidth}/>
    </>
  );
}

function LeftDownImage() {
  return (
    <Box
      position={"absolute"}
      bottom="0"
      w={{ md: 200, xl: 300, "2xl": 350 }}
      h={{ md: 200, xl: 300, "2xl": 350 }}
    >
      <Image
        priority={true}
        src={"/images/home/Asset3.png"}
        layout="fill"
        objectFit="content"
        alt={"asset"}
      />
    </Box>
  );
}

function LeftBackground() {
  return (
    <Box
      position={"absolute"}
      w={{ base: innerWidth, md: 600, xl: 800, "2xl": 900 }}
      h={{ base: 500, md: 600, xl: 800, "2xl": 900 }}
    >
      <Image
        priority={true}
        src={"/images/home/BG_Deco.png"}
        layout="fill"
        objectFit="content"
        alt={"asset"}
      />
    </Box>
  );
}
export function LeftText({setButtonAttr, onOpen}) {
  return (
    <Box
      position={"relative"}
      width={{ baee: innerWidth, xl: 800, "2xl": 900 }}
      h={{ base: 400, md: 600, xl: 800, "2xl": 900 }}
    >
      <Flex
        height={"100%"}
        w={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <LeftBackground />
        <Heading
          fontSize={{ base: "4rem", xl: "6rem", "2xl": "7rem" }}
          color={"#1166EE"}
        >
          Tally Book
        </Heading>
        <Text
          color={"gray"}
          fontSize={"2rem"}
          width={{ base: "90%", lg: "50%" }}
        >
          lorem hjkhkjdh hfjkshfjsk fhkjshadfjk shf hdsjklf hjksl fhj
        </Text>
        <Buttons position={"absolute"} onOpen={onOpen} setButtonAttr={setButtonAttr} />
      </Flex>
    </Box>
  );
}
function Buttons({onOpen,setButtonAttr}) {
  const [user, setUser] = useState("");
  const cookies = new Cookies();
  useEffect(() => {
    setUser(cookies.get("user"));
  },[]);
  return (
    <>
      {!user ? (
        <HStack spacing="24px" mt={"1.5rem"} zIndex={100}>
          <Button
            onClick={() => {
              onOpen(), setButtonAttr("signup");
            }}
            background={"#1166EE"}
            color={"white"}
            fontSize={{
              base: "1.2rem",
              md: "2rem",
            }}
            width={{ base: "5rem", md: "8rem"}}
            height={{
              base: "2.5rem",
              md: "4rem",
            }}
          >
            SignUp
          </Button>
          <Button
            onClick={() => {
              onOpen(), setButtonAttr("login");
            }}
            variant='outline'
            colorScheme='#1166EE'
            color={"#1166EE"}
            border='2px'
            bg={'#f3f3f3'}
            _hover={{color:'gray',colorScheme:'gray' }}
            transition={'.3s'}
            fontSize={{
              base: "1.2rem",
              md: "2rem",
              xl: "2rem",
            }}
            width={{ base: "5rem", md: "8rem" }}
            height={{
              base: "2.5rem",
              md: "4rem",
            }}
          >
            Login
          </Button>
        </HStack>
      ) : (
        <></>
      )}
    </>
  );
}



export default function NotLogin({ onOpen, setButtonAttr }) {
  const context = useContext(AppContext);
  return (
    <>
      <Flex
        width={"100vw"}
        height={{base:'100vh', }}
        position={"absolute"}
        top={0}
      >
        <LeftAll onOpen={onOpen} setButtonAttr={setButtonAttr}/>
        <Right/>
      </Flex>
    </>
  );
}

