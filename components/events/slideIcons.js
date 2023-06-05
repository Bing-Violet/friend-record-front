import {
  Box,
  Flex,
  Image,
  Heading,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { eventIcons } from "./icons";

function SlideItems({ eachSlideWidth,page,variants,direction,imageIndex,setSelectedIcon, props }) {
  const [array, setArray] = useState([]);
  const [mounted, setMounted] = useState(false)
  // useEffect(() => {
  //   if (mounted) {
  //     const newAarray = eventIcons;
  //     newAarray.unshift(newAarray[newAarray.length - 1]);
  //     setArray([...newAarray]);
  //   }
  //   return setMounted(true)
  // }, []);
  const variantsLeft = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 56 : -56,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 56 : -56,
        opacity: 0,
        transition: {
          duration: 0.5,
        },
      };
    },
  };
  const Wapper = ({children}) => {
    return(
    <Box
    as={motion.div}
    animate={{ x: eachSlideWidth }}
    // key={page}
    // w="100%"
    // h="100%"
    // // position="absolute"
    // custom={direction}
    // variants={variants}
    // initial="enter"
    // animate="center"
    // exit="exit"
    // transition={{
    //   x: { type: "spring", stiffness: 300, damping: 30 },
    //   opacity: { duration: 0.2 },
    // }}
  >
    {children}
  </Box>
    )
  }
  let markup;
  if (eventIcons.length) {
    console.log("EV", imageIndex)
    markup = (
      <Flex>
        {eventIcons.map((file, index) => {
           return ( 
            <Box
              key={index}

              _hover={{ bg: "blue" }}
              // m="1rem"
              position="relative"
              onClick={() => {
                console.log("clicked"), setSelectedIcon(file());
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
function Slide({
  eachSlideWidth,
  setSelectedIcon,
  props,
}) {
  const shadowColor = useColorModeValue("white", "rgb(26,32,44)");
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, eventIcons.length, page);
  const [animateWidth, setAnimateWidth] = useState(0);
  const [edge, setEdge] = useState(false);
  const [rerender, setRerender] = useState(false)
  console.log("render from slide", edge)
  // useEffect(() => {
  //   if(edge) {
  //     console.log("EFFECT")
  //     setEdge(false)
  //   }
  // },[])
  const paginate = (newDirection) => {
    const stopLength = eventIcons.length - 3
    if(stopLength===imageIndex) {
      if(newDirection===-1) {
        setEdge(false)
        setAnimateWidth(
          (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
        );
        setPage([page + newDirection, newDirection]);
        return 
      } else {
        console.log("PULS", edge)
        setEdge(state => true)
        return 
      } 
    } else if(!imageIndex) {
      if(newDirection===1) {
        setEdge(false)
        setAnimateWidth(
          (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
        );
        setPage([page + newDirection, newDirection]);
        return 
      } else {
        setEdge(state => true)
      return
      }

    }
    setAnimateWidth(
      (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
    );
    setPage([page + newDirection, newDirection]);
  };
  const x = [animateWidth/20, animateWidth-animateWidth]
  let markup;
  if (eventIcons.length) {
    markup = (
      // <Flex w={"100%"} h={"100px"}>
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
          color={"white"}
          zIndex={"1"}
          justifyContent={"center"}
          alignItems="center"
          fontSize={"16px"}
          border="none"
          borderRadius={"0.2rem"}
          transform="scale(-1)"
          transition={".3s"}
          _hover={{ bg: "rgba(0,0,0,.7)" }}
          onClick={() => paginate(-1)}
        >
          <Box display="inline-block">{"❯"}</Box>
        </Flex>
        <Box w={eachSlideWidth * 3} h={'60px'} overflowX={"hidden"} position={"relative"}>
          <Flex className={'anime'} as={motion.div} position={'absolute'} animate={{ x: edge?[edge?20:-20, animateWidth-animateWidth]:''}}onAnimationComplete={() => {setEdge(false)}}>
            <motion.div animate={{ x: animateWidth }}>
              <SlideItems
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
          color={"white"}
          right={"10px"}
          zIndex={"1"}
          justifyContent={"center"}
          alignItems="center"
          border="none"
          borderRadius={"0.2rem"}
          fontSize={"16px"}
          transition={".3s"}
          _hover={{ bg: "rgba(0,0,0,.7)" }}
          onClick={() => paginate(1)}
        >
          {"❯"}
        </Flex>
      </Flex>
      // </Flex>
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
          border={"solid darkblue"}
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

export default function SlideIcons({ icons }) {
  const containerRef = useRef("");
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, eventIcons.length, page);
  const [animateWidth, setAnimateWidth] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [eachSlideWidth, setEachSlideWidth] = useState(56);
  const paginate = (newDirection) => {
    const stopLength = eventIcons.length - 3
    if(stopLength===imageIndex) {
      if(newDirection===-1) {
        setAnimateWidth(
          (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
        );
        setPage([page + newDirection, newDirection]);
        return 
      } else {
        return
      } 
    } else if(!imageIndex) {
      if(newDirection===1) {
        setAnimateWidth(
          (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
        );
        setPage([page + newDirection, newDirection]);
        return 
      } else {
      return 
      }

    }
    setAnimateWidth(
      (pre) => (pre += newDirection > 0 ? -eachSlideWidth : eachSlideWidth)
    );
    setPage([page + newDirection, newDirection]);
    // slideControler();
    console.log("END")
  };
  const props = {
    h: "2rem",
    w: "2rem",
    fontSize: eachSlideWidth,
  };

  return (
    <Flex w={"100%"} h={"100%"} alignItems={"center"} className={"out"}>
      <SlectedIcon selectedIcon={selectedIcon} />

      <Slide
      page={page}
      direction={direction}
      imageIndex={imageIndex}
        eachSlideWidth={eachSlideWidth}
        paginate={paginate}
        fileArray={eventIcons}
        props={props}
        containerRef={containerRef}
        animateWidth={animateWidth}
        setSelectedIcon={setSelectedIcon}
      />
    </Flex>
  );
}
