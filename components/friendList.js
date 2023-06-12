import axios from "axios";
import Link from "next/link";
import Image from "next/legacy/image";
import { useState, useEffect, useRef, useContext } from "react";
import {
  Flex,
  Text,
  Box,
  Input,
  Button,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import AppContext from "./globalContext";
import FriendCreate from "./friendCreate";
import { FaSearchPlus } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { dateConvert } from "@/utils";
import { getAvaterObj } from "./iconsSlides/avatars";
const sortOptionStates = {
  LOW_AMOUNT: "Low Amount",
  HIGH_AMOUNT: "High Amount",
  LATEST: "Latest",
  OLDEST: "Oldest",
  Name:"Name A to Z",
  EVENT: "Event",
};
function Wrapper({ children, toastFun }) {
  const context = useContext(AppContext);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);
  const ref = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWrapperHeight(ref.current.offsetHeight);
      setInnerHeight(window.innerHeight - 112 - 16); // 112 is navber height
    }
  }, [window.innerHeight]);
  let image;
  if (!context.friends.length) {
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
        <Box
          boxShadow="xl"
          border={"solid #cf5701"}
          w={"100%"}
          h={400}
          position="relative"
        >
          <Image
            priority={true}
            src={"/images/friend.jpg"}
            layout="fill"
            objectFit="cover"
            alt={"asset"}
          />
        </Box>
      </>
    );
  }
  return (
    <Flex
      w={"100%"}
      h={{ base: "calc(100vh - 44px)", md: "auto" }}
      minH={"200px"}
      maxH={{ md: innerHeight }}
      overflowY={"scroll"}
      p={{ base: "0.3rem", md: "1rem" }}
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
function Selector({ searchFriend, setSearchFriend, context }) {
  const [currentOption, setCurrentOption] = useState("");
  const sortBy = 'Sort By'
  function sortFunc(option) {
    setCurrentOption(option)
    const copiedFriends = searchFriend.slice()
    switch(option){
      case sortOptionStates.HIGH_AMOUNT:
        copiedFriends.sort((a, b) => b.sum - a.sum);
        setSearchFriend([...copiedFriends]);
        break
      case sortOptionStates.EVENT:
        copiedFriends.sort((a, b) => b.event_length - a.event_length);
        setSearchFriend([...copiedFriends]);
        break
      case sortOptionStates.LOW_AMOUNT:
        copiedFriends.sort((a, b) => a.sum - b.sum);
        setSearchFriend([...copiedFriends]);
        break
      case sortOptionStates.LATEST:
        copiedFriends.sort((a, b) => new Date(b.last_log) - new Date(a.last_log))
        setSearchFriend([...copiedFriends]);
        break
      case sortOptionStates.OLDEST:
        copiedFriends.sort((a, b) => new Date(a.last_log) - new Date(b.last_log))
        setSearchFriend([...copiedFriends]);
        break
      case sortOptionStates.Name:
        console.log("NAME")
        copiedFriends.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else {
            return -1;
          }
        });
        setSearchFriend([...copiedFriends]);
        break
    }
  }
  return (
    <Menu>
      <MenuButton
        as={Button}
        size={{ base: "xs", md: "sm" }}
        mr="0.5rem"
        border={"solid navy"}
        rightIcon={<FiChevronDown />}
      >
        <Flex>
        <Text fontWeight={'bold'}>{sortBy}</Text>
        <Text p={'0 0.2rem'}>:</Text>
        {currentOption}
        </Flex>
      </MenuButton>
      <MenuList>
        {Object.values(sortOptionStates).map((option, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() => {
                sortFunc(option);
              }}
            >
              <Text as="p" fontSize={"sm"}>
                {option}
              </Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
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
    border: "solid red",
  };
  useEffect(() => {
    if (context.friends.length) {
      const chachUpArray = [];
      const dateOrderedArray = context.friends.filter((d) => {
        if (dateCalculation(d.last_log) >= 30) {
          chachUpArray.unshift(d);
        } else {
          return d;
        }
      });
      const orderedArray = chachUpArray.concat(dateOrderedArray);
      setSearchFriend([...orderedArray]);
      setMounted(true);
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
      <Flex
        w={"100%"}
        color={"red.500"}
        position={"absolute"}
        justifyContent={"flex-end"}
      >
        {dateCalculation(date) >= 30 ? (
          <Flex
            alignItems={"center"}
            mr={"0.5rem"}
            borderRadius={"4px"}
            bg={"#c05e5e4d"}
            mt={"0.5rem"}
            pr={"0.5rem"}
            border={"solid #fa95f6"}
          >
            <Image src={`/svgs/clock.svg`} width={"30px"} height={"30px"} />
            <Text fontWeight={"bold"}>Catch up!</Text>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    );
  }
  function spentOrReceive(amount) {
    return amount >= 0?'I owe them':'They owe me'
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
      <Flex w={"100%"} mb={"0.5rem"} justifyContent={"flex-end"}>
        <Selector
          searchFriend={searchFriend}
          setSearchFriend={setSearchFriend}
          context={context}
        />
      </Flex>
          {searchFriend.map((f, index) => (
            <Card w={"100%"} key={index} mb={"0.5rem"} color={"gray"}>
              <DateAlert date={f.last_log} />
              <Link href={"friendDetails/" + f.id} scroll={false}>
                <CardBody>
                  <Flex alignItems={"center"}>
                    <Flex
                      position={"relative"}
                      justifyContent={'center'}
                      w={"70px"}
                      h={"70px"}
                      mr={"1rem"}
                      border={"solid gray"}
                      borderRadius={"50vh"}
                      bg={"#bebebe4a"}
                    >
                      {getAvaterObj(f.avatar)().icon}
                      <Text position={"absolute"} bottom={-6} fontWeight={'bold'}>{f.name}</Text>
                    </Flex>
                    <VStack align="stretch">
                      <Flex color={f.sum>=0?'#c0fafb':'#ff9393'} w={'100%'} fontWeight={"bold"}>{spentOrReceive(f.sum)}<Text m={'0 0.2em'}>:</Text>＄{f.sum>=0?f.sum:f.sum*-1}</Flex>
                      <Flex w={'100%'} fontWeight={"bold"}>Number of events<Text m={'0 0.2em'}>:</Text>{f.event_length}</Flex>
                      <Flex w={'100%'} fontWeight={"bold"}>
                      Last interaction<Text m={'0 0.2em'}>:</Text>{dateConvert(f.last_log)}
                      </Flex>
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
