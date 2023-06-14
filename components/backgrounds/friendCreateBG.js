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
import FriendCreate from "../friendCreate";
function LeftBackground() {
  return (
    // <Box
    //   position={"absolute"}
    //   w={{ base: innerWidth, md: 600, xl: 500, "2xl": 900 }}
    //   h={{ base: 500, md: 600, xl: 500, "2xl": 900 }}
    // >
    <Box
      position={"absolute"}
      w={{ base: innerWidth }}
      h={{ base: innerWidth * 0.6 }}
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

export default function FriendCreateBG({ toastFun, User }) {
  const [innerWidth, setInnerWidth] = useState(0);
  useEffect(() => {
    if (window !== "undefined") {
      addEventListener("resize", () => setInnerWidth(window.innerWidth));
      return () =>
        removeEventListener("resize", () =>
          setInnerWidth(window.innerWidth)
        );
    }
  }, []);
  return (
    <>
      <Box
        position={"relative"}
        width={{ baee: innerWidth, xl: 500, "2xl": 900 }}
        h={{ base: 400, md: 600, xl: 500, "2xl": 900 }}
        top={"7rem"}
      >
        {/* <Box
        position={"relative"}
        width={{ baee: innerWidth, xl: 500, "2xl": 900 }}
        h={{ base: 400, md: 600, xl: 500, "2xl": 900 }}
        top={'7rem'}
      ></Box> */}
        <Flex
          height={"100%"}
          w={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          <LeftBackground innerWidth={innerWidth} />
          <Heading
            fontSize={{ base: "4rem", xl: "5rem", "2xl": "7rem" }}
            color={"#1166EE"}
          >
            Create Friend
          </Heading>
          <Text
            color={"gray"}
            fontSize={"2rem"}
            width={{ base: "90%", lg: "50%" }}
          >
            mamange your relationship
          </Text>
          <Box position={"absolute"} bottom={"7rem"}>
            <FriendCreate User={User} toastFun={toastFun} />
          </Box>
          {/* <Button
            background={"#1166EE"}
            color={"white"}
            position={"absolute"}
            bottom={"0"}
          >
            CREATE
          </Button> */}
        </Flex>
      </Box>
    </>
  );
}
