import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import AppContext from "./globalContext";
import Logo from "./headers/logo";
import {
  Button,
  ButtonGroup,
  Wrap,
  WrapItem,
  Center,
  VStack,
  HStack,
  Flex,
  Text,
  Avatar,
  Box,
} from "@chakra-ui/react";
export default function Navber() {
  const [mounted, setMounted] = useState(false);
  const [markup, setMarkup] = useState("");
  const context = useContext(AppContext);
  useEffect(() => {
    setMounted(true);
    setMarkup(
      <Flex color={"#1166EE"} fontFamily={"Gill Sans"}>
        {/* <HStack spacing="10px"> */}
        <Link href={"/"} scroll={false}>
          HOME
        </Link>
        {context.user ? (
          <Link href={"/account"} scroll={false}>
            ACCOUNT
          </Link>
        ) : (
          <></>
        )}
        {/* </HStack> */}
      </Flex>
    );
  }, []);
  return (
    <>
      <Flex mt={"2rem"} justifyContent={'center'} position={'absolute'}>
        <Logo  mr={"1rem"}/>
        <Box>{markup}</Box>
      </Flex>
    </>
  );
}
