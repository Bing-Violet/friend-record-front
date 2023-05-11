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
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  VStack,
  Text,
  Avatar,
} from "@chakra-ui/react";
import Logout from "@/components/logout";
import AppContext from "@/components/globalContext";
import { useRouter } from "next/router";

export default function Account() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const addToast = context.addToast;
  useEffect(() => {
    if (context) {
      if (Object.keys(router.query).length) {
        addToast({
          title: "Logged in!",
          description: `You are successfully logged in!`,
          status: "success",
        });
      }
      setMounted(true)
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
  return (
    <>
      {context.user&&mounted ? (
        <>
          <Card minW={"100%"}>
            <CardBody>
              <Flex alignItems={"center"}>
                <Avatar mr={"1rem"} />
                <VStack align="stretch">
                  <Text>Name:{context.user.username}</Text>
                </VStack>
              </Flex>
            </CardBody>
            <Logout />
          </Card>
        </>
      ) : (
        <>NO</>
      )}
    </>
  );
}
