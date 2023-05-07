import '@/styles/globals.css'
import { ChakraProvider,CSSReset, Center, Box} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import axios from 'axios'
import Cookies from "universal-cookie";
import AppContext from "@/components/globalContext";
import {useState, useEffect} from "react"
import Navber from "@/components/navber";
axios.defaults.baseURL = 'http://127.0.0.1:8000/'

export default function App({ Component, pageProps }) {
  const [friends, setFriends] = useState('');
  const cookies = new Cookies
  const user = cookies.get('user')
  useEffect(() => {
    if (user) {
      axios({
        method: "get",
        url: "/api/character/character-list/",
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
        <AppContext.Provider value={{friends, setFriends}}>
          <Navber></Navber>
          <Component user={user} {...pageProps} />
        </AppContext.Provider>
      </Box>
    </ChakraProvider>
  )
}
