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
import { useRouter } from "next/router";
import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";

export default function CustomPassword({
    password,
    setPassword,
    passwordErrorObj,
    setPasswordErrorObj,
  }) {
    const [shwoPassword, setShowpassword] = useState(true);
    const [formErrorMessage, setFormErrorMessage] = useState(
      "Use 8 or more characters with a mix of letters, numbers & symbols"
    );
    const handleChange = (event) => {
        setPassword(event.target.value),
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
      if (val.length < 8) {
        return "Password must be longer than 10 cha.";
      } else {
        return "Longer than 8 cha.";
      }
    }
    function errorMessageHandler() {
      if (passwordErrorObj.isEmpty) {
        return "Password is required!";
      } else if (passwordErrorObj.isLong) {
        return "Password must be longer than 8 cha.";
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