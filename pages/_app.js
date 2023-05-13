import {
  ChakraProvider,
  CSSReset,
  Center,
  Box,
  useToast,
} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import axios from "axios";

import Cookies from "universal-cookie";
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout";

axios.defaults.baseURL = "http://127.0.0.1:8000/";

export default function App({ Component, pageProps, router }) {
  useEffect(() => {
    console.log("FROM APP")
  },[]);
  const cookies = new Cookies();
  const [user, setUser] = useState(cookies.get("user"));

  
  return (
    <ChakraProvider>
      <CSSReset />
      <Box minW={"100vw"} minH={"100vh"}>
        <Layout router={router} pageProps={pageProps}>
          <Component user={user} {...pageProps} />
        </Layout>
      </Box>
    </ChakraProvider>
  );
}
