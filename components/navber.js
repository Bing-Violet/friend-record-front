import Link from "next/link";
import { useState, useEffect, createContext } from "react";
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
} from "@chakra-ui/react";
export default function Navber() {
    return(
        <>
        <Flex w={"100%"} h={"100px"}  t={"0"} zIndex={'100'} justifyContent={"center"}>
            <HStack spacing='24px'>

            <Link href={"/"} scroll={false}>HOME</Link>
            <Link href={"account/"} scroll={false}>ACCOUNT</Link>
            </HStack>
        </Flex>
        
        </>
    )
}