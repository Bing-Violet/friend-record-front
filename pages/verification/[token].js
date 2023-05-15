import { useState, useEffect, useRef, forwardRef, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AppContext from "@/components/globalContext";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";

export default function FriendDetail({ user }) {
  const router = useRouter();
  const context = useContext(AppContext);
  const [mounted, setMounted] = useState(false);
  const [slug, setSlug] = useState("");
  useEffect(() => {
    console.log("to", router.query.token, router.isReady);
    if (router.isReady) {
      if (!router.query.token) {
        router.push({
          pathname: "/",
        });
      } else {
        context.setIsLoading(true)
        axios({
          method: "post",
          url: "/api/user/email-verify/",
          data: { token: router.query.token },
        })
          .then(async (res) => {
            console.log('then',res.data)
            const cookies = new Cookies();
            cookies.remove("user");
            cookies.remove("access_token");
            cookies.remove("refresh_token");
            cookies.set("access_token", res.data.tokens.access_token,{ path: '/' });
            cookies.set("refresh_token", res.data.tokens.refresh_token,{ path: '/' });
            cookies.set("user", res.data.user,{ path: '/' });
            await context.setUser(res.data.user);
            await context.setIsLoading(false)
            router.push({
              pathname: "/account",
              query: { code: "login" },
            });
            context.setIsLoading(false)
            //   context.setUser(data.user_id);
          })
          .catch((e) => {
            // need to check token is not exist or new token is there
            router.push({
                pathname: "/",
              });
          });
      }
    } else {
      console.log("NO_TOKEN");
    }
  }, [router.isReady]);
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
      console.log("FC", passwordFormCheck)
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
    <>
      VALIDATION
      {router.query.token}
    </>
  );
}
