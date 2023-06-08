import axios from "axios";
import { customAxios } from "./customAxios";
import Cookies from "universal-cookie";
import Link from "next/link";
import Image from "next/legacy/image";
import { useState, useEffect, useRef, forwardRef, useContext } from "react";
import {
  Button,
  ButtonGroup,
  Wrap,
  WrapItem,
  Center,
  VStack,
  Flex,
  Text,
  Avatar,
  Box,
  Input,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Portal,
  IconButton,
  FocusLock,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { AiOutlineEdit } from "react-icons/ai";
import AppContext from "./globalContext";
import FriendCreate from "./friendCreate";
import { FaSearchPlus } from "react-icons/fa";
import { dateConvert } from "@/utils";
import { getAvaterObj } from "./iconsSlides/avatars";

function Wrapper({ children, toastFun }) {
  const context = useContext(AppContext);
  const [wrapperHeight, setWrapperHeight] = useState(0)
  const [innerHeight, setInnerHeight] = useState(0)
  const ref = useRef()
  useEffect(() => {
    if(typeof window!=='undefined') {
      console.log('ref', window.innerHeight)
      console.dir(ref.current.offsetHeight)
      setWrapperHeight(ref.current.offsetHeight)
      setInnerHeight(window.innerHeight -112 - 16) // 112 is navber height
    }
  },[window.innerHeight])
  let image 
  if(!context.friends.length) {
    image = (
      <>
      <Text
        color={"#1166EE"}
        fontFamily={"Gill Sans"}
        fontWeight="bold"
        fontSize={"3rem"}
      >
        Create Friend
      </Text>
      <Box boxShadow="xl" border={'solid #cf5701'} w={"100%"} h={400} position="relative">
        <Image
          priority={true}
          src={"/images/friend.jpg"}
          layout="fill"
          objectFit="cover"
          alt={"asset"}
        />
      </Box></>
    )
  }
  return (
    <Flex
      w={"100%"}
      h={{base:'calc(100vh - 44px)',md:'auto'}}
      minH={"200px"}
      maxH={{md:innerHeight}}
      overflowY={'scroll'}
      p={{base:'0.3rem',md:"1rem"}}
      alignItems={"center"}
      flexDirection={"column"}
      background={"rgb(255 191 220 / 42%)"}
      border={"solid #a4bded"}
      ref={ref}
    >
     {image}
      <Box mt={"1rem"}>
        <FriendCreate toastFun={toastFun} />
      </Box>
      {children}
    </Flex>
  );
}
function Search({ searchFriend, setSearchFriend, context }) {
  const [keyword, setKeyword] = useState("");
  const handleChange = (event) => {
    setKeyword(event.target.value);
    const searchedF = context.friends.filter((f) =>
      f.name.includes(event.target.value)
    );
    if (context.friends.length) {
      setSearchFriend([...searchedF]);
    }
  };
  let markup;
  if (context.friends.length) {
    markup = (
      <>
        <FormControl isInvalid={!context.friends.length} m={"1rem 0"}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearchPlus fontSize={"1.3rem"} color="gray.300" />
            </InputLeftElement>
            <Input
              value={keyword}
              onChange={handleChange}
              border={"solid #3a86e4"}
              placeholder="Friend Search"
              background={"rgb(204 246 255 / 62%)"}
              size="md"
            ></Input>
          </InputGroup>
          <FormErrorMessage>no friend to search.</FormErrorMessage>
        </FormControl>
      </>
    );
  }
  return <>{markup}</>;
}

export default function FriendList({ User, toastFun }) {
  const context = useContext(AppContext);
  const [searchFriend, setSearchFriend] = useState([]);
  const [mounted, setMounted] = useState(false);
  const avatarProp = {
    border:'solid red'
  }
  useEffect(() => {
    if (context.friends.length) {
      setSearchFriend([...context.friends]);
      setMounted(true);
      // context.setIsLoading(false)
    }
  }, []);
  function dateCalculation(date) {
    const nowDate = new Date();
    const last_log = new Date(date);
    const diffMilliSec = nowDate - last_log;
    const diffDays = parseInt(diffMilliSec / 1000 / 60 / 60 / 24);
    return diffDays;
  }
  function DateAlert({ date }) {
    return (
      <Box w={"100%"} color={"red.500"} position={"absolute"} t={"0"} r={"0"}>
        {dateCalculation(date) >= 30 ? (
          <Box textAlign={"left"}>chach up!</Box>
        ) : (
          <></>
        )}
      </Box>
    );
  }
  return (
    <Wrapper toastFun={toastFun}>
      <Search
        searchFriend={searchFriend}
        setSearchFriend={setSearchFriend}
        context={context}
      />
      {searchFriend.length && mounted ? (
        <>
          {searchFriend.map((f, index) => (
            <Card w={"100%"} key={index} mb={'0.5rem'} color={'gray'}>
              <DateAlert date={f.last_log} />
              {/* <EditPopover eventName={f.name} id={f.id} toastFun={toastFun} /> */}
              <Link href={"friendDetails/" + f.id} scroll={false}>
                <CardBody>
                  <Flex alignItems={"center"}>
                    <Box position={"relative"} w={'70px'} h={'70px'} mr={'1rem'} border={'solid gray'} borderRadius={'50vh'} bg={'#bebebe4a'}>
                    {getAvaterObj(f.avatar)().icon}
                    </Box>
                    <VStack align="stretch">
                      <Text fontWeight={'bold'}>Name:{f.name}</Text>
                      <Text fontWeight={'bold'}>Sum:＄{f.sum}</Text>
                      <Text fontWeight={'bold'}>Last-Log:{dateConvert(f.last_log)}</Text>
                    </VStack>
                  </Flex>
                </CardBody>
              </Link>
            </Card>
          ))}
        </>
      ) : (
        <></>
      )}
    </Wrapper>
  );
}
