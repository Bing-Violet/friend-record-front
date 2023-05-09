import { useState, useEffect, useContext } from "react";
import {
  Flex,
  Form,
  Center,
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
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import AppContext from "./globalContext";
import { useRouter } from "next/router";
import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";

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
    setEmailErrorObj({ ...emailErrorObj, isError: !val ? true : false, isEmpty: !val ? true : false});
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
            <FormErrorMessage>
              {!emailErrorObj.isEmpty ? (
                <>Email is not valid</>
              ) : (
                <>Email is required</>
              )}
            </FormErrorMessage>
          </>
        )}
      </FormControl>
    </>
  );
}
function Password({
  password,
  setValue,
  passwordErrorObj,
  setPasswordErrorObj,
}) {
  const [shwoPassword, setShowpassword] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState(
    "Password must be longer than 10 cha, and include upper-case, lower-case, one or more numerical digits and special characters, such as @, #, $"
  );
  const handleChange = (event) => {
    setValue(event.target.value),
      setFormErrorMessage(
        onChangeHelperText(event.target.value),
        setPasswordErrorObj({
          ...passwordErrorObj,
          isEmpty: !event.target.value ? true : false,
          isError: !event.target.value ? true : false,
        })
      );
  };
  function onChangeHelperText(val) {
    if (val.length < 10) {
      return "Password must be longer than 10 cha.";
    } else {
      return "Longer than 10 cha.";
    }
  }
  function errorMessageHandler() {
    if (passwordErrorObj.isEmpty) {
      return "Password is required!";
    } else if (passwordErrorObj.isLong) {
      return "Password must be longer than 10 cha.";
    } else if (passwordErrorObj.hasUpper) {
      return "Password must include upper-case!";
    } else if (passwordErrorObj.hasLower) {
      return "Password must include lower-case!";
    } else if (passwordErrorObj.hasNum) {
      return "Password must include at least one number!";
    } else if (passwordErrorObj.hasSpecialCha) {
      return "Password must include at least one special characters, like !,%,&,@,#,$,^,*,?,_,~";
    }
  }
  return (
    <>
      <FormControl isInvalid={passwordErrorObj.isError}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            onChange={handleChange}
            type={!shwoPassword ? "text" : "password"}
            placeholder="enter password"
            size="md"
          />
          <InputRightElement>
            {shwoPassword ? (
              <>
                <IconButton
                  onClick={() => setShowpassword(!shwoPassword)}
                  background={"none"}
                  size="sm"
                  color={"gray.500"}
                  icon={<ImEye />}
                />
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => setShowpassword(!shwoPassword)}
                  background={"none"}
                  size="sm"
                  color={"gray.500"}
                  icon={<ImEyeBlocked />}
                />
              </>
            )}
          </InputRightElement>
        </InputGroup>
        {!passwordErrorObj.isError ? (
          <>
            <FormHelperText>{formErrorMessage}</FormHelperText>
          </>
        ) : (
          <>
            <FormErrorMessage>{errorMessageHandler()}</FormErrorMessage>
          </>
        )}
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
  const [shwoPassword, setShowpassword] = useState(true);
  const handleChange = (event) => {
    setValue(event.target.value), setError(event.target.value ? false : true);
  };
  return (
    <>
      <FormControl isInvalid={error}>
        <FormLabel>Confirmation-Password</FormLabel>
        <InputGroup>
          <Input
            value={confirmationPassword}
            onChange={handleChange}
            type={!shwoPassword ? "text" : "password"}
            placeholder="enter password again"
            size="md"
          />
          <InputRightElement>
            {shwoPassword ? (
              <>
                <IconButton
                  onClick={() => setShowpassword(!shwoPassword)}
                  background={"none"}
                  size="sm"
                  color={"gray.500"}
                  icon={<ImEye />}
                />
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => setShowpassword(!shwoPassword)}
                  background={"none"}
                  size="sm"
                  color={"gray.500"}
                  icon={<ImEyeBlocked />}
                />
              </>
            )}
          </InputRightElement>
        </InputGroup>
        {!error ? (
          <>
            <FormHelperText>
              Confirmation-Password must be the same as the password.
            </FormHelperText>
          </>
        ) : (
          <>
            <FormErrorMessage>
              Confirmation-Password must be the same as the password.
            </FormErrorMessage>
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
  const [emailErrorObj, setEmailErrorObj] = useState({
    isError: false,
    isEmpty: false,
    isValid: false,
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
        const data = jwt(res.data.tokens.access_token);
        cookies.set("jwt-tokens", {
          access_token: res.data.tokens.access_token,
          refresh_token: res.data.tokens.refresh_token,
        });
        cookies.set("user", data.user_id);
        context.setUser(data.user_id);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmationPassword("");
      })
      .catch((e) => {
        console.log("error", e);
      });
    console.log("created");
  }
  // function abstractSetError(sub, state) {
  //   setErrors({ ...errors, [sub]: state ? true : false });
  // }
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
    function passwordFormCheck() {
      //password should be longer than 10 char include small, capital letter, num and special characters, such as @, #, $.
      setPasswordErrorObj({
        // here is for all reset but not working so each if need to make other attr false
        ...passwordErrorObj,
        isError: false,
        isEmpty: false,
        isLong: false,
        hasLower: false,
        hasUpper: false,
        hasNum: false,
        hasSpecialCha: false,
      });
      if (!password) {
        setPasswordErrorObj({
          ...passwordErrorObj,
          isEmpty: true,
          isError: true,
        });
        return false;
      } else if (password.length < 10) {
        setPasswordErrorObj({
          ...passwordErrorObj,
          isEmpty: false,
          isLong: true,
          isError: true,
        });
        return false;
      } else if (!/[A-Z]/.test(password)) {
        setPasswordErrorObj({
          ...passwordErrorObj,
          hasUpper: true,
          isEmpty: false,
          isLong: false,
          isError: true,
        });
        return false;
      } else if (!/[a-z]/.test(password)) {
        setPasswordErrorObj({
          ...passwordErrorObj,
          hasUpper: false,
          hasLower: true,
          isEmpty: false,
          isLong: false,
          isError: true,
        });
        return false;
      } else if (!/[0-9]/.test(password)) {
        setPasswordErrorObj({
          ...passwordErrorObj,
          hasNum: true,
          hasUpper: false,
          hasLower: false,
          isEmpty: false,
          isLong: false,
          isError: true,
        });
        return false;
      } else if (!/[!,%,&,@,#,$,^,*,?,_,~]/.test(password)) {
        setPasswordErrorObj({
          ...passwordErrorObj,
          hasSpecialCha: true,
          hasNum: false,
          hasUpper: false,
          hasLower: false,
          isEmpty: false,
          isLong: false,
          isError: true,
        });
      } else {
        return true;
      }
    }
    function confirmatinPasswordFormCheck() {
      if (password !== confirmationPassword || !confirmationPassword) {
        setConfirmationPasswordError(true);
        return false;
      } else {
        setConfirmationPasswordError(false);
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
        passwordFormCheck() &
        confirmatinPasswordFormCheck() &
        usernameFormCheck()
      ) {
        userCreate();
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
          <Password
            password={password}
            setValue={setPassword}
            passwordErrorObj={passwordErrorObj}
            setPasswordErrorObj={setPasswordErrorObj}
          />
          <ConfirmationPassword
            confirmationPassword={confirmationPassword}
            setValue={setConfirmationPassword}
            error={confirmationPasswordError}
            setError={setConfirmationPasswordError}
          /> 
        </VStack>

        <Center mt={5}>
          <SubmitButton />
        </Center>
      </FormControl>
    </Flex>
  );
}
