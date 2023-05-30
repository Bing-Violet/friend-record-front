import axios from "axios";
import { customAxios } from "./customAxios";
import Cookies from "universal-cookie";
import { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import {
  Button,
  ButtonGroup,
  Wrap,
  WrapItem,
  Center,
  Flex,
  Box,
  Stack,
  HStack,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  VStack,
  Text,
  position,
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
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import AppContext from "./globalContext";

function Money({ money, setValue, error, setError }) {
  const handleChange = (value) => setValue(value);
  const format = (val) => `$ ` + val;
  const parse = (val) => val.replace(/^\$/, "");

  return (
    <Flex
      mt={"1rem"}
      // w={{ base: "300px", md: "600px" }}
    >
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
        <SliderThumb color={"gray"} fontSize="sm" boxSize="20px" />
      </Slider>
    </Flex>
  );
}
function Event({ eventName, setValue, error, setError }) {
  const handleChange = (event) => {
    setValue(event.target.value), setError(event.target.value);
  };
  return (
    <>
      <FormControl isInvalid={!error}>
        <FormLabel>Event-name</FormLabel>
        <Input
          value={eventName}
          onChange={handleChange}
          placeholder="Enter Event-name"
          size="sm"
        />
        <FormErrorMessage>event-name is required</FormErrorMessage>
      </FormControl>
    </>
  );
}

export default function EventCreate({ slug, friend, events, setEvents }) {
  // const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState("");
  const [money, setMoney] = useState(0);
  const context = useContext(AppContext);
  const [error, setError] = useState(true);
  const accessToken = context.accessToken;
  const toastFun = context.addToast;
  const cookies = new Cookies();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  function eventCreate() {
    console.log("CALED");
    customAxios
      .post("/api/event/event-create/", {
        name: event,
        money: money,
        character: slug,
      })
      .then((res) => {
        // friend.sum += res.data.money;
        friend.last_log = res.data.created_on;
        onClose();
        const newArray = events;
        newArray.unshift(res.data);
        setEvents([...newArray]); //set new array.'
        context.friends.forEach((e) => {
          if (e.id === friend.id) {
            console.log(typeof e.sum, typeof money, money, e.sum);
            e.sum += Number(money);
          }
        });
        toastFun({
          title: "Event created!",
          description: `Your event ${event} is successfully created!`,
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
        <Button onClick={formCheck} colorScheme='blue' >CREATE</Button>
      </>
    );
  }
  function Cancel() {
    return (
      <>
        <Button
          onClick={() => {
            onClose();
          }}
          colorScheme='red' variant='outline'
        >
          CANCEL
        </Button>
      </>
    );
  }
  function CreateEvent() {
  let image 
  if(!events.length) {
    image = (
      <>
      <Text
        color={"#1166EE"}
        fontFamily={"Gill Sans"}
        fontWeight="bold"
        fontSize={{base:'2rem',md:"3rem"}}
      >
        Create an First Event
      </Text>
      <Box boxShadow="xl" border={'solid #cf5701'} w={"100%"} h={400} position="relative">
        <Image
          priority={true}
          src={"/images/event.jpg"}
          layout="fill"
          objectFit="cover"
          alt={"asset"}
        />
      </Box></>
    )
  }
    return(
      <>{image}</>
    )
  }
  return (
    <Flex flexDirection={"column"} alignItems={"center"} position={"relative"}>
      <Button
        onClick={onOpen}
        mt={"0.5rem"}
        background={"#1166EE"}
        color={"white"}
      >
        Create an Event
      </Button>
      <CreateEvent/>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton zIndex={1}/>
          <ModalBody pb={6}>
            <Flex flexDirection={"column"}>
              <Event
                eventName={event}
                setValue={setEvent}
                error={error}
                setError={setError}
              />
              <Money money={money} setValue={setMoney} />
              <Flex mt={"1rem"} justifyContent={'flex-end'}>
                <HStack spacing='24px'>
                <Cancel />
                <Create />
                </HStack>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
