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
    if(user) {
      getFriendsList(user.UID)
    }
  }, []);
  async function getFriendsList(userUid) {
    console.log("inGET", userUid)
    if (userUid) {
      console.log("inGETUSER")
      axios({
        method: "post",
        url: "/api/character/user-character/",
        data: {
          user: userUid,
        },
      })
        .then((res) => {
          console.log("GOT FRIEND", res.data)
          setFriends([...res.data]);
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
    <AppContext.Provider value={{friends, setFriends, user, setUser, getUser, isLoading, setIsLoading, getFriendsList, addToast}}>
      {children}
    </AppContext.Provider>
    </>
  )
}
