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
import Cookies from "universal-cookie";

export default function PcBackground() {
    const [user, setUser] = useState("");
    const [mounted, setMounted] = useState(false);
    const cookies = new Cookies();
    useEffect(() => {
      setUser(cookies.get("user"));
      setMounted(true)
    }, []);
    let markup;
    if(user||cookies.get("user")&&mounted) {
        console.log("TRYE")
      markup = (
          <Box
        position={"fixed"}
        w={{ base: "100vw" }}
        h={{ base: "100vh" }}
        zIndex={0}
      >
        <Image
          priority={true}
          src={"/images/background.png"}
          layout="fill"
          objectFit="content"
          alt={"asset"}
        />
      </Box>
      )
    } else {
      markup = (<></>)
    }
  return (
    <>
    {markup}
    </>
  );
}
