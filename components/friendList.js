import axios from "axios";
import Link from "next/link";
// import Image from "next/legacy/image";
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
  Image,
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
import MobileList from "./friendLists/mobileList";
import { wrap } from "popmotion";

const sortOptionStates = {
  LOW_AMOUNT: "Low Amount",
  HIGH_AMOUNT: "High Amount",
  LATEST: "Latest",
  OLDEST: "Oldest",
  Name: "Name A to Z",
  EVENT: "Event",
  // BIRTHDAY: "Birthday",
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
  const sortBy = "Sort By";
  function sortFunc(option) {
    setCurrentOption(option);
    const copiedFriends = searchFriend.slice();
    switch (option) {
      case sortOptionStates.HIGH_AMOUNT:
        copiedFriends.sort((a, b) => b.sum - a.sum);
        setSearchFriend([...copiedFriends]);
        break;
      case sortOptionStates.EVENT:
        copiedFriends.sort((a, b) => b.event_length - a.event_length);
        setSearchFriend([...copiedFriends]);
        break;
      case sortOptionStates.LOW_AMOUNT:
        copiedFriends.sort((a, b) => a.sum - b.sum);
        setSearchFriend([...copiedFriends]);
        break;
      case sortOptionStates.LATEST:
        copiedFriends.sort(
          (a, b) => new Date(b.last_log) - new Date(a.last_log)
        );
        setSearchFriend([...copiedFriends]);
        break;
      case sortOptionStates.OLDEST:
        copiedFriends.sort(
          (a, b) => new Date(a.last_log) - new Date(b.last_log)
        );
        setSearchFriend([...copiedFriends]);
        break;
      // case sortOptionStates.BIRTHDAY:
      //   console.log("BIER")
      //   copiedFriends.sort((a, b) => {
      //     const nowDate = new Date();
      //     const aDate = new Date(a.birthday);
      //     const bDate = new Date(b.birthday);
      //     const A = (nowDate.getMonth() - aDate.getMonth() -12) * -1
      //     const B = (nowDate.getMonth() - bDate.getMonth() - 12) * -1
      //     const deffDateA = nowDate.getDate() - aDate.getDate();
      //     const deffDateB = nowDate.getDate() - bDate.getDate();
      //     const deffMonthA = wrap(0, 12,A);
      //     const deffMonthB = wrap(0, 12,B);
      //     // console.log("A", A, aDate,deffMonthA ,'B', B, bDate, deffMonthB)
      //     console.log("A", deffMonthA ,'B',deffMonthB)
      //     if(deffMonthA < deffMonthB) {
      //       if(deffDateA < deffDateB) {
      //           return -1
      //         } else {
      //           return 1
      //         }
      //     } else {
      //       if(deffDateA > deffDateB) {
      //         return -1
      //       } else {
      //         return 1
      //       }
      //     } 
      //   });
        setSearchFriend([...copiedFriends]);
        break;
      case sortOptionStates.Name:
        console.log("NAME");
        copiedFriends.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else {
            return -1;
          }
        });
        setSearchFriend([...copiedFriends]);
        break;
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
          <Text fontWeight={"bold"}>{sortBy}</Text>
          <Text p={"0 0.2rem"}>:</Text>
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
       const birthdayObj = birthDateCalculation(d.birthday)
        if (dateCalculation(d.last_log) >= 30) {
          chachUpArray.unshift(d);
        } 
        else if(typeof birthdayObj!=='undefined'){
          chachUpArray.unshift(d);
        }else {
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
  function birthDateCalculation(date) {
    if (date) {
      const nowDate = new Date();
      const bDate = new Date(date);
      const deffMonth = nowDate.getMonth() - bDate.getMonth();
      const deffDate = nowDate.getDate() - bDate.getDate();
      if (deffMonth === 0) {
        if (deffDate <= 0) {
          return { alert: true, deffDate: deffDate };
        }
      } else if (deffMonth === -1 || deffMonth === 11) {
        if (deffDate >= 0) {
          return { alert: true, deffDate: deffDate };
        }
      }
    }
  }
  function BirthdayAlert({ date }) {
    const dateResultObj = birthDateCalculation(date);
    const dateDisplay =
      typeof dateResultObj !== "undefined" ? dateResultObj.alert : "";
    return (
      <Flex w={"100%"} color={"red.500"} justifyContent={"flex-end"}>
        {dateDisplay ? (
          <Flex
            alignItems={"center"}
            mr={"0.5rem"}
            borderRadius={"4px"}
            bg={"#c05e5e4d"}
            mt={"0.5rem"}
            pr={"0.5rem"}
            border={"solid #fa95f6"}
          >
            <Image
              src={`/svgs/events/gift.svg`}
              width={{ base: "20px", sm: "30px" }}
              height={"30px"}
            />
            <Text fontWeight={"bold"}>
              {dateResultObj.deffDate === 0
                ? "Birthday is Today!"
                : "Birthday is Soon!"}
            </Text>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    );
  }
  function DateAlert({ date }) {
    return (
      <Flex w={"100%"} color={"red.500"} justifyContent={"flex-end"}>
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
            <Image
              src={`/svgs/clock.svg`}
              width={{ base: "20px", sm: "30px" }}
              height={"30px"}
            />
            <Text fontWeight={"bold"}>Catch up!</Text>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    );
  }
  function spentOrReceive(amount) {
    return amount >= 0 ? "I owe them" : "They owe me";
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
              <Flex
                fontSize={{ base: "0.7rem", sm: "1rem" }}
                position={"absolute"}
                flexDirection={"column"}
                right={0}
              >
                <BirthdayAlert date={f.birthday} />
                <DateAlert date={f.last_log} />
              </Flex>
              <Link href={"friendDetails/" + f.id} scroll={false}>
                <CardBody>
                  <Flex alignItems={"center"}>
                    <Flex
                      position={"relative"}
                      justifyContent={"center"}
                      w={{ base: "50px", md: "70px" }}
                      h={{ base: "50px", md: "70px" }}
                      left={{ base: -3, sm: 0 }}
                      mr={{ base: 0, sm: "1rem" }}
                      border={"solid gray"}
                      borderRadius={"50vh"}
                      bg={"#bebebe4a"}
                    >
                      {getAvaterObj(f.avatar)().icon}
                      <Box position={"absolute"} w={"150%"} bottom={-4}>
                        <Text
                          lineHeight={"1rem"}
                          fontWeight={"bold"}
                          textAlign={"center"}
                        >
                          {f.name.slice(0, 7)}
                          {f.name.length > 7 ? ".." : ""}
                        </Text>
                      </Box>
                    </Flex>
                    <MobileList friend={f} spentOrReceive={spentOrReceive} />
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      align="stretch"
                    >
                      <Flex
                        color={f.sum >= 0 ? "#c0fafb" : "#ff9393"}
                        w={"100%"}
                        fontWeight={"bold"}
                      >
                        {spentOrReceive(f.sum)}
                        <Text m={"0 0.2em"}>:</Text>＄
                        {f.sum >= 0 ? f.sum : f.sum * -1}
                      </Flex>
                      <Flex w={"100%"} fontWeight={"bold"}>
                        Number of events<Text m={"0 0.2em"}>:</Text>
                        {f.event_length}
                      </Flex>
                      <Flex w={"100%"} fontWeight={"bold"}>
                        Last interaction<Text m={"0 0.2em"}>:</Text>
                        {dateConvert(f.last_log)}
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
