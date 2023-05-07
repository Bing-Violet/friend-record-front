import axios from "axios";
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
  Text,
} from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import AppContext from "./globalContext";

function Money({ money, setValue, error, setError }) {
  const subject = "eventName";
  //   const handleChange = (event) => {
  //     setValue(event.target.value), setError(subject, event.target.value);
  //   };
  const handleChange = (value) => setValue(value);
  const format = (val) => `$ ` + val;
  const parse = (val) => val.replace(/^\$/, "");

  return (
    <Flex mt={"1rem"} w={"600px"}>
      <NumberInput
        maxW="120px"
        mr="2rem"
        value={format(money)}
        onChange={handleChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        flex="1"
        focusThumbOnChange={false}
        value={money}
        onChange={handleChange}
        defaultValue={500}
        min={-1000}
        max={1000}
        step={1}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" children={money} />
      </Slider>
    </Flex>
  );
}
function Event({ eventName, setValue, error, setError }) {
  const subject = "friend";
  const handleChange = (event) => {
    setValue(event.target.value), setError(subject, event.target.value);
  };
  return (
    <>
      <FormControl isInvalid={!error}>
        <FormLabel>event-name</FormLabel>
        <Input
          value={eventName}
          onChange={handleChange}
          placeholder="enter event-name"
          size="sm"
        />
        <FormErrorMessage>event-name is required</FormErrorMessage>
      </FormControl>
    </>
  );
}

export default function EventCreate({ slug, friend, events, setEvents }) {
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState("");
  const [money, setMoney] = useState(0);

  const context = useContext(AppContext);
  const [error, setError] = useState(true);

  function eventCreate() {
    console.log("CREAYE", slug, events);
    axios({
      method: "post",
      url: "/api/event/event-create/",
      data: {
        name: event,
        money: money,
        character: slug,
      },
    })
      .then((res) => {
        friend.sum += res.data.money;
        friend.last_log = res.data.created_on;
        setIsOpen(false);
        const newArray = events;
        newArray.unshift(res.data);
        setEvents([...newArray]) //update old array to new array
        console.log("event",events)
      })
      .catch((e) => {});
  }
  function formCheck() {
    setError(event ? true : false);
    if (event) {
      eventCreate();
    } else {
      console.log("NO");
    }
  }
  function Create() {
    return (
      <>
        <Button onClick={formCheck}>CREATE</Button>
      </>
    );
  }
  function Cancel() {
    return (
      <>
        <Button
          onClick={() => {
            setIsOpen(false);
          }}
        >
          CANCEL
        </Button>
      </>
    );
  }

  return (
    <Flex flexDirection={"column"} alignItems={"center"}>
      {isOpen ? (
        <>
          <Event
            eventName={event}
            setValue={setEvent}
            error={error}
            setError={setError}
          />
          <Money money={money} setValue={setMoney} />
          <ButtonGroup mt={"1rem"}>
            <Cancel />
            <Create />
          </ButtonGroup>
        </>
      ) : (
        <>
          <Text mt={"1rem"}>Do you wanna make an event??</Text>
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
            mt={"1rem"}
          >
            CREATE
          </Button>
        </>
      )}
    </Flex>
  );
}
