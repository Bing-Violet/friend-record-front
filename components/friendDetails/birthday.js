import { useState, useEffect, useRef, forwardRef, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { customAxios } from "@/components/customAxios";
import {
  Button,
  ButtonGroup,
  Center,
  VStack,
  Flex,
  Text,
  Box,
  Stack,
  FocusLock,
  FormControl,
  FormLabel,
  Input,
  StackDivider,
  CloseButton,
  IconButton,
  useBoolean,
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

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

import EventCreate from "@/components/eventCreate";
import { Card, CardBody } from "@chakra-ui/react";
import { FaBirthdayCake } from "react-icons/fa";
import { RiSettings4Line, RiEdit2Line } from "react-icons/ri";
import AppContext from "@/components/globalContext";
import { eventIcons, getIconObj } from "@/components/iconsSlides/icons";
import SlideIcons from "@/components/iconsSlides/slideIcons";
import CustomSpinner from "@/components/spinner";
import { avatars, getAvaterObj } from "@/components/iconsSlides/avatars";
import { dateConvert } from "@/utils";
import { EditableInput } from "@/components/customForms/editableInput";
import { Who } from "@/components/eventCreate";

const date = new Date(Date.now())

const Year = forwardRef(({}, ref) => {
  const [year, setYear] = useState(date.getFullYear());
  const handleChange = (value) => setVal(value);
  const setVal = (val) => {
    setYear(val);
    ref.current = val;
  };
  return (
    <Flex mt={"1rem"} h={"50px"} alignItems={"center"} position={"relative"}>
      <Text position={"absolute"} top={"-4"} left={5}>
        Year
      </Text>
      <Slider
        flex="1"
        orientation="vertical"
        focusThumbOnChange={false}
        onChange={handleChange}
        defaultValue={year}
        value={year}
        min={1960}
        max={date.getFullYear()}
        step={1}
        mr={"0.5rem"}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb color={"gray"} boxSize="10px" />
      </Slider>
      <NumberInput
        maxW="90px"
        mr="1rem"
        max={date.getFullYear()}
        min={1960}
        value={year}
        onChange={handleChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
});

const Month = forwardRef(({}, ref) => {
  const [month, setMonth] = useState(date.getMonth()+1);
  const handleChange = (value) => setVal(value);
  const setVal = (val) => {
    setMonth(val);
    ref.current = val;
  };
  return (
    <Flex
      mt={"1rem"}
      mr={"0.2rem"}
      h={"50px"}
      alignItems={"center"}
      position={"relative"}
    >
      <Text position={"absolute"} top={"-4"} left={0}>
        Month
      </Text>
      <NumberInput
        min={1}
        max={12}
        w="70px"
        value={month}
        onChange={handleChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
});
const Day = forwardRef(({}, ref) => {
  const [day, setDay] = useState(date.getDate());
  const handleChange = (value) => setVal(value);
  const setVal = (val) => {
    setDay(val);
    ref.current = val;
  };
  return (
    <Flex mt={"1rem"} h={"50px"} alignItems={"center"} position={"relative"}>
      <Text position={"absolute"} top={"-4"} left={0}>
        Day
      </Text>
      <NumberInput
        min={1}
        max={31}
        w="70px"
        value={day}
        onChange={handleChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
});

export default function Birthday({ slug, friend, events, setEvents }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [isEditing, setIsEditing] = useBoolean();
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const firstFieldRef = useRef(null);
  function birthdayUpdate() {
    const year = yearRef.current;
    const month = monthRef.current;
    const day = dayRef.current;
    console.log("clicked", date,year, month, day);
  }
  const DateForm = ({ firstFieldRef, onCancel }) => {
    function formCheck() {
      setError(friendName ? true : false);
      if (friendName) {
        friendCreate();
      } else {
        console.log("NO");
      }
    }
    //   function friendCreate() {
    //     if (context.user) {
    //       console.log('chakava',avatar)
    //       const avatarName = avatar.name
    //       customAxios
    //         .post("/api/character/character-create/", {
    //           name: friendName,
    //           user: context.user.UID,
    //           avatar: avatarName
    //         })
    //         .then((res) => {
    //           let newArray = context.friends.slice();
    //           if (Array.isArray(newArray)) {
    //             newArray.unshift(res.data);
    //           } else {
    //             newArray = [res.data];
    //           }
    //           context.setFriends(newArray); //update old array to new array
    //           toastFun({
    //             title: "Friend created!",
    //             description: `Your friend ${friendName} is successfully created!`,
    //             status: "success",
    //           });
    //         })
    //         .catch((e) => {
    //           toastFun({
    //             title: "Failed creation!",
    //             description: `Something bad happened. Please try later!`,
    //             status: "error",
    //           });
    //         });
    //     }
    //   }
    return (
      <Flex>
        <Year ref={yearRef} />
        <Month ref={monthRef} />
        <Day ref={dayRef} />
      </Flex>
    );
  };
  return (
    <Box>
      <Popover
        isOpen={isEditing}
        initialFocusRef={firstFieldRef}
        onOpen={setIsEditing.on}
        onClose={setIsEditing.off}
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Center>
            <Button
              w={"60%"}
              colorScheme="twitter"
              leftIcon={<FaBirthdayCake />}
              onClick={isEditing ? birthdayUpdate : () => {}}
            >
              {isEditing ? "Save" : "Add Birthday?"}
            </Button>
          </Center>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <DateForm onCancel={onClose} />
          </FocusLock>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
