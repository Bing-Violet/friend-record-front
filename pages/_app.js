import '@/styles/globals.css'
import { ChakraProvider,CSSReset} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8000/'
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
