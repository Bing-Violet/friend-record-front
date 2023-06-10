import { customAxios } from "@/components/customAxios";
import Cookies from "universal-cookie";
import { useState, useEffect, useContext, useRef } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import {
  Button,
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
import { FaMoneyCheckAlt } from "react-icons/fa";
import { HiUsers, HiUser, HiMail, HiOutlineLockClosed } from "react-icons/hi";
import Theme from "@/components/theme";
import { getAvaterObj, avatars } from "@/components/iconsSlides/avatars";
import SlideIcons from "@/components/iconsSlides/slideIcons";

export default function Account() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState('')
  const addToast = context.addToast;
  useEffect(() => {
    console.log("from account effeft");
    if (context) {
      console.log("account", context.user);
      setUser(context.user)
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
  async function updateUser({...props}) {
    const UID = props.UID;
    delete props.UID;
    console.log('props',props)
    customAxios
      .patch( `/api/user/user-detail/${UID}`, props)
      .then((res) => {
        setUser(res.data);
        const cookies = new Cookies()
        cookies.set("user", res.data, { path: "/" });
      })
      .catch((e) => {});
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
    // function editUser({ ...props }) {
    //   console.log("FROM_EDITUSER", props, avatar.name);
    //   context.setUser((user) => ({...user, avatar:avatar.name}))
    //   user.avatar = avatar.name
      
    // }
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
                    // defaultIcon={getAvaterObj(friend.avatar)}
                  />
                  <ButtonGroup display="flex" justifyContent="flex-end">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      isDisabled={isDisabled}
                      onClick={() =>
                        updateUser({"UID":user.UID,"avatar":avatar.name})
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
        <Flex mt={"0.5rem"}>
          <Flex alignItems={"center"} justifyContent={"center"} mr={"1rem"}>
            {icon}
          </Flex>
          <Stack spacing="-8px">
            <Text fontWeight={"bold"}>{header}</Text>
            <Text ml={"0.5rem"} color={"gray"}>
              {text}
            </Text>
          </Stack>
        </Flex>
      </>
    );
  }
  function FriendInfo() {
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
          <Stack spacing="4px" fontFamily={'"Gill Sans", sans-serif'}>
            <CustomField
              icon={<FaMoneyCheckAlt fontSize={"2rem"} color={"gray"} />}
              header={"TOTAL SPENT"}
              text={"$9000000"}
            />
            <CustomField
              icon={<FaMoneyCheckAlt fontSize={"2rem"} color={"gray"} />}
              header={"TOTAL ALLOCATED"}
              text={"$9000000"}
            />
            <CustomField
              icon={<HiUsers fontSize={"2rem"} color={"gray"} />}
              header={"TOTAL FRIEND"}
              text={"20"}
            />
          </Stack>
          <Box w={"100%"}>
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
              text={user.username}
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
      {mounted ? (
        <>
          <Card minW={"100%"} h={{ base: "100vh", md: "auto" }}>
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
      ) : (
        <>NO</>
      )}
    </>
  );
}
