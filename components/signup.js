import { useState, useEffect, useContext } from "react";
import {
  Flex,
  Form,
  Center,
  Input,
  InputGroup,
  Button,
  IconButton,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  VStack,
  Spinner
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import AppContext from "./globalContext";
import { useRouter } from "next/router";
import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";
import CustomSpinner from "./spinner";
import CustomConfPassWithPass, { passwordFormCheck, confirmatinPasswordFormCheck } from "./customForms/signup/customConfPassWithPass";

function Username({ username, setValue, error, setError }) {
  const handleChange = (event) => {
    setValue(event.target.value), setError(event.target.value ? false : true);
  };
  return (
    <>
      <FormControl isInvalid={error}>
        <FormLabel>Username</FormLabel>
        <Input
          value={username}
          onChange={handleChange}
          placeholder="enter username"
          size="md"
        />
        <FormErrorMessage>username is required</FormErrorMessage>
      </FormControl>
    </>
  );
}
function Email({ email, setValue, emailErrorObj, setEmailErrorObj }) {
  const handleChange = (event) => {
    setValue(event.target.value), emailCheck(event.target.value);
  };
  function emailCheck(val) {
    setEmailErrorObj({
      ...emailErrorObj,
      isError: !val ? true : false,
      isEmpty: !val ? true : false,
    });
  }
  function errorMessage() {
    if (emailErrorObj.isEmpty) {
      return "Email is required!";
    } else if (emailErrorObj.inUse) {
      return "this email address is already in use!";
    } else {
      return "Email is not valid";
    }
  }
  return (
    <>
      <FormControl isInvalid={emailErrorObj.isError}>
        <FormLabel>E-mail</FormLabel>
        <Input
          value={email}
          onChange={handleChange}
          placeholder="enter valid email"
          size="md"
        />
        {!emailErrorObj.isError ? (
          <>
            <FormHelperText>Email must be valid address.</FormHelperText>
          </>
        ) : (
          <>
            <FormErrorMessage>{errorMessage()}</FormErrorMessage>
          </>
        )}
      </FormControl>
    </>
  );
}


export default function Signup({ setUser }) {
  const context = useContext(AppContext);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [sentConfirmation, setSentConfirmation] = useState("");
  const sendingProcessStates = {
    NOT_READY: "NOT_READY",
    SENDIND: "SENDIND",
    SENT: "SENT",
  };
  useEffect(() => {
    setSentConfirmation(sendingProcessStates.NOT_READY);
  }, []);
  const [emailErrorObj, setEmailErrorObj] = useState({
    isError: false,
    isEmpty: false,
    isValid: false,
    inUse: false,
  });
  const [passwordErrorObj, setPasswordErrorObj] = useState({
    isError: false,
    isEmpty: false,
    isLong: false,
    hasLower: false,
    hasUpper: false,
    hasNum: false,
    hasSpecialCha: false,
  });
  const [usernameError, setUsernameError] = useState(false);
  const [confirmationPasswordError, setConfirmationPasswordError] =
    useState(false);
  const cookies = new Cookies();
  function userCreate() {
    setSentConfirmation(sendingProcessStates.SENDIND)
    axios({
      method: "post",
      url: "/api/user/user-create/",
      data: {
        username: username,
        email: email,
        password: password,
      },
    })
      .then((res) => {
        setIsloading(false);
        setSentConfirmation(sendingProcessStates.SENT)
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmationPassword("");
      })
      .catch((e) => {
        console.log("error",e)
        setSentConfirmation(sendingProcessStates.NOT_READY)
        if (e.response.data.message === "this email is already in use.") {
          setEmailErrorObj({
            ...passwordErrorObj,
            isError: true,
            inUse: true,
          });
        } else {
          context.addToast({
            title: "Failed creation!",
            description: `Something bad happened. Please try later!`,
            status: "error",
          });
        }
      });
  }
  function SubmitButton() {
    function emailFormCheck() {
      function checkValidEmail() {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return false;
        }
        return true;
      }
      setEmailErrorObj({
        ...emailErrorObj,
        isEmpty: false,
        isError: false,
        isValid: false,
        inUse: false,
      });
      if (!email) {
        setEmailErrorObj({ ...emailErrorObj, isEmpty: true, isError: true });
        return false;
      } else if (!checkValidEmail()) {
        setEmailErrorObj({ ...emailErrorObj, isValid: true, isError: true });
        return false;
      } else {
        return true;
      }
    }
    function usernameFormCheck() {
      if (!username) {
        setUsernameError(true);
        return false;
      } else {
        setUsernameError(false);
        return true;
      }
    }
    function formCheck() {
      if (
        emailFormCheck() &
        passwordFormCheck(password,passwordErrorObj,setPasswordErrorObj) &
        confirmatinPasswordFormCheck(password, confirmationPassword, setConfirmationPasswordError) &
        usernameFormCheck()
      ) {
        userCreate();
      }
    }
    return (
      <Button
        colorScheme="blue"
        variant='outline'
        type="submit"
        onClick={formCheck}
      >
        SUBMIT
      </Button>
    );
  }
  let markup;
  if (
    sentConfirmation !== sendingProcessStates.SENDIND &&
    sentConfirmation !== sendingProcessStates.SENT
  ) {
    markup = (
      <>
        <Flex w={"90%"}>
            <FormControl isRequired>
              <VStack spacing={"1rem"}>
                <Username
                  username={username}
                  setValue={setUsername}
                  error={usernameError}
                  setError={setUsernameError}
                />
                <Email
                  email={email}
                  setValue={setEmail}
                  emailErrorObj={emailErrorObj}
                  setEmailErrorObj={setEmailErrorObj}
                />
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
      </>
    );
  } else if(sentConfirmation === sendingProcessStates.SENDIND) {
    markup = (<><Spinner size='lg' /></>)
  } else if(sentConfirmation === sendingProcessStates.SENT) {
    markup = (<><Text fontSize={'1.2rem'} fontWeight={'bold'}>Sent email to your address.</Text></>)
  }
  return (
    <>
    {markup}
    </>
  );
}
