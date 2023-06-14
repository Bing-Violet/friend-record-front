import { useState, useEffect, useRef, forwardRef, useContext } from "react";
import {
  Button,
  Center,
  Flex,
  Text,
  Box,
  FocusLock,
  useBoolean,
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
} from "@chakra-ui/react";

import { FaBirthdayCake } from "react-icons/fa";
import { BsCalendarX, BsCalendar, BsCalendar2Check } from "react-icons/bs";
import { customAxios } from "../customAxios";
import AppContext from "../globalContext";

const date = new Date(Date.now());

const Year = forwardRef(({ setIsReady }, ref) => {
  const [year, setYear] = useState(date.getFullYear());
  const handleChange = (value) => setVal(value);
  const setVal = (val) => {
    setYear(val);
    ref.current = Number(val);
    setIsReady(true);
  };
  useEffect(() => {
    ref.current = date.getFullYear();
  }, []);
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
        min={1940}
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
        min={1940}
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

const Month = forwardRef(({ setIsReady }, ref) => {
  const [month, setMonth] = useState(date.getMonth() + 1);
  const handleChange = (value) => setVal(value);
  const setVal = (val) => {
    setMonth(val);
    ref.current = Number(val);
    setIsReady(true);
  };
  useEffect(() => {
    ref.current = date.getMonth() + 1;
  }, []);
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

const Day = forwardRef(({ setIsReady }, ref) => {
  const [day, setDay] = useState(date.getDate());
  const handleChange = (value) => setVal(value);
  const setVal = (val) => {
    setDay(val);
    ref.current = Number(val);
    setIsReady(true);
  };
  useEffect(() => {
    ref.current = date.getDate();
  }, []);
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

export default function Birthday({ friend, setFriend, defaultButton }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [isEditing, setIsEditing] = useBoolean();
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const context = useContext(AppContext);
  const toastFun = context.addToast;
  const [isReady, setIsReady] = useState(false);
  function birthdayUpdate() {
    const year = yearRef.current;
    const month = monthRef.current;
    const day = dayRef.current;
    const friendiId = friend.id;
    customAxios
      .post("/api/character/birthday-update/", {
        year: year,
        month: month,
        day: day,
        id: friendiId,
      })
      .then((res) => {
        console.log(res.data);
        setFriend(res.data);
        toastFun({
          title: "Friend updated!",
          description: `Your friend ${friend.name}is successfully updated!`,
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
  function calenderIcon() {
    if (!isReady && isEditing) {
      return <BsCalendarX color={"red"} />;
    } else if (isReady && isEditing) {
      return <BsCalendar2Check color={"blue"} />;
    } else if (!isEditing) {
      return <BsCalendar color={"green"} />;
    }
  }
  function customClose() {
    onClose();
    setIsEditing.off();
    setIsReady(false);
  }
  return (
    <Box>
      <Popover
        isOpen={isEditing}
        onOpen={setIsEditing.on}
        onClose={setIsEditing.off}
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Center>
            {defaultButton === "edit" ? (
              <Box ml={'0.2rem'} onClick={isReady && isEditing ? birthdayUpdate : () => {}}>
                {calenderIcon()}
              </Box>
            ) : (
              <Button
                w={"60%"}
                colorScheme="twitter"
                isDisabled={!isReady && isEditing}
                leftIcon={<FaBirthdayCake />}
                onClick={isEditing ? birthdayUpdate : () => {}}
              >
                {isEditing ? "Save" : "Add Birthday?"}
              </Button>
            )}
          </Center>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton onClick={customClose} />
            <Flex>
              <Year ref={yearRef} setIsReady={setIsReady} />
              <Month ref={monthRef} setIsReady={setIsReady} />
              <Day ref={dayRef} setIsReady={setIsReady} />
            </Flex>
          </FocusLock>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
