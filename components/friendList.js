import axios from "axios";
import Cookies from "universal-cookie";
import Link from "next/link";
import { useState, useEffect, createContext } from "react";
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
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

import AppContext from "./globalContext";
import { useContext } from "react";

function Search({ searchFriend, setSearchFriend, context }) {
  const [keyword, setKeyword] = useState("");
  const handleChange = (event) => {
    console.log("UN");
    setKeyword(event.target.value);
    const searchedF = context.friends.filter((f) =>
      f.name.includes(event.target.value)
    );
    console.log("CH", searchedF);
    setSearchFriend([...searchedF]);
  };
  return (
    <>
      {/* <Box w={'100%'} h={'50px'} mb={'1rem'} border={'solid gray'} borderRadius={"2rem"}> */}
      <Input
        value={keyword}
        onChange={handleChange}
        placeholder="search"
        size="sm"
      ></Input>
      {/* </Box> */}
    </>
  );
}

export default function FriendList({ User }) {
  const context = useContext(AppContext);
  const [searchFriend, setSearchFriend] = useState("");
  useEffect(() => {
    setSearchFriend(context.friends);
  }, []);
  function dateCalculation(date) {
    console.log("IN", date);
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
          <Box textAlign={"right"}>chach up!</Box>
        ) : (
          <></>
        )}
      </Box>
    );
  }
  return (
    <>
      <Search
        searchFriend={searchFriend}
        setSearchFriend={setSearchFriend}
        context={context}
      />
      {searchFriend.length ? (
        <>
          {searchFriend.map((f, index) => (
            <Card minW={"100%"} key={index}>
              <DateAlert date={f.last_log} />
              <Link href={"friendDetails/" + f.id} scroll={false}>
                <CardBody>
                  <Flex alignItems={"center"}>
                    <Avatar mr={"1rem"} />
                    <VStack align="stretch">
                      <Text>Name:{f.name}</Text>
                      <Text>Sum:＄{f.sum}</Text>
                    </VStack>
                  </Flex>
                </CardBody>
              </Link>
            </Card>
          ))}
        </>
      ) : (
        <>NO</>
      )}
    </>
  );
}
