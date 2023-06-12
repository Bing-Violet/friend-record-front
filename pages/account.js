import { customAxios } from "@/components/customAxios";
import Cookies from "universal-cookie";
import { useState, useEffect, useContext, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useEditableControls,
} from "@chakra-ui/react";
import {
  Button,
  IconButton,
  ButtonGroup,
  Wrap,
  WrapItem,
  Center,
  Flex,
  Box,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  VStack,
  Text,
  Avatar,
  Stack,
  StackDivider,
  useDisclosure,
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

import Logout from "@/components/logout";
import AppContext from "@/components/globalContext";
import { useRouter } from "next/router";
import { FaPeopleArrows } from "react-icons/fa";
import { HiUsers, HiUser, HiMail, HiOutlineLockClosed } from "react-icons/hi";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { MdCalendarMonth } from "react-icons/md";
import Theme from "@/components/theme";
import { getAvaterObj, avatars } from "@/components/iconsSlides/avatars";
import SlideIcons from "@/components/iconsSlides/slideIcons";
import { EditableInput } from "@/components/customForms/editableInput";
import CustomSpinner from "@/components/spinner";
import { monthColors } from "@/styles/colors";

export default function Account() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState("");
  const addToast = context.addToast;
  const userNameRef = useRef(null);
  useEffect(() => {
    if (context) {
      setUser(context.user);
      if (Object.keys(router.query).length && !mounted) {
        toastAction(router.query.code);
      }
      router.query = "";
      return setMounted(true);
    }
  }, []);
  function toastAction(query) {
    // 'password-change'
    // 'login'
    console.log("CH", query);
    const obj = {
      title: query === "login" ? "Logged in!" : "Password changed!",
      description:
        query === "login"
          ? "You are successfully logged in!"
          : "Password is successfully changed!",
      status: "success",
    };
    addToast(obj);
  }
  async function updateUser({ ...props }) {
    customAxios
      .patch(`/api/user/user-detail/${user.UID}`, props)
      .then((res) => {
        setUser(res.data);
        const cookies = new Cookies();
        cookies.set("user", res.data, { path: "/" });
        addToast({
          title: "Your account is updated!",
          description: `Your account ${user.username} is successfully updated!`,
          status: "success",
        });
      })
      .catch((e) => {
        addToast({
          title: "Failed!",
          description: `Something bad happened. Please try later!`,
          status: "error",
        });
      });
  }
  function editUser() {
    updateUser({ username: userNameRef.current });
  }
  function EditIcon() {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const [avatar, setAvatar] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    useEffect(() => {
      if (typeof avatar !== "undefined" && Object.keys(avatar).length) {
        if (user) {
          if (user.avatar !== avatar.name) {
            setIsDisabled(false);
          }
        } else {
          setIsDisabled(false);
        }
      }
    }, [avatar]);
    return (
      <Box w={"100%"}>
        <Flex position={"relative"} justifyContent={"center"} w={"100%"}>
          <Box zIndex={1}>
            <Box
              position={"relative"}
              w={"96px"}
              h={"96px"}
              mr={"1rem"}
              border={"solid gray"}
              borderRadius={"50vh"}
              bg={"#cfcfcf"}
            >
              {!user.avatar ? (
                <>
                  <Avatar size={"xl"} />
                </>
              ) : (
                <>{getAvaterObj(user.avatar)().icon}</>
              )}
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
                  {/* <PopoverArrow /> */}
                  <PopoverCloseButton />
                  <SlideIcons
                    iconArray={avatars}
                    setIcon={setAvatar}
                    defaultIcon={getAvaterObj(user.avatar)}
                  />
                  <ButtonGroup display="flex" justifyContent="flex-end">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      isDisabled={isDisabled}
                      onClick={() =>
                        updateUser({ UID: user.UID, avatar: avatar.name })
                      }
                      colorScheme="teal"
                    >
                      Save
                    </Button>
                  </ButtonGroup>
                </PopoverContent>
              </Popover>
            </Box>
          </Box>
          <Box w={"100%"} position={"absolute"} top={"50%"}></Box>
        </Flex>
      </Box>
    );
  }

  function CustomField({ icon, header, text }) {
    return (
      <>
        <Flex w={"100%"} mt={"0.5rem"}>
          <Flex alignItems={"center"} justifyContent={"center"} mr={"1rem"}>
            {icon}
          </Flex>
          <Stack w={"100%"} spacing="-8px">
            <Text fontWeight={"bold"}>{header}</Text>
            <Box height={"20px"}>
              <Text w={"40%"} color={"gray"} position={"absolute"}>
                {text}
              </Text>
            </Box>
          </Stack>
        </Flex>
      </>
    );
  }
  function FriendInfo() {
    const date = new Date(Date.now());
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const MonthlyStates = {
      SPENT: "spent",
      RECEIVED: "received",
      INTERACTIONS: "interactions",
    };
    useEffect(() => {
      if (context.friends) {
      }
    }, []);
    function getMonthlyData(key) {
      if (context.friends) {
        let sumOfSpent = 0;
        let sumOfReceive = 0;
        let sumIntractions = 0;
        context.friends.forEach((e) => {
          for (let i = 0; i < e.event.length; i++) {
            const EDate = new Date(e.event[i].created_on);
            if (EDate.getMonth() === date.getMonth()) {
              sumOfSpent += e.event[i].money > 0 ? e.event[i].money : 0;
              sumOfReceive += e.event[i].money < 0 ? e.event[i].money : 0;
              sumIntractions += 1;
            }
          }
        });
        switch (key) {
          case MonthlyStates.SPENT:
            return sumOfSpent;
          case MonthlyStates.RECEIVED:
            return sumOfReceive;
          case MonthlyStates.INTERACTIONS:
            return sumIntractions;
        }
      }
    }
    return (
      <>
        <Flex
          position={"relative"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <EditIcon />
          <Text color={"gray"} fontFamily={'"Gill Sans", sans-serif'}>
            {user.username}
          </Text>
          <Flex mt={"1rem"}
            textAlign={"left"}
            w={"100%"}
            fontWeight={"bold"}
            color={"gray"}
            fontSize={"1.5rem"}
            alignItems={'center'}
            >
          <Text

          >
            Monthly Info
          </Text>
          <Flex alignItems={"center"} color={monthColors[date.getMonth()]}>
          (<MdCalendarMonth />{monthNames[date.getMonth()]})
          </Flex>
          </Flex>
          <Stack
            position={"inline"}
            spacing="4px"
            fontFamily={'"Gill Sans", sans-serif'}
            divider={<StackDivider />}
          >
            <Stack spacing="4px" m={"0.5rem 0"}>
              <CustomField
                icon={<GiPayMoney fontSize={"2rem"} color={"gray"} />}
                header={"I SPENT"}
                text={"$" + getMonthlyData(MonthlyStates.SPENT)}
              />
              <CustomField
                icon={<GiReceiveMoney fontSize={"2rem"} color={"gray"} />}
                header={"I RECEIVED"}
                text={"$" + getMonthlyData(MonthlyStates.RECEIVED) * -1}
              />
              <CustomField
                icon={<FaPeopleArrows fontSize={"2rem"} color={"gray"} />}
                header={"NUMBER OF INTERACTIONS"}
                text={getMonthlyData(MonthlyStates.INTERACTIONS)}
              />
            </Stack>
            <CustomField
              icon={<HiUsers fontSize={"2rem"} color={"gray"} />}
              header={"NUMBER OF FRIENDS"}
              text={context.friends.length}
            />
          </Stack>
          <Box w={"100%"} m={"0.5rem 0"}>
            <Flex w={"100%"} justifyContent={"flex-end"}>
              <Logout />
            </Flex>
            <Theme left={"0"} />
          </Box>
        </Flex>
      </>
    );
  }
  function UserInfo() {
    return (
      <>
        <Text fontWeight={"bold"} color={"gray"} fontSize={"1.5rem"}>
          Account Info
        </Text>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Stack spacing="4px" fontFamily={'"Gill Sans", sans-serif'}>
            <CustomField
              icon={<HiUser fontSize={"2rem"} color={"gray"} />}
              header={"USER NAME"}
              // text={user.username}
              text={
                <EditableInput
                  ref={userNameRef}
                  value={user.username}
                  func={editUser}
                />
              }
            />
            <CustomField
              icon={<HiMail fontSize={"2rem"} color={"gray"} />}
              header={"MAIL ADDRESS"}
              text={user.email}
            />
            <CustomField
              icon={<HiOutlineLockClosed fontSize={"2rem"} color={"gray"} />}
              header={"PASSWORD"}
              text={"****************"}
            />
          </Stack>
        </Flex>
      </>
    );
  }
  return (
    <>
      {!context.isLoading ? (
        <>
          <>
            <Card
              minW={"100%"}
              h={{ base: "100vh", md: "auto" }}
              overflow={"hidden"}
            >
              <CardBody>
                <Stack
                  divider={<StackDivider />}
                  spacing={{ base: "1", md: "4" }}
                >
                  <FriendInfo />
                  <UserInfo />
                </Stack>
              </CardBody>
            </Card>
          </>
        </>
      ) : (
        <CustomSpinner />
      )}
    </>
  );
}
