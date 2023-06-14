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
import ContextHandler from "/components/contexts/contextHandler";

axios.defaults.baseURL = "http://127.0.0.1:8000/";

const breakpoints = {
  sm: "480px",
  md: "600px",
  // lg: "750px",
  xl: "1025px",
  "2xl": "1550px",
  "3xl": "1800px",
};

const theme = extendTheme({ breakpoints,fonts: {
  logo: `'Times New Roman', Times, sans-serif`,   
}, 
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  }
});

export default function App({ Component, pageProps, router }) {
  useEffect(() => {
    console.log("FROM APP");
  }, []);
  const cookies = new Cookies();
  const [user, setUser] = useState(cookies.get("user"));

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Box minW={"100vw"} minH={"100vh"}>
        <ContextHandler>
          <Layout router={router} pageProps={pageProps}>
            <Component user={user} {...pageProps} />
          </Layout>
        </ContextHandler>
      </Box>
    </ChakraProvider>
  );
}
