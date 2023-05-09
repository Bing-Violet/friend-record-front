import '@/styles/globals.css'
import { ChakraProvider,CSSReset, Center, Box, useToast} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import axios from 'axios'
import Cookies from "universal-cookie";
import AppContext from "@/components/globalContext";
import {useState, useEffect, useRef} from "react"
import Navber from "@/components/navber";
axios.defaults.baseURL = 'http://127.0.0.1:8000/'

export default function App({ Component, pageProps }) {
  const [friends, setFriends] = useState('');
  const cookies = new Cookies
  const [user, setUser] = useState(cookies.get('user'))
  const toast = useToast();
  const toastIdRef = useRef();
  function addToast({ ...toastData }) {
    console.log(toastData);
    toastIdRef.current = toast({
      title: toastData.title,
      description: toastData.description,
      status: toastData.status,
      duration: 5000,
      isClosable: true,
    });
  }
  useEffect(() => {
    if (user) {
      axios({
        method: "post",
        url: "/api/character/user-character/",
        data:{
          user:user
        }
      })
        .then((res) => {
          setFriends(res.data);
        })
        .catch((e) => {});
    }
  }, []);
  return (
    <ChakraProvider>
      <CSSReset />
      <Box minW={'100vw'} minH={'100vh'}>
        <AppContext.Provider value={{friends, setFriends,setUser, addToast}}>
          <Navber user={user}/>
          <Component user={user} {...pageProps} />
        </AppContext.Provider>
      </Box>
    </ChakraProvider>
  )
}
