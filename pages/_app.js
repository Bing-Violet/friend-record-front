import '@/styles/globals.css'
import { ChakraProvider,CSSReset} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
