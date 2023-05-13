import axios from "axios";
import { customAxios } from "./customAxios";
import Cookies from "universal-cookie";
import { useState, useEffect, useContext } from "react";
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
} from "@chakra-ui/react";
import AppContext from "./globalContext";

function Friend({ friendName, setValue, error, setError }) {
  const subject = "friend";
  const handleChange = (event) => {
    setValue(event.target.value), setError(subject, event.target.value);
  };
  return (
    <>
      <FormControl isInvalid={!error}>
        <FormLabel>friend-name</FormLabel>
        <Input
          value={friendName}
          onChange={handleChange}
          placeholder="enter friend-name"
          size="sm"
        />
        <FormErrorMessage>friend-name is required</FormErrorMessage>
      </FormControl>
    </>
  );
}

export default function FriendCreate({ User, toastFun }) {
  const context = useContext(AppContext);
  const [friendName, setFriendName] = useState("");
  const [error, setError] = useState(true);
  const [clicked, setClicked] = useState(false);

  function friendCreate() {
    if (context.user) {
      customAxios.post("/api/character/character-create/",{
        name: friendName,
        user: context.user.UID,
      })
        .then((res) => {
          setClicked(false);
          let newArray = context.friends.slice()
          if(Array.isArray(newArray)) {
            newArray.unshift(res.data)
          } else {
            newArray = [res.data]
          }
          context.setFriends(newArray); //update old array to new array
          toastFun({title:'Friend created!',description:`Your friend ${friendName} is successfully created!`, status:'success' })
        })
        .catch((e) => {
          toastFun({title:'Failed creation!',description:`Something bad happened. Please try later!`, status:'error' })
        });
    }
  }
  function formCheck() {
    setError(friendName ? true : false);
    if (friendName) {
      friendCreate();
    } else {
      console.log("NO");
    }
  }
  return (
    <>
      {!clicked ? (
        <Button
          onClick={() => {
            setClicked(true);
          }}
        >
          Create a friend
        </Button>
      ) : (
        <>
          <Friend
            setValue={setFriendName}
            friendName={friendName}
            error={error}
            setError={setError}
          />
          <ButtonGroup>
            <Button
              onClick={() => {
                setClicked(false);
              }}
            >
              Cancel
            </Button>
              <Button onClick={formCheck}>Create</Button>
          </ButtonGroup>
        </>
      )}
    </>
  );
}
