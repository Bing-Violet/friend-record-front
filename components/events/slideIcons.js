import {
  Box,
  Flex,
  Text,
  Image,
  Heading,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { eventIcons } from "./icons";

function SlideItems({ setIcon, imageIndex, setSelectedIcon, props }) {
  const [array, setArray] = useState([]);
  const [mounted, setMounted] = useState(false);
  const clickAction = (icon) => {
    console.log("FROM CLICK ACTION")
    setIcon(icon)
    setSelectedIcon(icon)
  }
  let markup;
  if (eventIcons.length) {
    console.log("EV", imageIndex);
    markup = (
      <Flex>
        {eventIcons.map((file, index) => {
          return (
            <Box
              key={index}
              _hover={{ bg: "#ececec" }}
              transition={'.3s'}
              position="relative"
              onClick={() => {
               clickAction(file);
              }}
            >
              {file(props).icon}
            </Box>
          );
        })}
      </Flex>
    );
  }
  return <>{markup}</>;
}
function Slide({ setIcon, eachSlideWidth, setSelectedIcon, props }) {
  const shadowColor = useColorModeValue("white", "rgb(26,32,44)");
  // const AllowColorScheme = useColorModeValue("pink", "red");
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, eventIcons.length, page);
  const [animateWidth, setAnimateWidth] = useState(0);
  const [edge, setEdge] = useState(false);
  const [edgeAnime, setEdgeAnime] = useState(0);
  const paginate = (newDirection) => {
    const stopLength = eventIcons.length - 3;
    if (stopLength === imageIndex) {
      if (newDirection === -1) {
        setEdge(false);
        setAnimateWidth(
          (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
        );
        setPage([page + newDirection, newDirection]);
        return;
      } else {
        setEdgeAnime(-20);
        setEdge((state) => true);
        return;
      }
    } else if (!imageIndex) {
      if (newDirection === 1) {
        setEdge(false);
        setAnimateWidth(
          (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
        );
        setPage([page + newDirection, newDirection]);
        return;
      } else {
        setEdgeAnime(20);
        setEdge((state) => true);
        return;
      }
    }
    setAnimateWidth(
      (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
    );
    setPage([page + newDirection, newDirection]);
  };
  let markup;
  if (eventIcons.length) {
    markup = (
      <Flex
        // w={{ base: "100vw", lg: "80vw" }}
        w={"100%"}
        h={"100%"}
        position={"relative"}
        alignItems={"center"}
      >
        <Flex
          // top="calc(50% - 20px)"
          // left="10px"
          // position="absolute"
          w="30px"
          h="40px"
          bg="none"
          // color={"white"}
          zIndex={"1"}
          justifyContent={"center"}
          alignItems="center"
          fontSize={"16px"}
          border="none"
          borderRadius={"0.2rem"}
          transform="scale(-1)"
          transition={".3s"}
          _hover={{ bg: "rgba(0,0,0,.7)" }}
          onClick={() => (edge ? "" : paginate(-1))}
        >
          <Box display="inline-block">{"❯"}</Box>
        </Flex>
        <Box
          w={eachSlideWidth * 3}
          h={"60px"}
          overflowX={"hidden"}
          position={"relative"}
        >
          <Flex
            as={motion.div}
            position={"absolute"}
            animate={{
              x: edge ? [edgeAnime, animateWidth - animateWidth] : "",
            }}
            onAnimationComplete={() => {
              setEdge(false);
            }}
          >
            <motion.div animate={{ x: animateWidth }}>
              <SlideItems
              setIcon={setIcon}
                eachSlideWidth={eachSlideWidth}
                page={page}
                props={props}
                direction={direction}
                imageIndex={imageIndex}
                setSelectedIcon={setSelectedIcon}
              />
            </motion.div>
          </Flex>
        </Box>
        <Flex
          // top="calc(50% - 20px)"
          // position="absolute"
          w="30px"
          h="40px"
          bg="none"
          // color={"white"}
          right={"10px"}
          zIndex={"1"}
          justifyContent={"center"}
          alignItems="center"
          border="none"
          borderRadius={"0.2rem"}
          fontSize={"16px"}
          transition={".3s"}
          _hover={{ bg: "rgba(0,0,0,.7)" }}
          onClick={() => (edge ? "" : paginate(1))}
        >
          <Box >
          {"❯"}
          </Box>
        </Flex>
      </Flex>
    );
  }
  return <>{markup}</>;
}

function SlectedIcon({ selectedIcon }) {
  console.log("FROM S_ICON");
  return (
    <>
      <Flex fontSize={"2rem"} mr={"1rem"} alignItems={"center"}>
        <Flex
          w={"50px"}
          h={"50px"}
          border={"solid #aeaeae"}
          borderRadius={"50vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {selectedIcon.icon}
        </Flex>
      </Flex>
    </>
  );
}

export default function SlideIcons({ icons, setIcon, defaultIcon }) {
  const [selectedIcon, setSelectedIcon] = useState("");
  const [eachSlideWidth, setEachSlideWidth] = useState(56);
  const props = {
    // h: eachSlideWidth,
    // w: eachSlideWidth,
    fontSize: eachSlideWidth,
  };
  useEffect(() => {
    console.log('EFFE',typeof defaultIcon)
    if(typeof defaultIcon !== 'undefined') {
      console.log("NOT UNB")
      setIcon(defaultIcon())
      setSelectedIcon(() => defaultIcon())
    } else {
      setSelectedIcon(() => eventIcons[0]())
      setIcon(eventIcons[0]())
    }
  },[])
  return (
    <>
    <Text fontWeight={500}>Icon</Text>
      <Flex w={"100%"} h={"100%"} alignItems={"center"} className={"out"}>
        <SlectedIcon selectedIcon={selectedIcon} />

        <Slide
        setIcon={setIcon}
          eachSlideWidth={eachSlideWidth}
          fileArray={eventIcons}
          props={props}
          setSelectedIcon={setSelectedIcon}
        />
      </Flex>
    </>
  );
}
