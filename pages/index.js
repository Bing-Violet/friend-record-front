
import Signup from "../components/signup";
import Login from "../components/login";
import FriendList from "../components/friendList";
import FriendCreate from "../components/friendCreate";
import axios from "axios";
import AppContext from "@/components/globalContext";
import CustomSpinner from "@/components/spinner";
import { useState, useEffect, useContext, useRef } from "react";
import NotLogin from "@/components/homes/notLogin";
import FriendCreateBG from "@/components/backgrounds/friendCreateBG";
import Cookies from "universal-cookie";
import {
  Button,
  ButtonGroup,
  Center,
  VStack,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

export default function Home() {
  console.log("FROM_HOME")
  const context = useContext(AppContext);
  const [mounted, setMounted] = useState("");
  const addToast = context.addToast
  const [user, setUser] = useState(context.user)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [buttonAttr, setButtonAttr] = useState("");
  const cookies = new Cookies()
  useEffect(() => {
    console.log("FROM_INDEX")
    setMounted(true);
  }, []);
  function InitialFocus({children}) {
  
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const mainText = buttonAttr==='signup'?'Create your account':'Login your account'
    const markup = buttonAttr==='signup'?(<Signup />):(<Login />)
    return (
      <>
        {/* <Button onClick={onOpen}>Open Modal</Button>
        <Button ml={4} ref={finalRef}>
          I'll receive focus on close
        </Button> */}
  
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{mainText}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Center>
              {markup}
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }
  function SignupOrLogin() {
    const [signup, setSignup] = useState(true);
    return (
      <>
      <NotLogin width={"100vw"} height={'100vh'} onOpen={onOpen} setButtonAttr={setButtonAttr}/>
       <InitialFocus/>
      </>
    );
  }
  function IsLoggedin() {
    return (
      <VStack w={"100%"}>
        {/* <FriendCreateBG User={user} toastFun={addToast}/> */}
        <FriendList User={user} toastFun={addToast} />
      </VStack>
    );
  }
  let markup
  if(mounted) {
    markup = (
      <Flex justifyContent={"center"}>
          <>
            {user ? (
              <>
                <IsLoggedin />
              </>
            ) : (
              <>
                <SignupOrLogin />
              </>
            )}
          </>
      </Flex>
    )
  }
  return (
    <>
    {markup}
    </>
  );
}
