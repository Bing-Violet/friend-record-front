import axios from "axios";
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
} from "@chakra-ui/react";
import Logout from "@/components/logout";
import AppContext from "@/components/globalContext";
import { useRouter } from "next/router";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { HiUsers, HiUser, HiMail, HiOutlineLockClosed } from "react-icons/hi";
import Theme from "@/components/theme";

export default function Account() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const addToast = context.addToast;
  useEffect(() => {
    if (context) {
      console.log("account", context.user);
      if (Object.keys(router.query).length) {
        addToast({
          title: "Logged in!",
          description: `You are successfully logged in!`,
          status: "success",
        });
      }
      setMounted(true);
      // console.log("router", Object.keys(router.query), context.user.UID);
      // axios({
      //   method: "get",
      //   url: `/api/user/user-detail/${context.user.UID}`,
      // })
      //   .then((res) => {
      //     setUserDetail(res.data);
      //     if (Object.keys(router.query).length) {
      //       addToast({
      //         title: "Logged in!",
      //         description: `You are successfully logged in!`,
      //         status: "success",
      //       });
      //     }
      //   })
      //   .catch((e) => {});
    }
  }, []);
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
        <Flex position={"relative"} flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"xl"} />
          <Text color={"gray"} fontFamily={'"Gill Sans", sans-serif'}>
            {context.user.username}
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
        <Text fontWeight={'bold'} color={'gray'} fontSize={'1.5rem'}>Account Info</Text>
        <Flex flexDirection={"column"} alignItems={"center"} justifyContent={'center'} h={'100%'}>
        <Stack  spacing="4px" fontFamily={'"Gill Sans", sans-serif'}>
          <CustomField
            icon={<HiUser fontSize={"2rem"} color={"gray"} />}
            header={"USER NAME"}
            text={context.user.username}
          />
          <CustomField
            icon={<HiMail fontSize={"2rem"} color={"gray"} />}
            header={"MAIL ADDRESS"}
            text={context.user.email}
          />
          <CustomField
            icon={<HiOutlineLockClosed fontSize={"2rem"} color={"gray"} />}
            header={"PASSWORD"}
            text={'****************'}
          />
        </Stack>
        </Flex>
      </>
    );
  }
  return (
    <>
      {context.user && mounted ? (
        <>
          <Card minW={"100%"} h={{base:'100vh', md:'auto'}}>
            <CardBody>
              <Stack
                divider={<StackDivider />}
                spacing={{ base: "1", md: "4" }}
                // h={'100%'}
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
