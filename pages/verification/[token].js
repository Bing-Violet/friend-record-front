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
        axios({
          method: "post",
          url: "/api/user/email-verify/",
          data: { token: router.query.token },
        })
          .then(async (res) => {
            console.log('then')
            const cookies = new Cookies();
            cookies.remove("user");
            cookies.remove("jwt-tokens");
            console.log("then", res.data.user);
            const data = jwt(res.data.tokens.access_token);
            cookies.set("jwt-tokens", {
              access_token: res.data.tokens.access_token,
              refresh_token: res.data.tokens.refresh_token
              
            }, { path: '/' });
            cookies.set("user", res.data.user,{ path: '/' });
            await context.setUser(res.data.user);
            router.push({
              pathname: "/account",
              query: { code: "login" },
            });
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
  return (
    <>
      VALIDATION
      {router.query.token}
    </>
  );
}
