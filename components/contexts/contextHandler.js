import AppContext from "../globalContext";
import { useState, useEffect, useRef,useContext } from "react";
import { useToast } from "@chakra-ui/react";
import Cookies from "universal-cookie";
import axios from 'axios'
export default function ContextHandler({ children }) {
  const [friends, setFriends] = useState('');
  const context = useContext(AppContext);
  const cookies = new Cookies
  const [user, setUser] = useState(cookies.get('user'))
  useEffect(() => {
    getFriend(user)
  }, []);
  async function getFriend(user) {
    console.log("inGET")
    if (user) {
      console.log("inGETUSER")
      axios({
        method: "post",
        url: "/api/character/user-character/",
        data: {
          user: user,
        },
      })
        .then((res) => {
          setFriends(res.data);
        })
        .catch((e) => {});
    }
  }
  // *** IS LOADING START *** //
  const [isLoading, setIsLoading] = useState(false)

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
    <AppContext.Provider value={{friends, setFriends, user, setUser,isLoading, setIsLoading, getFriend, addToast}}>
      {children}
    </AppContext.Provider>
    </>
  )
}
