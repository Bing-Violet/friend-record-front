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
import Cookies from "universal-cookie";
import AppContext from "../globalContext";
import { useState, useEffect, useContext } from "react";

export default function Right() {
  function RightItemsImage() {
    return (
      <Box
        position={"absolute"}
        right={"1rem"}
        bottom={{ md: "14rem", xl: "20rem", "2xl": "30rem" }}
        w={{ md: 400, xl: 600, "2xl": 900 }}
        h={{ md: 240, xl: 360, "2xl": 540 }}
      >
        <Image
          priority={true}
          src={"/images/home/Asset10.png"}
          layout="fill"
          objectFit="content"
          alt={"asset"}
        />
      </Box>
    );
  }
  function RightBackground() {
    return (
      <Box
        position={"absolute"}
        right={"0"}
        bottom={"0"}
        w={{base:300, md: 400, xl: 600, "2xl": 1100 }}
        h={{base:300, md: 400, xl: 600, "2xl": 1100 }}
      >
        <Image
          priority={true}
          src={"/images/home/Asset12.png"}
          layout="fill"
          objectFit="content"
          alt={"asset"}
        />
      </Box>
    );
  }
  function PeopleImage() {
    return (
      <Box
        position={"absolute"}
        bottom={"0"}
        right={{ md: "7rem", xl: "10rem", "2xl": "20rem" }}
        w={{base:200, md: 300, xl: 450, "2xl": 750 }}
        h={{base:200, md: 300, xl: 450, "2xl": 750 }}
      >
        <Image
          priority={true}
          src={"/images/home/Asset2.png"}
          layout="fill"
          objectFit="content"
          alt={"asset"}
        />
      </Box>
    );
  }
  return (
    <>
      <Box width={"100%"} height={"100%"} position={"relative"}>
        <RightBackground />
        <PeopleImage />
        <RightItemsImage />
        {/* <LeftText position={"absolute"} /> */}
      </Box>
    </>
  );
}
