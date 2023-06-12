import CustomPassword from "./customPassword";
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
import AppContext from "@/components/globalContext";
import { useRouter } from "next/router";
import { ImEyeBlocked, ImEye } from "react-icons/im";
import CustomSpinner from "@/components/spinner";

export default function CustomConfPassWithPass({
  confirmationPassword,
  setConf,
  conferror,
  setConfconfError,
  password,
  setPassword,
  passwordErrorObj,
  setPasswordErrorObj,
}) {

  const [shwoPassword, setShowpassword] = useState(true);
  const handleChange = (event) => {
    setConf(event.target.value),
      setConfconfError(event.target.value ? false : true);
  };

  return (
    <>
      <CustomPassword
        password={password}
        setPassword={setPassword}
        passwordErrorObj={passwordErrorObj}
        setPasswordErrorObj={setPasswordErrorObj}
      />
      <FormControl isInvalid={conferror}>
        <FormLabel>Confirm your password</FormLabel>
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
        {!conferror ? (
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
export function confirmatinPasswordFormCheck(password, confirmationPassword, setConfirmationPasswordError) {
    if (password !== confirmationPassword || !confirmationPassword) {
      setConfirmationPasswordError(true);
      return false;
    } else {
      setConfirmationPasswordError(false);
      return true;
    }
  }
export function passwordFormCheck(password, passwordErrorObj,setPasswordErrorObj) {
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
      } else if (password.length < 8) {
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
