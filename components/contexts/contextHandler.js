import AppContext from "../globalContext";
import { useState, useEffect, useRef, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import Cookies from "universal-cookie";
import axios from "axios";
import CustomSpinner from "../spinner";

export default function ContextHandler({ children }) {
  const [friends, setFriends] = useState("");
  const context = useContext(AppContext);
  const cookies = new Cookies();
  const [user, setUser] = useState(cookies.get("user"));
  useEffect(() => {
    console.log("UUEE")
    if (user) {
      getFriendsList(user.UID);
    }
  }, []);
  async function getFriendsList(userUid) {
    console.log("inGET", userUid);
    setIsLoading(true)
    if (userUid) {
      console.log("inGETUSER", user);
      axios({
        method: "post",
        url: "/api/character/user-character/",
        data: {
          user: userUid,
        },
      })
        .then((res) => {
          console.log("GOT FRIEND", res.data);
          setFriends([...res.data]);
          setIsLoading(false)
        })
        .catch((e) => {});
    }
  }

  async function getUser(userUid) {
    axios({
      method: "get",
      url: `/api/user/user-detail/${userUid}`,
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => {});
  }

  // *** TOKEN RELATED STUFF START(INCLUDE AXIUS) *** //
  async function getAccessTokenFromRefreshToken(error, func, args='') {
    console.log("GAT", error, func)
    // if (typeof error !== "undefined") {
    //   if (error.response.data.message === "Your token is expired") {
    //     console.log("EE", error);
    //     const refreshToken = cookies.get("refresh_token");
    //     if (refreshToken) {
    //       try {
    //         await axios({
    //           method: "post",
    //           url: "/api/token/refresh/",
    //           data: {
    //             refresh: refreshToken,
    //           },
    //         }).then((res) => {
    //           console.log("refresh", res.data, res.data.access_token);
    //           cookies.set("jwt-tokens", {
    //             access_token: res.data.access,
    //             refresh_token: res.data.refresh,
    //           });
    //           func(args)
    //         });
    //       } catch (e) {
    //         console.log(e)
    //         throw "no valid token";
    //       }
    //     } else {
    //       throw "no valid token";
    //     }
    //   }
    // }
  }
  // *** AXIOS SETTING START *** //
  function axiosSetHeader(handler) {
    if (handler === "login") {
      const accessToken = cookies.get("access_token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      console.log(axios.defaults.headers.common);
    } else if (handler === "logout") {
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  // *** AXIOS SETTING END *** //
  // *** TOKEN RELATED STUFF START(INCLUDE AXIUS) *** //

  // *** IS LOADING START *** //
  const [isLoading, setIsLoading] = useState(false);

  // *** IS LOADING END *** //

  // *** TOAST HANDLER START *** //
  const toast = useToast();
  const toastIdRef = useRef();
  function addToast({ ...toastData }) {
    toastIdRef.current = toast({
      title: toastData.title,
      description: toastData.description,
      status: toastData.status,
      duration: 5000,
      isClosable: true,
    });

    // *** TOAST HANDLER END *** //
  }
  return (
    <>
      <AppContext.Provider
        value={{
          friends,
          setFriends,
          user,
          setUser,
          getUser,
          isLoading,
          setIsLoading,
          getFriendsList,
          axiosSetHeader,
          getAccessTokenFromRefreshToken,
          addToast,
        }}
      >
         {isLoading?(<CustomSpinner/>):(<>{children}</>)}
      </AppContext.Provider>
    </>
  );
}
