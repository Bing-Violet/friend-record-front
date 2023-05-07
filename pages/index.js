import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Signup from "../components/signup";
import Login from "../components/login";
import FriendList from "../components/friendList";
import FriendCreate from "../components/friendCreate";
import axios from "axios";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Wrap,
  WrapItem,
  Center,
  VStack,
  Flex,
  Spinner
} from "@chakra-ui/react";



export default function Home({user}) {
  const cookies = new Cookies();
  // const [user, setUser] = useState('');
  const [mounted, setMounted] = useState('');
  useEffect(() => {
    // setUser(cookies.get("user"))
    setMounted(true)
  },[])
  // axios({
  //   method: "get",
  //   url: "/api/user/user-list/",
  //   data: {},
  // })
  //   .then((res) => {
  //     console.log("RESPONSE", res);
  //   })
  //   .catch((e) => {});
  function SignupOrLogin() {
    const [signup, setSignup] = useState(true);
    // const [login, setLogin] = useState(false);
    return (
      <Flex w={"600px"} mt={"2rem"} flexDirection={"column"}>
        <Center>
        <ButtonGroup>
          <Button colorScheme="gray" onClick={() =>setSignup(true)}>Signup</Button>
          <Button colorScheme="gray" onClick={() => setSignup(false)}>Login</Button>
        </ButtonGroup>
        </Center>
        <Center>
        {signup ? <Signup  /> : <Login />}
        </Center>
      </Flex>
    );
  }
  function IsLoggedin() {
    return (
      <VStack>
      <FriendCreate User={user}/>
      <FriendList User={user}/>
      </VStack>
    )
  }
  return (
    <>
      <Flex justifyContent={"center"}>
        {mounted ? (
        <>
        {user ? (
          <>
          <IsLoggedin/>
          </>
        ) : (
          <>
          <SignupOrLogin />
          </>
        )}
        </>):(
        <Flex h={"100vh"} alignItems={'center'}>
        <Spinner size='xl'/>
        </Flex>
          )}
      </Flex>
    </>
  );
}
