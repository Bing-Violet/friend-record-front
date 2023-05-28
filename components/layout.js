import { Box, Flex, Spinner, Center, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { Suspense, useEffect, useState, useContext } from "react";
import Navber from "./navber";
import ContextHandler from "./contexts/contextHandler";
import Cookies from "universal-cookie";
import CustomSpinner from "./spinner";
import AppContext from "./globalContext";
import NotLogin from "./homes/notLogin";
import PcBackground from "./backgrounds/pcBackground";
import MobileNavber from "./mobileNavber";

export default function Layout({ children, router, pageProps }) {
  const cookies = new Cookies();
  const context = useContext(AppContext);
  const [user, setUser] = useState(cookies.get("user"));
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [path, setPath] = useState("");

  useEffect(() => {
    console.log("LAYPIT",document.body.style.background);
    if (window !== "undefined") {
      document.body.style.background = 'url("/images/background.png")'
      document.body.style.layout = 'fill'
      document.body.style.objectFit = 'content'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundColor = '#F2F2F2'
      document.body.style.overflowX = 'hidden'
      setUrl(document.URL);
      setPath(
        router.state.asPath === "/" ? "" : splitPath(router.state.asPath)
      );
    }
  }, [router.state]);
  const splitPath = (path) => {
    const separator = "-";
    return path
      .split("/")
      .map((p, index, array) => {
        if (index !== 0) {
          return initialLetterToApperCase(p);
        }
      })
      .join(separator);
  };

  const initialLetterToApperCase = (string) => {
    return string.replace(/\b[a-z]/g, (char) => char.toUpperCase());
  };

  const bg = useColorModeValue(
    "#F2F2F2",
    "linear-gradient(to bottom, #232323 80%, #6cd8e8)"
  );
  return (
    <Flex
      // bg={bg}
      minW="100vw"
      minH="100vh"
      // flexDirection={"column"}
      justifyContent={"center"}
    >
      <Head>
        <title>{`Nobuhiro-Portfolio${path}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={""} />
        <meta property="og:site_name" content={""} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="/map.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={""} />
        <meta name="author" content={"ore"} />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <meta property="og:site_name" content={""} />
        <link rel="apple-touch-icon" href="/favicon.ico" sizes="180x180" />
      </Head>
      {/* <PcBackground /> */}
      <Box minH="50vh" maxW={600} w={{base:'100%',md:600}} className={'base-width'}>
        <ContextHandler>
          <Navber />
          {context.isLoading ? (
            <CustomSpinner />
          ) : (
            <Box pt={{base:'0',md:"7rem"}}>{children}</Box>
          )}
        </ContextHandler>
      </Box>
      <MobileNavber/>
    </Flex>
  );
}
