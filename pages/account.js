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
  useToast
} from "@chakra-ui/react";
import Logout from "@/components/logout";
import { useRouter } from "next/router";

export default function Account({user}) {
    const toast = useToast()
    const toastIdRef = useRef()
    const router = useRouter();
    const [userDetail, setUserDetail] = useState('')
    const [isToast, setIsToast] = useState(false)
    function addToast() {
      toastIdRef.current = toast({
      title: "Logged in!",
      description: 'You are successfully logged in!',
      status: 'success',
      duration: 5000,
      isClosable: true, })
  }
    useEffect(() => {
      console.log("router",Object.keys(router.query))
          axios({
            method: "get",
            url: `/api/user/user-detail/${user}`,
          })
            .then((res) => {
                setUserDetail(res.data);
                if(Object.keys(router.query).length) {
                  console.log("TOAST")
                  addToast()
                }
            })
            .catch((e) => {});
      }, []);
    return(
        <>
        {userDetail ? (
            <>
            <Card minW={"100%"}>
                <CardBody>
                  <Flex alignItems={"center"}>
                    <Avatar mr={"1rem"} />
                    <VStack align="stretch">
                      <Text>Name:{userDetail.username}</Text>
                    </VStack>
                  </Flex>
                </CardBody>
                <Logout/>
            </Card>
            </>
        ):(
            <>NO</>
        )}
        </>
    )
}