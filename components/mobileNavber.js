import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import AppContext from "./globalContext";
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
import { BsBoxArrowLeft } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { RiAccountPinCircleLine } from "react-icons/ri";

export default function MobileNavber() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState("");
  const cookies = new Cookies();
  const context = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    setUser(context.user);
    setMounted(true);
  }, []);
  let markup = "";
  if (user || (cookies.get("user") && mounted)) {
    markup = (
      <>
        <Box
          display={{ md: "none" }}
          w={"100%"}
          bottom={"0"}
          position={"absolute"}
          bg={"rgb(149 149 149 / 90%)"}
          zIndex={2}
          border={"0.2rem solid #d1f5fd"}
          borderRadius={"10px"}
        >
          <Flex
            justifyContent={"center"}
            // color={"#1166EE"}
            fontFamily={"Gill Sans"}
            // fontWeight="bold"
            // fontSize={"1.5rem"}
          >
            <Flex
              onClick={() => router.push("/")}
              flexBasis={"50%"}
              flexDirection={"column"}
              alignItems={"center"}
              transition={".3s"}
              _hover={{
                background: "rgb(240 240 240 / 70%)",
                color: "gray",
              }}
            >
              <AiOutlineHome fontSize={"1.5rem"} />
              <Text fontSize={"0.5rem"}>HOME</Text>
            </Flex>
            <Flex
              onClick={() => router.push("/account")}
              flexBasis={"50%"}
              flexDirection={"column"}
              alignItems={"center"}
              transition={".3s"}
              _hover={{
                background: "rgb(240 240 240 / 70%)",
                color: "gray",
              }}
            >
              <RiAccountPinCircleLine fontSize={"1.5rem"} />
              <Text fontSize={"0.5rem"}>ACCOUNT</Text>
            </Flex>
          </Flex>
        </Box>
      </>
    );
  } else [<></>];
  return <>{markup}</>;
}
