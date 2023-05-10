import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import AppContext from "./globalContext";
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
    const [mounted, setMounted] = useState(false)
    const context = useContext(AppContext);
    useEffect(() => {
        setMounted(true)
    },[])
    return(
        <>
        {mounted&&context ? (
            <Flex w={"100%"} h={"100px"}  t={"0"} zIndex={'100'} justifyContent={"center"}>
            <HStack spacing='24px'>

            <Link href={"/"} scroll={false}>HOME</Link>
            {context.user ? (
                <Link href={"/account"} scroll={false}>ACCOUNT</Link>
            ):(
                <></>
            )}
            </HStack>
        </Flex>
        ):(
            <></>
        )}
        
        </>
    )
}