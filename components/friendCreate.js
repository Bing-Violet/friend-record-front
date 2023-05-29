import axios from "axios";
import { customAxios } from "./customAxios";
import Cookies from "universal-cookie";
import { useState, useEffect, useRef, forwardRef, useContext } from "react";
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
  Stack,
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
  IconButton,
  FocusLock,
  useDisclosure,
} from "@chakra-ui/react";
import AppContext from "./globalContext";

export default function FriendCreate({ User, toastFun }) {
  const context = useContext(AppContext);
  const [error, setError] = useState(true);

  function EditPopover({ eventName }) {
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
      const [friendName, setFriendName] = useState("");
      const [isDisabled, setIsDisabled] = useState(true);

      const eventHandleChange = (event) => {
        setFriendName(event.target.value), setIsDisabled(false);
      };
      function formCheck() {
        setError(friendName ? true : false);
        if (friendName) {
          friendCreate();
        } else {
          console.log("NO");
        }
      }
      function friendCreate() {
        if (context.user) {
          customAxios
            .post("/api/character/character-create/", {
              name: friendName,
              user: context.user.UID,
            })
            .then((res) => {
              let newArray = context.friends.slice();
              if (Array.isArray(newArray)) {
                newArray.unshift(res.data);
              } else {
                newArray = [res.data];
              }
              context.setFriends(newArray); //update old array to new array
              toastFun({
                title: "Friend created!",
                description: `Your friend ${friendName} is successfully created!`,
                status: "success",
              });
            })
            .catch((e) => {
              toastFun({
                title: "Failed creation!",
                description: `Something bad happened. Please try later!`,
                status: "error",
              });
            });
        }
      }
      return (
        <Stack spacing={4}>
          <TextInput
            label="Friend Name"
            id="first-name"
            ref={firstFieldRef}
            defaultValue={eventName}
            onChange={eventHandleChange}
          />
          <ButtonGroup display="flex" justifyContent="flex-end">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              isDisabled={isDisabled}
              onClick={formCheck}
              colorScheme="blue"
            >
              Create
            </Button>
          </ButtonGroup>
        </Stack>
      );
    };
    return (
      <Box>
        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button background={"#1166EE"} color={"white"}>
              Create a friend
            </Button>
          </PopoverTrigger>
          <PopoverContent p={5}>
            <FocusLock returnFocus persistentFocus={false}>
              <PopoverArrow />
              <PopoverCloseButton />
              <Form firstFieldRef={firstFieldRef} onCancel={onClose} />
            </FocusLock>
          </PopoverContent>
        </Popover>
      </Box>
    );
  }

  return (
    <>
      <EditPopover  />

    </>
  );
}
