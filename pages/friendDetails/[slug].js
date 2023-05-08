import { useState, useEffect, useRef, forwardRef, useContext } from "react";
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
  Stack,
  FocusLock,
  FormControl,
  FormLabel,
  Input,
  IconButton
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
  Portal
} from "@chakra-ui/react";

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";

import EventCreate from "@/components/eventCreate";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { FiDelete } from "react-icons/fi";
import AppContext from "@/components/globalContext";

export default function FriendDetail({ user }) {
  const router = useRouter();
  const context = useContext(AppContext);
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
          setEvents(res.data.event);
          console.log("res_slug", res.data, events);
          setMounted(true);
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
              <Card position={"relative"} key={index} mb={"1rem"} minW={"100%"}>
                <EditPopover eventName={e.name} money={e.money} id={e.id} />
                <CardBody>
                  <Flex alignItems={"center"}>
                    <VStack align="stretch">
                      <Text>Event-Name : {e.name}</Text>
                      <Text>Money : ${e.money}</Text>
                      <Text>Created : {dateConvert(e.created_on)}</Text>
                    </VStack>
                  </Flex>
                </CardBody>
                <DeletePopover id={e.id}/>
              </Card>
            ))}
            <EventCreate
              slug={router.query.slug}
              friend={friend}
              events={events}
              setEvents={setEvents}
            />
          </>
        ) : (
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Text>No Event To Show</Text>
            <EventCreate
              slug={router.query.slug}
              friend={friend}
              events={events}
              setEvents={setEvents}
            />
          </Flex>
        )}
      </Box>
    );
  }

  function DeletePopover({id}) {
    function deleteEvent() {
      axios({
        method: "delete",
        url: `/api/event/event-detail/${id}`,
      })
        .then((res) => {
           //need to change character data
          const newEvents = events.filter(e => e.id !== id);
          events.forEach((e) => {
            if(e.id===id) {
              friend.sum -= e.money
            }
          })
          setEvents([...newEvents]);
          onCancel();
        })
        .catch((e) => {
          console.log("error", e);
        });
    }
    return (
      <>
        <Popover>
          <PopoverTrigger>
            <Button background={'red.700'} color={'red.100'}>DELETE</Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent background={'pink.400'}>
              <PopoverArrow />
              <PopoverHeader>Confirmation</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                are you sure? 
              </PopoverBody>
              <PopoverFooter textAlign={'center'}>
              <Button onClick={deleteEvent} colorScheme="blue">Delete</Button>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </>
    );
  }

  function EditPopover({ eventName, money, id }) {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const firstFieldRef = useRef(null);
    const TextInput = forwardRef((props, ref) => {
      return (
        <FormControl>
          <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
          <Input ref={ref} id={props.id} {...props} />
        </FormControl>
      );
    });

    const Form = ({ firstFieldRef, onCancel }) => {
      const [editedEventName, setEditedEventName] = useState("");
      const [editedMoney, setEditedMoney] = useState("default");
      const [isDisabled, setIsDisabled] = useState(true);

      const eventHandleChange = (event) => {
        setEditedEventName(event.target.value), setIsDisabled(false);
      };
      const moneyHandleChange = (event) => {
        setEditedMoney(event), setIsDisabled(false);
      };
      function saveFunc() {
        console.log(eventName, editedEventName, editedMoney, typeof money);
        axios({
          method: "patch",
          url: `/api/event/event-detail/${id}`,
          data: {
            name: !editedEventName ? eventName : editedEventName,
            money: editedMoney !== "default" ? editedMoney : money,
          },
        })
          .then((res) => {
            const  updatedName = !editedEventName ? eventName : editedEventName
            if(editedMoney !== "default") {
              friend.sum += editedMoney - money
            }
            
            const newEvents = events.map((e) => {
              if (e.id === id) {
                (e.name = updatedName),
                  (e.money = editedMoney !== "default" ? editedMoney : money);
                return e;
              } else {
                return e;
              }
            });
            setEvents([...newEvents]);
            onCancel();
          })
          .catch((e) => {
            console.log("error", e);
            setApiError(true);
          });
      }
      return (
        <Stack spacing={4}>
          <TextInput
            label="Event name"
            id="first-name"
            ref={firstFieldRef}
            defaultValue={eventName}
            onChange={eventHandleChange}
          />
          <Box>Money</Box>
          <NumberInput
            size="md"
            maxW={40}
            onChange={moneyHandleChange}
            defaultValue={money}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <ButtonGroup display="flex" justifyContent="flex-end">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              isDisabled={isDisabled}
              onClick={saveFunc}
              colorScheme="teal"
            >
              Save
            </Button>
          </ButtonGroup>
        </Stack>
      );
    };

    return (
      <Box position={"absolute"} right={"0"}>
        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          placement="right"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <IconButton size="sm" icon={<AiOutlineEdit />} />
          </PopoverTrigger>
          <PopoverContent p={5}>
            <FocusLock returnFocus persistentFocus={false}>
              <PopoverArrow />
              <PopoverCloseButton />
              <Form firstFieldRef={firstFieldRef} onCancel={onClose} />
            </FocusLock>
          </PopoverContent>
        </Popover>
      </Box>
    );
  }
  return (
    <>
      {mounted ? (
        <Center width={"100%"}>
          <Flex w={"600px"} alignItems={"center"} flexDirection={"column"}>
            <FriendInfo />
            <EventList />
          </Flex>
        </Center>
      ) : (
        <></>
      )}
    </>
  );
}
