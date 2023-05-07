import { useState, useEffect } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: true,
    password: true,
  });
  const [apiError, setApiError] = useState(false);
  function login() {
    axios({
      method: "post",
      url: "/api/user/user-login/",
      data: {
        email: email,
        password: password,
      },
    })
      .then((res) => {
        const data = jwt(res.data.tokens.access_token);
        const cookies = new Cookies();
        cookies.set("jwt-tokens", {
          access_token: res.data.tokens.access_token,
          refresh_token: res.data.tokens.refresh_token,
        });
        cookies.set("user", data.user_id);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmationPassword("");
      })
      .catch((e) => {
        setApiError(true)
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
      //   setFormErrors({email:checkEmail(), password:checkPassword()})
      //   if(checkEmail()&&checkPassword()) {
      //     console.log("gonna create")
      //     userCreate()
      //   } else {
      //     console.log("NO2", checkEmail(), checkPassword());
      //   }
    } else {
      console.log("NO");
    }
  }
  function ApiAlert() {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error occurred</AlertTitle>
        <AlertDescription>
          User doesn't exist. Please confirm your eamil and password.
        </AlertDescription>
      </Alert>
    );
  }
  return (
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
        {!apiError ? (
            <></>
        ):(<ApiAlert/>
        )}
      </VStack>
    </>
  );
}
