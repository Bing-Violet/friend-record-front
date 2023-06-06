import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import axios from "axios";
import { customAxios } from "@/components/customAxios";
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
  IconButton,
  StackDivider,
  CloseButton,
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
import { BsThreeDotsVertical, BsCheck2Square } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import {
  RiCreativeCommonsZeroLine,
  RiSettings4Line,
  RiEdit2Line,
} from "react-icons/ri";
import AppContext from "@/components/globalContext";

function EditableField({ friend, func }) {
  const [editedName, setEditedName] = useState("");
  const [editIsOpen, setEditIsOpen] = useState(false);
  useEffect(() => {
    setEditedName(friend.name);
  }, [editIsOpen]);
  const handleChange = (event) => {
    setEditedName(event.target.value), console.log(editedName);
  };
  function editFunc() {
    if(friend.name===editedName||!editedName) {
      setEditIsOpen(!editIsOpen);
    } else {
      func({name:editedName, id:friend.id})
      friend.name = editedName
      setEditIsOpen(!editIsOpen);
    }
  }
  const editOrCheckIcon = editIsOpen ? (
    <BsCheck2Square
      color={friend.name===editedName||!editedName?"#ef7a67":"#00b01a"}
      onClick={() => {
        editFunc()
      }}
    />
  ) : (
    <RiEdit2Line
      color={"#00b01a"}
      onClick={() => {
        setEditIsOpen(!editIsOpen);
      }}
      ml={"0.3rem"}
    />
  );
  let markup;
  if (editIsOpen) {
    console.log("CHANGE");
    markup = (
      <>
      <FormControl isInvalid={!editedName}>
      <Input
          value={editedName}
          onChange={handleChange}
          isInvalid={!editedName}
          placeholder="Must not be empty!"
          _placeholder={{'color':'red'}}
          focusBorderColor={editedName?'':'red.300'}
          size="sm"
        />
      </FormControl>

        {editOrCheckIcon}
      </>
    );
  } else {
    console.log("ELSE");
    markup = (
      <>
        {friend.name}
        {editOrCheckIcon}
      </>
    );
  }
  return markup;
}

export default function FriendDetail() {
  const cookies = new Cookies();
  const router = useRouter();
  const context = useContext(AppContext);
  const [friend, setFriend] = useState("");
  const [events, setEvents] = useState("");
  const [mounted, setMounted] = useState(false);
  const [slug, setSlug] = useState("");
  const toastFun = context.addToast;
  useEffect(() => {
    if (context.user && router.query.slug) {
      console.log("event", context.friends, router.query.slug);
      if (!context.friends.length) {
        getFriend();
      } else {
        const f = context.friends.find((f) => f.id == router.query.slug);
        setFriend(f);
        setEvents(f.event);
      }
    } else if (!slug) {
      setSlug(router.query.slug);
    }
    setMounted(true);
  }, [router.query.slug]); //why set router? this is for reloading.

  async function getFriend() {
    customAxios
      .get(`/api/character/character-detail/${router.query.slug}`)
      .then((res) => {
        setFriend(res.data);
        setEvents(res.data.event);
      })
      .catch((e) => {});
  }
  function friendNameEdit({...props}) {
    console.log(props)
    customAxios
      .patch(`/api/character/character-detail/${props.id}`, {
        name: props.name
      })
      .then((res) => {
        console.log("THEM IN EDDIT", res.data);
        const newEvents = context.friends.map((e) => {
          if (e.id === props.id) {
            e.name = props.name;
            return e;
          } else {
            return e;
          }
        });
        context.setFriends([...newEvents]);
        toastFun({
          title: "Your event is updated!",
          description: `Your event ${friend.name} is successfully updated!`,
          status: "success",
        });
      })
      .catch((e) => {
        console.log(e);
        toastFun({
          title: "Failed!",
          description: `Something bad happened. Please try later!`,
          status: "error",
        });
      });
  }
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
    const outerRef = useRef();
    const innerRef = useRef();
    useEffect(() => {
      if (typeof innerRef.current !== "undefined") {
        outerRef.current.style.height =
          innerRef.current.offsetHeight + 32 + "px"; //32 is half of the image
      }
    }, [innerRef.current]);
    function amountCalculation(eventList, sub) {
      // eventList is array, sub will be paied or bePaied
      console.log(sub !== "paied");
      const acceptedSubs = ["paied", "bePaied"];
      let paied = 0;
      let bePaied = 0;
      eventList.forEach((e) => {
        console.log(e);
        const money = Number(e.money);
        paied += money > 0 ? money : 0;
        bePaied += money < 0 ? money : 0;
      });
      if (acceptedSubs.includes(sub)) {
        return sub === "paied" ? paied : bePaied;
      } else {
        throw "sub must be paied or bePaied";
      }
    }
    function Header({ children }) {
      return (
        <Box w={"100%"} ref={outerRef}>
          <Flex position={"relative"} justifyContent={"center"} w={"100%"}>
            <Box zIndex={1}>
              <Avatar size="lg" />
            </Box>
            <Box w={"100%"} position={"absolute"} top={"50%"} ref={innerRef}>
              {children}
            </Box>
          </Flex>
        </Box>
      );
    }
    // const [editIsOpen, setEditIsOpen] = useState(false);
    // let editOrCheckIcon = editIsOpen ? (
    //   <BsCheck2Square color={'#ef7a67'} onClick={() => {
    //     setEditIsOpen(!editIsOpen);
    //   }}/>
    // ) : (
    //   <RiEdit2Line
    //   color={'#00b01a'}
    //     onClick={() => {
    //       setEditIsOpen(!editIsOpen);
    //     }}
    //     ml={"0.3rem"}
    //   />
    // );
    return (
      <>
        {Object.keys(friend).length ? (
          <Header>
            <Card
              color={"gray"}
              border={"solid #898686"}
              w={"100%"}
              overflow={"hidden"}
              position={"relative"}
            >
              <FriendDeletePopover id={friend.id} friendName={friend.name} />
              <CardBody w={"100%"} pt={"0.2rem"}>
                <Stack
                  divider={<StackDivider />}
                  spacing={{ base: "1", md: "4" }}
                >
                  <Flex w={"100%"} justifyContent={"center"}>
                    <VStack
                      align="stretch"
                      fontWeight={"bold"}
                      spacing={"0.5rem"}
                    >
                      <Flex alignItems={"center"}>
                        <Text mr={"0.3rem"}>Name :</Text>
                        <Box w={"50%%"} h={"100%"}>
                          <Flex alignItems={"center"} position={"absolute"}>
                            <EditableField friend={friend} func={friendNameEdit} />
                          </Flex>
                        </Box>
                      </Flex>
                      <Text>Last_log : {dateConvert(friend.last_log)}</Text>
                    </VStack>
                  </Flex>
                  <Flex
                    alignItems={"center"}
                    fontWeight={"bold"}
                    flexDirection={"column"}
                  >
                    <Text fontSize={"1.5rem"}>TOTAL : ${friend.sum}</Text>
                    <Flex w={"100%"} mt={{ md: "1rem" }}>
                      <Box textAlign={"center"} flexBasis={"50%"}>
                        <Text color={"#008dff"}>I PAIED</Text>
                        <Text>${amountCalculation(events, "paied")}</Text>
                      </Box>
                      <Box textAlign={"center"} flexBasis={"50%"}>
                        <Text color={"#ff4d76"}>They PAIED</Text>
                        <Text>${amountCalculation(events, "bePaied")}</Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          </Header>
        ) : (
          <>
            <Spinner />
          </>
        )}
      </>
    );
  }
  function EventList() {
    const listRef = useRef();
    const [maxH, setMaxH] = useState(0);
    useEffect(() => {
      console.log("USE_effect in detail");
      if (typeof window !== "undefined") {
        console.log("NOT UNDEFINED");
        const lisrect = listRef.current.getBoundingClientRect();
        console.log("rec", lisrect, window.innerHeight);
        setMaxH(window.innerHeight - lisrect.top - 48);
      }
    }, []);
    function colorHandler(amount) {
      if (amount > 0) {
        return "#e4feff";
      } else if (amount < 0) {
        return "#ffddea";
      } else {
        return "#ffffe0";
      }
    }
    return (
      <Box
        w={"99%"}
        fontWeight={"bold"}
        ref={listRef}
        maxH={maxH}
        overflowY={events.length > 1 ? "scroll" : "none"}
        overflowX={events.length > 1 ? "hidden" : "none"}
      >
        {events.length ? (
          <>
            {events.map((e, index) => (
              <Card
                border={"solid #ffddf9"}
                position={"relative"}
                key={index}
                mt={"0.3rem"}
                minW={"100%"}
                bg={colorHandler(e.money)}
              >
                <EditPopover eventName={e.name} money={e.money} id={e.id} />
                <CardBody>
                  <Flex alignItems={"center"}>
                    <VStack align="stretch" color={"gray"}>
                      <Text>Event-Name : {e.name}</Text>
                      <Text>Ammount : ${e.money}</Text>
                      <Text>Created : {dateConvert(e.created_on)}</Text>
                    </VStack>
                  </Flex>
                </CardBody>
                <DeletePopover id={e.id} eventName={e.name} />
              </Card>
            ))}
          </>
        ) : (
          <></>
        )}
      </Box>
    );
  }
  function FriendDeletePopover({ id, friendName }) {
    const router = useRouter();
    function deleteEvent() {
      customAxios
        .delete(`/api/character/character-detail/${id}`)
        .then((res) => {
          //need to change character data
          const newEvents = context.friends.filter((e) => e.id !== id);
          // setSearchFriend([...newEvents]);
          context.setFriends([...newEvents]);
          router.push({
            pathname: "/",
          });
          toastFun({
            title: "Your event is deleted!",
            description: `Your friend ${friendName} is successfully deleted!`,
            status: "success",
          });
        })
        .catch((e) => {
          console.log("Error", e);
          toastFun({
            title: "Failed!",
            description: `Something bad happened. Please try later!`,
            status: "error",
          });
        });
    }
    return (
      <>
        <Popover>
          <PopoverTrigger>
            <Flex as={Flex} justifyContent={"flex-end"}>
              <CloseButton color={"#ff7373"} size="md" />
            </Flex>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              bg="gray"
              color="white"
              border={"0.1rem solid #ff7070"}
            >
              <PopoverHeader fontWeight={"bold"}>Confirmation</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Flex alignItems={"center"}>
                  <Text fontWeight={"bold"} flexBasis={"50%"}>
                    Delete {friendName}?
                  </Text>
                  <Flex flexBasis={"50%"} justifyContent={"flex-end"}>
                    <Button
                      bg={"white"}
                      onClick={deleteEvent}
                      colorScheme="red"
                      variant="outline"
                    >
                      Delete
                    </Button>
                  </Flex>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </>
    );
  }
  function DeletePopover({ id, eventName }) {
    function deleteEvent() {
      customAxios
        .delete(`/api/event/event-detail/${id}`)
        .then((res) => {
          //need to change character data
          const newEvents = events.filter((e) => e.id !== id);
          events.forEach((e) => {
            if (e.id === id) {
              friend.sum -= e.money;
            }
          });
          setEvents([...newEvents]);
          toastFun({
            title: "Event deleted!",
            description: `Your event ${eventName} is successfully deleted!`,
            status: "success",
          });
        })
        .catch((e) => {
          toastFun({
            title: "Failed!",
            description: `Something bad happened. Please try later!`,
            status: "error",
          });
        });
    }
    return (
      <>
        <Popover>
          <PopoverTrigger>
            <Center>
              <Button
                variant="outline"
                colorScheme="red"
                mt={"-1.2rem"}
                mb={"0.3rem"}
                w={"5rem"}
              >
                delete
              </Button>
            </Center>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              bg="gray"
              color="white"
              border={"0.1rem solid #ff7070"}
            >
              {/* <PopoverArrow /> */}
              <PopoverHeader fontWeight={"bold"}>Confirmation</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Flex alignItems={"center"}>
                  <Text fontWeight={"bold"} flexBasis={"50%"}>
                    Are You Sure?
                  </Text>
                  <Flex flexBasis={"50%"} justifyContent={"flex-end"}>
                    <Button
                      bg={"white"}
                      onClick={deleteEvent}
                      colorScheme="red"
                      variant="outline"
                    >
                      Delete
                    </Button>
                  </Flex>
                </Flex>
              </PopoverBody>
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
        customAxios
          .patch(`/api/event/event-detail/${id}`, {
            name: !editedEventName ? eventName : editedEventName,
            money: editedMoney !== "default" ? editedMoney : money,
          })
          .then((res) => {
            const updatedName = !editedEventName ? eventName : editedEventName;
            if (editedMoney !== "default") {
              friend.sum += editedMoney - money;
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
            toastFun({
              title: "Event updated!",
              description: `Your event ${eventName} is successfully updated!`,
              status: "success",
            });
            onCancel();
          })
          .catch((e) => {
            console.log("ERROR", e);
            // context.getAccessTokenFromRefreshToken(e, saveFunc)
            toastFun({
              title: "Failed!",
              description: `Something bad happened. Please try later!`,
              status: "error",
            });
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
          placement="left"
          closeOnBlur={false}
          isLazy
        >
          <PopoverTrigger>
            <IconButton
              color={"gray"}
              bg={"none"}
              size="md"
              _hover={{ bg: "none", color: "darkgray" }}
              icon={<RiSettings4Line />}
            />
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
          <Flex w={"100%"} alignItems={"center"} flexDirection={"column"}>
            <FriendInfo />
            <EventCreate
              slug={router.query.slug}
              friend={friend}
              events={events}
              setEvents={setEvents}
            />
            <EventList />
          </Flex>
        </Center>
      ) : (
        <></>
      )}
    </>
  );
}
