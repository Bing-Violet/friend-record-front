import { useState, useEffect, useContext } from "react";
import {
  Flex,
  Form,
  Center,
  Input,
  Text,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  VStack,
  Spinner
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import AppContext from "./globalContext";
import CustomSpinner from "./spinner";
import { useRouter } from "next/router";

function Email({ email, setValue, error, setError }) {
  const subject = "email";
  const handleChange = (event) => {
    setValue(event.target.value), setError(subject, event.target.value);
  };
  return (
    <>
      <FormControl isInvalid={!error}>
        <FormLabel>E-mail</FormLabel>
        <Input
          value={email}
          onChange={handleChange}
          placeholder="enter valid email"
          size="sm"
        />
        <FormErrorMessage>Email is required</FormErrorMessage>
      </FormControl>
    </>
  );
}
function Password({ password, setValue, error, setError }) {
  const subject = "password";
  const handleChange = (event) => {
    setValue(event.target.value), setError(subject, event.target.value);
  };

  return (
    <>
      <FormControl isInvalid={!error}>
        <FormLabel>Password</FormLabel>
        <Input
          value={password}
          onChange={handleChange}
          placeholder="enter password"
          size="sm"
        />
        <FormErrorMessage>pasword is required</FormErrorMessage>
      </FormControl>
    </>
  );
}

export default function Login() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [sentResetPassword, setSentResetPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userExist, setUserExist] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({
    email: true,
    password: true,
  });
  const [apiError, setApiError] = useState(false);
  const sendingProcessStates = {
    NOT_READY: "NOT_READY",
    SENDIND: "SENDIND",
    SENT: "SENT",
  };
  useEffect(() => {
    setSentResetPassword(sendingProcessStates.NOT_READY);
  }, []);
  function login() {
    axios({
      method: "post",
      url: "/api/user/user-login/",
      data: {
        email: email,
        password: password,
      },
    })
      .then(async (res) => {
        const data = jwt(res.data.tokens.access_token);
        const cookies = new Cookies();
        cookies.set("access_token", res.data.tokens.access_token);
        cookies.set("refresh_token", res.data.tokens.refresh_token);
        cookies.set("user", res.data.user);
        setEmail("");
        setPassword("");
        await context.setUser(res.data.user);
        await context.getFriendsList(data.user_id);
        router.push({
          pathname: "/account",
          query: { code: "login" },
        });
        // context.setIsLoading(false)
      })
      .catch((e) => {
        console.log("error", e);
        try {
          if (e.response.data.user_exist) {
            console.log("USER>EX");
            setErrorMessage(
              "Password is wrong!. Please confirm your password!"
            );
            setUserExist(true);
          } else {
            setErrorMessage("User doesn't exist. Please confirm your eamil!");
            setUserExist(false);
          }
        } catch {
          setErrorMessage("Something bad happened. Please try later!");
          setUserExist(false);
        }
        setApiError(true);
      });
  }
  function sendResetPassword() {
    setSentResetPassword(sendingProcessStates.SENDIND);
    axios({
      method: "post",
      url: "/api/user/send-password-change/",
      data: { email: email },
    })
      .then((res) => {
        console.log("res", res.data);
        setSentResetPassword(sendingProcessStates.SENT);
        setApiError(false);
      })
      .catch((e) => {
        // assumption is that user is registered with valid email address.
        // so error means sent reset email multiple times.
        // previous request not allowed to reset.
        console.log("error", e);
        setSentResetPassword(false);
        setApiError(true);
        setUserExist(false);
        setErrorMessage("Something bad happened. Please try later!");
      });
  }
  function abstractSetError(sub, state) {
    setErrors({ ...errors, [sub]: state ? true : false });
  }
  function formCheck() {
    setErrors({
      email: email ? true : false,
      password: password ? true : false,
    });
    if (email && password) {
      login();
    } else {
      console.log("NO");
    }
  }
  function ApiAlert() {
    return (
      <>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <AlertIcon />
          <AlertTitle>Error occurred</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          {userExist ? (
            <>
              <AlertTitle fontSize="1.5rem" color={"red"} mt="1rem">
                forgot password?
              </AlertTitle>
              <Button
                onClick={sendResetPassword}
                mt="1rem"
                border={"solid red"}
                background={"red.400"}
              >
                Send Reset password email?
              </Button>
            </>
          ) : (
            <></>
          )}
        </Alert>
      </>
    );
  }
  let markup;
  if (
    sentResetPassword !== sendingProcessStates.SENDIND &&
    sentResetPassword !== sendingProcessStates.SENT
  ) {
    markup = (
      <>
        <VStack w={"90%"}>
          <Email
            email={email}
            setValue={setEmail}
            error={errors.email}
            setError={abstractSetError}
          />
          <Password
            password={password}
            setValue={setPassword}
            error={errors.password}
            setError={abstractSetError}
          />
          <Button colorScheme="red" variant="outline" onClick={formCheck}>
            Login
          </Button>
          {!apiError ? <></> : <ApiAlert />}
        </VStack>
      </>
    );
  } else if(sentResetPassword === sendingProcessStates.SENDIND) {
    markup = (<><Spinner size='lg' /></>)
  } else if(sentResetPassword === sendingProcessStates.SENT) {
    markup = (<><Text fontSize={'1.2rem'} fontWeight={'bold'}>Sent email to your address.</Text></>)
  }

  return (
    <>{markup}</>
  );
}
