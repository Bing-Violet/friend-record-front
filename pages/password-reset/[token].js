import { useState, useEffect, useRef, forwardRef, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AppContext from "@/components/globalContext";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import CustomConfPassWithPass, {
  passwordFormCheck,
  confirmatinPasswordFormCheck,
} from "@/components/customForms/signup/customConfPassWithPass";
import {
  Flex,
  Form,
  Center,
  Text,
  Input,
  InputGroup,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  VStack,
  Box
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
import {IoHomeOutline} from "react-icons/io5";
export default function PasswordReset({ user }) {
  const router = useRouter();
  const context = useContext(AppContext);
  const [mounted, setMounted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [confirmationPasswordError, setConfirmationPasswordError] =
    useState(false);
  const [passwordErrorObj, setPasswordErrorObj] = useState({
    isError: false,
    isEmpty: false,
    isLong: false,
    hasLower: false,
    hasUpper: false,
    hasNum: false,
    hasSpecialCha: false,
  });
  useEffect(() => {
    console.log("to", router.query.token, router.isReady);
    if (router.isReady) {
      if (!router.query.token) {
        router.push({
          pathname: "/",
        });
      } else {
      }
    } else {
      console.log("NO_TOKEN");
    }
  }, [router.isReady]);
  function passwordChange() {
    context.setIsLoading(true)
    axios({
      method: "post",
      url: "/api/user/password-change/",
      data: {
        token: router.query.token,
        password: password,
      },
    })
      .then(async (res) => {
        const cookies = new Cookies();
        cookies.remove("user");
        cookies.remove("access_token");
        cookies.remove("refresh_token");
        cookies.set("access_token", res.data.tokens.access_token, {
          path: "/",
        });
        cookies.set("refresh_token", res.data.tokens.refresh_token, {
          path: "/",
        });
        cookies.set("user", res.data.user, { path: "/" });

        await context.setUser(res.data.user);
        router.push({
          pathname: "/account",
          query: { code: "password-change" },
        });
        context.setIsLoading(false)
      })
      .catch((e) => {
        setIsError(true)
        console.log("error", e.response.data.message);
        // need to check token is not exist or new token is there
        // router.push({
        //   pathname: "/",
        // });
      });
  }
  function SubmitButton() {
    function formCheck() {
      if (
        passwordFormCheck(password, passwordErrorObj, setPasswordErrorObj) &
        confirmatinPasswordFormCheck(
          password,
          confirmationPassword,
          setConfirmationPasswordError
        )
      ) {
        console.log("OK");
        passwordChange();
      }
    }
    return (
      <Button
        colorScheme="teal"
        variant="solid"
        type="submit"
        onClick={formCheck}
      >
        SUBMIT
      </Button>
    );
  }
  function ErrorModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(() => {
      onOpen()
    },[])
    return (
      <>
        <Modal onClose={onClose} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent bg={'red.300'}>
            <ModalHeader color={'red.900'}>Error Occurred</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              The link you clicked might be old. Please check the latest one or resend email.
            </ModalBody>
            <ModalFooter>
              <Button leftIcon={<IoHomeOutline/>} bg={"#cdf9ff"} border={'solid #c22a2a'} color={'#c22a2a'} onClick={() => router.push({
          pathname: "/",
        })}>Home</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  return (
    <Box w={'100%'} mt={'1rem'}>
      {isError&&(<><ErrorModal/></>)}
      <Center>
      <Flex w={'600px'}  flexDirection={'column'} alignItems={'center'}>
        <Text color={"red"} fontSize={"1.6rem"}>
          Reset your password!
        </Text>
      <FormControl isRequired w={'90%'}>
        <VStack spacing={"1rem"} >
          <CustomConfPassWithPass
            confirmationPassword={confirmationPassword}
            setConf={setConfirmationPassword}
            conferror={confirmationPasswordError}
            setConfconfError={setConfirmationPasswordError}
            password={password}
            setPassword={setPassword}
            passwordErrorObj={passwordErrorObj}
            setPasswordErrorObj={setPasswordErrorObj}
          />
        </VStack>
        <Center mt={5}>
          <SubmitButton />
        </Center>
      </FormControl>
    </Flex>
      </Center>
    </Box>
  );
}
