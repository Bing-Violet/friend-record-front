import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import Image from "next/legacy/image";
import AppContext from "./globalContext";
import Logo from "./headers/logo";
import Cookies from "universal-cookie";
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
  const [user, setUser] = useState('');
  const cookies = new Cookies()
  const context = useContext(AppContext);
  useEffect(() => {
    setUser(context.user)
    setMounted(true);
  }, []);
  let markup = ''
  if(user||cookies.get('user')&&mounted) {
    markup = (
      <>
      <Box display={{base:'none',md:'block'}} w={"100%"} mt={"2rem"} left={"0"} position={"absolute"} zIndex={2}>
        <Flex w={'800px'} justifyContent={'center'}>
            <Box  mr={"2rem"}>
            <Logo/>
            </Box>
          <HStack
            spacing="20px"
            color={"#1166EE"}
            fontFamily={"Gill Sans"}
            fontWeight="bold"
            fontSize={"1.5rem"}
          >
            <Link href={"/"} scroll={false}>
              Home
            </Link>
              <Link href={"/account"} scroll={false}>
                My account
              </Link>
          </HStack>
        </Flex>
      </Box>
      </>
    )
  } else [
    <></>
  ]
  return (
    <>
      {markup}
    </>
  );
}
