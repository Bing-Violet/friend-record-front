import axios from "axios";
import { customAxios } from "./customAxios";
import Cookies from "universal-cookie";
import Link from "next/link";
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
  FormErrorMessage
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

function Search({ searchFriend, setSearchFriend, context }) {
  const [keyword, setKeyword] = useState("");
  const handleChange = (event) => {
    setKeyword(event.target.value);
    const searchedF = context.friends.filter((f) =>
      f.name.includes(event.target.value)
    );
    if(context.friends.length) {
      setSearchFriend([...searchedF]);
    }
  };
  return (
    <>
     <FormControl isInvalid={!context.friends.length}>
        <FormLabel>Search</FormLabel>
      <Input
        value={keyword}
        onChange={handleChange}
        placeholder="search"
        size="sm"
      ></Input>
      <FormErrorMessage>no friend to search.</FormErrorMessage>
       </FormControl>
    </>
  );
}

export default function FriendList({ User, toastFun }) {
  const context = useContext(AppContext);
  const [searchFriend, setSearchFriend] = useState([]);
  useEffect(() => {
    console.log("INLIST", context.friends)
    setSearchFriend([...context.friends]);
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

  function DeletePopover({ id, eventName, toastFun }) {
    function deleteEvent() {
      customAxios.delete(`/api/character/character-detail/${id}`)
        .then((res) => {
          //need to change character data
          const newEvents = searchFriend.filter((e) => e.id !== id);
          setSearchFriend([...newEvents]);
          context.setFriends([...newEvents]);
          toastFun({title:'Your event is deleted!',description:`Your event ${eventName} is successfully deleted!`, status:'success' })
        })
        .catch((e) => {
          toastFun({title:'Failed!',description:`Something bad happened. Please try later!`, status:'error' })
        });
    }
    return (
      <>
        <Popover>
          <PopoverTrigger>
            <Button background={"red.700"} color={"red.100"}>
              DELETE
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent background={"pink.400"}>
              <PopoverArrow />
              <PopoverHeader>Confirmation</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>are you sure?</PopoverBody>
              <PopoverFooter textAlign={"center"}>
                <Button onClick={deleteEvent} colorScheme="blue">
                  Delete
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </>
    );
  }

  function EditPopover({ eventName, money, id, toastFun }) {
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
      const [isDisabled, setIsDisabled] = useState(true);

      const eventHandleChange = (event) => {
        setEditedEventName(event.target.value), setIsDisabled(false);
      };
      function saveFunc() {
        axios({
          method: "patch",
          url: `/api/character/character-detail/${id}`,
          data: {
            name: !editedEventName ? eventName : editedEventName,
          },
        })
          .then((res) => {
            const updatedName = !editedEventName ? eventName : editedEventName;

            const newEvents = searchFriend.map((e) => {
              if (e.id === id) {
                e.name = updatedName;
                return e;
              } else {
                return e;
              }
            });
            setSearchFriend([...newEvents]);
            toastFun({title:'Your event is updated!',description:`Your event ${eventName} is successfully updated!`, status:'success' })
            onCancel();
          })
          .catch((e) => {
            toastFun({title:'Failed!',description:`Something bad happened. Please try later!`, status:'error' })
            console.log("error", e);
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
              <EditPopover eventName={f.name} id={f.id} toastFun={toastFun} />
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
              <DeletePopover id={f.id} eventName={f.name} toastFun={toastFun} />
            </Card>
          ))}
        </>
      ) : (
        <>NO</>
      )}
    </>
  );
}
