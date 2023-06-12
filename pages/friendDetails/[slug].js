import { useState, useEffect, useRef, forwardRef, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { customAxios } from "@/components/customAxios";
import {
  Button,
  ButtonGroup,
  Center,
  VStack,
  Flex,
  Text,
  Box,
  Stack,
  FocusLock,
  FormControl,
  FormLabel,
  Input,
  StackDivider,
  CloseButton,
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
import { Card, CardBody } from "@chakra-ui/react";
import { BsCheck2Square } from "react-icons/bs";
import { RiSettings4Line, RiEdit2Line } from "react-icons/ri";
import AppContext from "@/components/globalContext";
import { eventIcons, getIconObj } from "@/components/iconsSlides/icons";
import SlideIcons from "@/components/iconsSlides/slideIcons";
import CustomSpinner from "@/components/spinner";
import { avatars, getAvaterObj } from "@/components/iconsSlides/avatars";
import { dateConvert } from "@/utils";
import { EditableInput } from "@/components/customForms/editableInput";
import { Who } from "@/components/eventCreate";

function EditableField({ friend, func }) {
  const [editedName, setEditedName] = useState("");
  const [editIsOpen, setEditIsOpen] = useState(false);
  useEffect(() => {
    setEditedName(friend.name);
  }, [editIsOpen]);
  const handleChange = (event) => {
    setEditedName(event.target.value);
  };
  function editFunc() {
    if (friend.name === editedName || !editedName) {
      setEditIsOpen(!editIsOpen);
    } else {
      func({ name: editedName, id: friend.id });
      friend.name = editedName;
      setEditIsOpen(!editIsOpen);
    }
  }
  const editOrCheckIcon = editIsOpen ? (
    <BsCheck2Square
      color={friend.name === editedName || !editedName ? "#ef7a67" : "#00b01a"}
      onClick={() => {
        editFunc();
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
    markup = (
      <>
        <FormControl isInvalid={!editedName}>
          <Input
            value={editedName}
            onChange={handleChange}
            isInvalid={!editedName}
            placeholder="Must not be empty!"
            _placeholder={{ color: "red" }}
            focusBorderColor={editedName ? "" : "red.300"}
            size="sm"
          />
        </FormControl>

        {editOrCheckIcon}
      </>
    );
  } else {
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
  const router = useRouter();
  const context = useContext(AppContext);
  const [friend, setFriend] = useState("");
  const [events, setEvents] = useState("");
  const [mounted, setMounted] = useState(false);
  const [slug, setSlug] = useState("");
  const editableInputRef = useRef(null);
  const toastFun = context.addToast;
  useEffect(() => {
    if (context.user && router.query.slug && context) {
      if (!context.friends.length) {
        const asyncGetFriend = async () => {
          context.setIsLoading(true);
          await getFriend().then(() => context.setIsLoading(false));
        };
        asyncGetFriend();
      } else {
        const f = context.friends.find((f) => f.id == router.query.slug);
        setFriend(f);
        setEvents(f.event);
      }
    } else if (!slug) {
      setSlug(router.query.slug);
    }
    return setMounted(true);
  }, []); //why set router? this is for reloading.

  async function getFriend() {
    customAxios
      .get(`/api/character/character-detail/${router.query.slug}`)
      .then((res) => {
        setFriend(res.data);
        setEvents(res.data.event);
      })
      .catch((e) => {});
  }
  function friendUpdate({ ...props }) {
    const id = friend.id;
    customAxios
      .patch(`/api/character/character-detail/${friend.id}`, props)
      .then((res) => {
        const newEvents = context.friends.map((e) => {
          if (e.id === id) {
            e = res.data;
            friend.avatar = props.avatar ? props.avatar : friend.avatar;
            friend.name = props.name ? props.name : friend.name;
            return e;
          } else {
            return e;
          }
        });
        context.setFriends([...newEvents]);
        toastFun({
          title: "Your friend is updated!",
          description: `Your friend ${friend.name} is successfully updated!`,
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
      const acceptedSubs = ["paied", "bePaied"];
      let paied = 0;
      let bePaied = 0;
      eventList.forEach((e) => {
        const money = Number(e.money);
        paied += money > 0 ? money : 0;
        bePaied += money < 0 ? money : 0;
      });
      if (acceptedSubs.includes(sub)) {
        return sub === "paied" ? paied : bePaied * -1;
      } else {
        throw "sub must be paied or bePaied";
      }
    }
    function friendNameUpdate() {
      friendUpdate({ name: editableInputRef.current });
    }
    function Header({ children }) {
      const { onOpen, onClose, isOpen } = useDisclosure();
      const [avatar, setAvatar] = useState("");
      const [isDisabled, setIsDisabled] = useState(true);
      useEffect(() => {
        if (avatar) {
          if (friend.avatar !== avatar.name) {
            setIsDisabled(false);
          } else {
            setIsDisabled(true);
          }
        }
      }, [avatar]);
      return (
        <Box w={"100%"} ref={outerRef}>
          <Flex position={"relative"} justifyContent={"center"} w={"100%"}>
            <Box zIndex={1}>
              <Box
                position={"relative"}
                w={"70px"}
                h={"70px"}
                mr={"1rem"}
                border={"solid gray"}
                borderRadius={"50vh"}
                bg={"#cfcfcf"}
              >
                {getAvaterObj(friend.avatar)().icon}
                <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                  <PopoverTrigger>
                    <Box
                      position={"absolute"}
                      right={-6}
                      bottom={0}
                      border={"solid gray"}
                      borderRadius={"4px"}
                      p={"0 0.2rem"}
                      fontSize={"0.5rem"}
                      transition={".3s"}
                      _hover={{ bg: "#dadada", color: "gray" }}
                    >
                      Edit
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent p={5}>
                    <PopoverCloseButton />
                    <SlideIcons
                      iconArray={avatars}
                      setIcon={setAvatar}
                      defaultIcon={getAvaterObj(friend.avatar)}
                    />
                    <ButtonGroup display="flex" justifyContent="flex-end">
                      <Button variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        isDisabled={isDisabled}
                        onClick={() => friendUpdate({ avatar: avatar.name })}
                        colorScheme="teal"
                      >
                        Save
                      </Button>
                    </ButtonGroup>
                  </PopoverContent>
                </Popover>
              </Box>
            </Box>
            <Box w={"100%"} position={"absolute"} top={"50%"} ref={innerRef}>
              {children}
            </Box>
          </Flex>
        </Box>
      );
    }
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
                            <EditableInput
                              ref={editableInputRef}
                              value={friend.name}
                              func={friendNameUpdate}
                            />
                            {/* <EditableField
                              friend={friend}
                              func={friendUpdate}
                            /> */}
                          </Flex>
                        </Box>
                      </Flex>
                      <Text>
                        Last interaction : {dateConvert(friend.last_log)}
                      </Text>
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
                        <Text color={"#008dff"}>I PAID</Text>
                        <Text>${amountCalculation(events, "paied")}</Text>
                      </Box>
                      <Box textAlign={"center"} flexBasis={"50%"}>
                        <Text color={"#ff4d76"}>They PAID</Text>
                        <Text>${amountCalculation(events, "bePaied")}</Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          </Header>
        ) : (
          <></>
        )}
      </>
    );
  }
  function EventList() {
    const listRef = useRef();
    const [maxH, setMaxH] = useState(0);
    const props = () => {
      return {
        w: "50px",
        h: "50px",
        fontSize: "3rem",
      };
    };
    useEffect(() => {
      if (typeof window !== "undefined") {
        const lisrect = listRef.current.getBoundingClientRect();
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
                <Flex position={"absolute"} right={0}>
                  <DeletePopover id={e.id} eventName={e.name} />
                  <EditPopover
                    eventName={e.name}
                    money={e.money}
                    id={e.id}
                    defaultIcon={getIconObj(e.icon)}
                  />
                </Flex>
                <CardBody>
                  <Flex alignItems={"center"}>
                    <Flex
                      w={"50px"}
                      h={"50px"}
                      position={"relative"}
                      border={"solid #69696B"}
                      borderRadius={"20px"}
                      boxShadow="2xl"
                      mr={"0.5rem"}
                      justifyContent={"center"}
                      bg={"#919191bf"}
                      alignItems={"center"}
                    >
                      {getIconObj(e.icon)().icon}
                    </Flex>

                    <VStack align="stretch" color={"gray"}>
                      <Text>Event Name : {e.name}</Text>
                      <Text>Amount : ${e.money}</Text>
                      <Text>Created : {dateConvert(e.created_on)}</Text>
                    </VStack>
                  </Flex>
                </CardBody>
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
          toastFun({
            title: "Failed!",
            description: `Something bad happened. Please try later!`,
            status: "error",
          });
        });
    }
    return (
      <>
        <Popover placement="left">
          <Flex as={Flex} justifyContent={"flex-end"}>
            <PopoverTrigger>
              <CloseButton color={"#ff7373"} size="md" />
            </PopoverTrigger>
          </Flex>
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
              <CloseButton
                color={"#ff7373"}
                size="md"
                _hover={{ bg: "none" }}
              />
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

  function EditPopover({ eventName, money, setMoney, id, defaultIcon }) {
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
      const [icon, setIcon] = useState({});
      const whoRef = useRef(null);
      useEffect(() => {
        if (typeof icon !== "undefined" && Object.keys(icon).length) {
          if (defaultIcon().name !== icon.name) {
            setIsDisabled(false);
          }
        }
      }, [icon]);
      const eventHandleChange = (event) => {
        setEditedEventName(event.target.value), setIsDisabled(false);
      };
      const moneyHandleChange = (event) => {
        setEditedMoney(event), setIsDisabled(false);
      };
      function saveFunc() {
        const iconName = icon.name;
        function moneyCalculation() {
          if(editedMoney !== "default") {
            if(whoRef.current !== null) {
              if(Number(whoRef.current)===0 && money <= 0||Number(whoRef.current)===1 && money >= 0) {
                return money >= 0?editedMoney*-1:editedMoney
              } else {
                return editedMoney
              }
            } else {
              return editedMoney
            }
          } else {
            if(whoRef.current !== null) {
              if(Number(whoRef.current)===0 && money <= 0||Number(whoRef.current)===1 && money >= 0) {
                return money*-1
              } else {
                return money
              }
            } else {
              return money
            }
          }
        }
        customAxios
          .patch(`/api/event/event-detail/${id}`, {
            name: !editedEventName ? eventName : editedEventName,
            money: moneyCalculation(),
            icon: iconName,
          })
          .then((res) => {
            const updatedName = !editedEventName ? eventName : editedEventName;
            friend.sum += res.data.money - money

            const newEvents = events.map((e) => {
              if (e.id === id) {
                (e.name = updatedName),
                  (e.money = moneyCalculation());
                e.icon = iconName;
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
            toastFun({
              title: "Failed!",
              description: `Something bad happened. Please try later!`,
              status: "error",
            });
          });
      }
      return (
        <Stack spacing={4}>
          <SlideIcons
            iconArray={eventIcons}
            setIcon={setIcon}
            defaultIcon={defaultIcon}
          />
          <Box position={'relative'}>
            <Box position={'absolute'} top={-6}>
            <TextInput
            // label="Event name"
            id="first-name"
            ref={firstFieldRef}
            defaultValue={eventName}
            onChange={eventHandleChange}
          />
            </Box>
          </Box>
          <Box position={'relative'} h={'1.5rem'}>
            <Box position={'absolute'} top={1.5}>
            <Who disabledFun={setIsDisabled} defaultVal={money>=0?'0':'1'} ref={whoRef} />
            </Box>
          </Box>
          <NumberInput
            size="md"
            maxW={40}
            m={0}
            onChange={moneyHandleChange}
            defaultValue={money <=0?money*-1:money}
          >
            <NumberInputField top={0} />
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
      <>
        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          placement="left"
          isLazy
        >
          <PopoverTrigger>
            <Box mt={"0.5rem"} mr={"0.5rem"}>
              <RiSettings4Line
                cursor={"pointer"}
                color={"gray"}
                bg={"none"}
                m={0}
                _hover={{ bg: "none", color: "darkgray" }}
              />
            </Box>
          </PopoverTrigger>
          <PopoverContent p={5}>
            <FocusLock returnFocus persistentFocus={false}>
              <PopoverArrow />
              <PopoverCloseButton />
              <Form firstFieldRef={firstFieldRef} onCancel={onClose} />
            </FocusLock>
          </PopoverContent>
        </Popover>
      </>
    );
  }

  let markup = (
    <Center width={"100%"} overflow={"hidden"}>
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
  );

  return (
    <>
      {!context.isLoading && Object.keys(friend).length ? (
        <>{markup}</>
      ) : (
        <CustomSpinner />
      )}
    </>
  );
}
