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
import AppContext from "@/components/globalContext";
import { useState, useEffect, useContext, useRef } from "react";
import {
  Button,
  ButtonGroup,
  Wrap,
  WrapItem,
  Center,
  VStack,
  Flex,
  Spinner,
  useToast
} from "@chakra-ui/react";



export default function Home({user}) {
  const context = useContext(AppContext);
  const [mounted, setMounted] = useState('');
  const toast = useToast()
  const toastIdRef = useRef()
  function addToast({...toastData}) {
    console.log(toastData)
    toastIdRef.current = toast({
    title: toastData.title,
    description: toastData.description,
    status: toastData.status,
    duration: 5000,
    isClosable: true, })
}
  useEffect(() => {
    if (user) {
      axios({
        method: "post",
        url: "/api/character/user-character/",
        data:{
          user:user
        }
      })
        .then((res) => {
          context.setFriends(res.data);
        })
        .catch((e) => {});
    }
    setMounted(true)
  }, []);

  function SignupOrLogin() {
    const [signup, setSignup] = useState(true);
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
      <FriendCreate User={user} toastFun={addToast}/>
      <FriendList User={user} toastFun={addToast}/>
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
