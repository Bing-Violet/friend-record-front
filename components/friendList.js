import axios from "axios";
import Cookies from "universal-cookie";
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
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import AppContext from "./globalContext";
import { useContext } from "react";

export default function FriendList({ User }) {
  const context = useContext(AppContext)
//   useEffect(() => {
//     console.log("EFFECT", User);
//     if (User) {
//       axios({
//         method: "get",
//         url: "/api/character/character-list/",
//       })
//         .then((res) => {
//           console.log("RESPONSE", res.data, Array.isArray(res.data));
//           setFriends(res.data);
//         })
//         .catch((e) => {});
//     }
//   }, []);
  return (
    <>
      {context.friends.length ? (
        <>
          {context.friends.map((f, index) => (
            <Card minW={"100%"} key={index}>
              <CardBody>
                <Flex alignItems={"center"}>
                  <Avatar mr={"1rem"}/>
                  <VStack align='stretch'>
                  <Text>Name:{f.name}</Text>
                  <Text>Sum:{f.sum}</Text>
                  </VStack>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </>
      ) : (
        <>NO</>
      )}
    </>
  );
}
