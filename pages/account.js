import axios from "axios";
import Cookies from "universal-cookie";
import { useState, useEffect, useContext } from "react";
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
  Avatar
} from "@chakra-ui/react";
import Logout from "@/components/logout";

export default function Account({user}) {
    const [userDetail, setUserDetail] = useState('')
    useEffect(() => {
          axios({
            method: "get",
            url: `/api/user/user-detail/${user}`,
          })
            .then((res) => {
                setUserDetail(res.data);
                console.log("DE", res.data)
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