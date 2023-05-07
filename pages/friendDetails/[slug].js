import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Button,
  ButtonGroup,
  Wrap,
  WrapItem,
  Center,
  VStack,
  Flex,
  Spinner,
  Avatar,
  Text,
  Box,
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
  IconButton
} from "@chakra-ui/react";
import EventCreate from "@/components/eventCreate";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { FiDelete } from "react-icons/fi";

export default function FriendDetail({ user }) {
  const router = useRouter();
  const [friend, setFriend] = useState("");
  const [events, setEvents] = useState("");
  const [mounted, setMounted] = useState(false);
  const [slug, setSlug] = useState("");
  useEffect(() => {
    if (user && router.query.slug) {
      axios({
        method: "get",
        url: `/api/character/character-detail/${router.query.slug}`,
      })
        .then((res) => {
          setFriend(res.data);
          setEvents(res.data.event)
          console.log("res_slug", res.data, events);
          setMounted(true)
        })
        .catch((e) => {});
    } else if (!slug) {
      setSlug(router.query.slug);
    }
  }, [router.query.slug]); //why set router? this is for reloading.

  function dateConvert(date) {
    const dateObj = new Date();
    const offset = dateObj.getTimezoneOffset();
    let dt = new Date(date);
    const localTime = dt.setMinutes(offset * -1 + dt.getMinutes());

    dt = new Date(localTime);
    const stringDT = dt.toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return stringDT.replace(/\//g, "-");
  }
  function FriendInfo() {
    return (
      <>
        {Object.keys(friend).length ? (
          <Card minW={"100%"}>
            <CardBody>
              <Flex alignItems={"center"}>
                <Avatar mr={"1rem"} />
                <VStack align="stretch">
                  <Text>Name : {friend.name}</Text>
                  <Text>Sum : ${friend.sum}</Text>
                  <Text>Last_log : {dateConvert(friend.last_log)}</Text>
                  {console.log("IN_SLUG", events)}
                </VStack>
              </Flex>
            </CardBody>
          </Card>
        ) : (
          <>
            <Spinner />
          </>
        )}
      </>
    );
  }
  function EventList() {
    return (
      <Box mt={"1rem"}>
        {events.length ? (
          <>
            {events.map((e, index) => (
             <Card position={'relative'} key={index} mb={"1rem"} minW={"100%"}>
              <SettingMenu/>
             <CardBody>
               <Flex alignItems={"center"}>
                 <VStack align="stretch">
                   <Text>Event-Name : {e.name}</Text>
                   <Text>Money : ${e.money}</Text>
                   <Text>Created : {dateConvert(e.created_on)}</Text>
                 </VStack>
               </Flex>
             </CardBody>
           </Card>
            ))}
            <EventCreate slug={router.query.slug} friend={friend} events={events} setEvents={setEvents}/>
          </>
        ) : (
            <Flex flexDirection={"column"} alignItems={"center"}>
            <Text>No Event To Show</Text>
            <EventCreate slug={router.query.slug} friend={friend} events={events} setEvents={setEvents}/>
            </Flex>
        )}
      </Box>
    );
  }
  function SettingMenu() {
    return (
      <Box position={"absolute"} right={'0'}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<BsThreeDotsVertical />}
            variant="ghost"
          />
          <MenuList>
            <MenuItem icon={<AiOutlineEdit />}>
             Edit
            </MenuItem>
            <MenuItem icon={<FiDelete />}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  }
  return (
    <>
    {mounted ? (
        <Center width={"100%"}>
            <Flex w={"600px"} alignItems={"center"} flexDirection={"column"}>
                <FriendInfo />
                <EventList/>
            </Flex>
      </Center>
    ):(<></>)}
    </>
  );
}
