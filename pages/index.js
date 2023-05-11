
import Signup from "../components/signup";
import Login from "../components/login";
import FriendList from "../components/friendList";
import FriendCreate from "../components/friendCreate";
import axios from "axios";
import AppContext from "@/components/globalContext";
import { useState, useEffect, useContext } from "react";
import {
  Button,
  ButtonGroup,
  Center,
  VStack,
  Flex,
  Spinner,
} from "@chakra-ui/react";

export default function Home() {
  const context = useContext(AppContext);
  const [mounted, setMounted] = useState("");
  const addToast = context.addToast
  const [user, setUser] = useState(context.user)

  useEffect(() => {
    if (user&&!context.friends.length) {
      axios({
        method: "post",
        url: "/api/character/user-character/",
        data: {
          user: user,
        },
      })
        .then((res) => {
          context.setFriends(res.data);
        })
        .catch((e) => {});
    }
    setMounted(true);
  }, []);

  function SignupOrLogin() {
    const [signup, setSignup] = useState(true);
    return (
      <Flex w={"600px"} mt={"2rem"} flexDirection={"column"}>
        <Center>
          <ButtonGroup>
            <Button colorScheme="gray" onClick={() => setSignup(true)}>
              Signup
            </Button>
            <Button colorScheme="gray" onClick={() => setSignup(false)}>
              Login
            </Button>
          </ButtonGroup>
        </Center>
        <Center>{signup ? <Signup /> : <Login />}</Center>
      </Flex>
    );
  }
  function IsLoggedin() {
    return (
      <VStack>
        <FriendCreate User={user} toastFun={addToast} />
        <FriendList User={user} toastFun={addToast} />
      </VStack>
    );
  }
  return (
    <>
      <Flex justifyContent={"center"}>
        {mounted ? (
          <>
            {user ? (
              <>
                <IsLoggedin />
              </>
            ) : (
              <>
                <SignupOrLogin />
              </>
            )}
          </>
        ) : (
          <Flex h={"100vh"} alignItems={"center"}>
            <Spinner size="xl" />
          </Flex>
        )}
      </Flex>
    </>
  );
}
