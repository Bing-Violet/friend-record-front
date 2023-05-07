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
  Input
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import AppContext from "./globalContext";
import { useContext } from "react";


function Search({searchFriend, setSearchFriend}) {
  const [keyword, setKeyword] = useState('')
  const handleChange = (event) => {
    console.log("UN")
    setKeyword(event.target.value)
    const searchedF = searchFriend.filter(f => 
      f.name.includes(event.target.value)
    )
    setSearchFriend([...searchedF])
  };
  return(
    <>
    {/* <Box w={'100%'} h={'50px'} mb={'1rem'} border={'solid gray'} borderRadius={"2rem"}> */}
      <Input
      value={keyword}
      onChange={handleChange}
      placeholder="enter password"
      size="sm"></Input>
    {/* </Box> */}
    </>
  )
}


export default function FriendList({ User }) {
  const context = useContext(AppContext);
  const [searchFriend, setSearchFriend] = useState('')
  useEffect(() => {
    setSearchFriend(context.friends)
  },[])
  return (
    <>
      {searchFriend.length ? (
        <>
        <Search searchFriend={searchFriend} setSearchFriend={setSearchFriend}/>
          {searchFriend.map((f, index) => (
            <Card minW={"100%"} key={index}>
              <Link href={"friendDetails/" + f.id} scroll={false}>
                <CardBody>
                  <Flex alignItems={"center"}>
                    <Avatar mr={"1rem"} />
                    <VStack align="stretch">
                      <Text>Name:{f.name}</Text>
                      <Text>Sum:{f.sum}</Text>
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
