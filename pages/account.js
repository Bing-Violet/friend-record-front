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
    const [userDetail, setUserDetail] = useState('')
    const addToast = context.addToast
    useEffect(() => {
      console.log("router",Object.keys(router.query))
          axios({
            method: "get",
            url: `/api/user/user-detail/${context.user}`,
          })
            .then((res) => {
                setUserDetail(res.data);
                if(Object.keys(router.query).length) {
                  addToast(({title:'Logged in!',description:`You are successfully logged in!`, status:'success' }))
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