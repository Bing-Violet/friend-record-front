import '@/styles/globals.css'
import { ChakraProvider,CSSReset, Center, cookieStorageManager} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import axios from 'axios'
import Cookies from "universal-cookie";
import AppContext from "@/components/globalContext";
import {useState, useEffect} from "react"
axios.defaults.baseURL = 'http://127.0.0.1:8000/'

export default function App({ Component, pageProps }) {
  console.log("APP")
  const [friends, setFriends] = useState([]);
  const cookies = new Cookies
  const user = cookies.get('user')
  useEffect(() => {
    // console.log("EFFECT", user)
    if (user) {
      axios({
        method: "get",
        url: "/api/character/character-list/",
      })
        .then((res) => {
          console.log("RESPONSE", res.data, Array.isArray(res.data));
          setFriends(res.data);
        })
        .catch((e) => {});
    }
  }, []);
  return (
    <ChakraProvider>
      <CSSReset />
      <Center>
        <AppContext.Provider value={{friends, setFriends}}>
          <Component {...pageProps} />
        </AppContext.Provider>
      </Center>
    </ChakraProvider>
  )
}
