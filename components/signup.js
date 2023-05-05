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
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jwt-decode"
// API
// -> idle (no data to be shown, null)
// -> loading (the API request has been made, "loading")
// -> data (the API response has come back, { ... })
function Username({ username, setValue, error, setError }) {
  const subject = "username";
  // setError(subject, usernme)
  const handleChange = (event) => {
    setValue(event.target.value), setError(subject, event.target.value);
  };
  return (
    <>
      <FormControl isInvalid={!error}>
        <FormLabel>Username</FormLabel>
        <Input
          value={username}
          onChange={handleChange}
          placeholder="enter username"
          size="sm"
        />
        <FormErrorMessage>username is required</FormErrorMessage>
      </FormControl>
    </>
  );
}
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
function ConfirmationPassword({
  confirmationPassword,
  setValue,
  error,
  setError,
}) {
  const subject = "confirmationPassword";
  // const [password, setValue] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value), setError(subject, event.target.value);
  };

  return (
    <>
      <FormControl isInvalid={!error}>
        <FormLabel>Confirmation-Password</FormLabel>
        <Input
          value={confirmationPassword}
          onChange={handleChange}
          placeholder="enter password again"
          size="sm"
        />
        <FormErrorMessage>confirmationPassword is required</FormErrorMessage>
      </FormControl>
    </>
  );
}

export default function Signup({setUser}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errors, setErrors] = useState({
    username: true,
    email: true,
    password: true,
    confirmationPassword: true,
  });
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });
  const cookies = new Cookies
  function userCreate() {
    axios({
      method: "post",
      url: "/api/user/user-create/",
      data: {
        username:username,
        email:email,
        password:password
      },
    })
      .then((res) => {
        const data = jwt(res.data.tokens.access_token)
        cookies.set("jwt-tokens",{
          access_token:res.data.tokens.access_token,
          refresh_token:res.data.tokens.refresh_token
        })
        cookies.set('user',data.user_id )
        setUser(data.user_id)
        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmationPassword('')
      })
      .catch((e) => {
        console.log("error", e)
      });
    console.log('created')
  }
  function abstractSetError(sub, state) {
    setErrors({ ...errors, [sub]: state ? true : false });
  }
  function SubmitButton() {
    const [allSet, setValue] = useState(false);

    function checkEmail() {
     return true
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return false;
    }
      return true;
    }

    function checkPassword() {
      if (password === confirmationPassword) {
        return true;
      } else {
        return false;
      }
    }
    function formCheck() {
      setErrors({
        username: username ? true : false,
        email: email ? true : false,
        password: password ? true : false,
        confirmationPassword: confirmationPassword ? true : false,
      });
      if (username && email && password && confirmationPassword) {
        setFormErrors({email:checkEmail(), password:checkPassword()})
        if(checkEmail()&&checkPassword()) {
          console.log("gonna create")
          userCreate()
        } else {
          console.log("NO2", checkEmail(), checkPassword());
        }
      } else {
        console.log("NO", checkEmail(), checkPassword());
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
  return (
    <Flex w={"90%"}>
      <FormControl isRequired>
        <Username
          username={username}
          setValue={setUsername}
          error={errors.username}
          setError={abstractSetError}
        />
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
        <ConfirmationPassword
          confirmationPassword={confirmationPassword}
          setValue={setConfirmationPassword}
          error={errors.confirmationPassword}
          setError={abstractSetError}
        />
        <Center mt={5}>
          <SubmitButton />
        </Center>
      </FormControl>
    </Flex>
  );
}
