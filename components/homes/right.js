import Image from "next/image";
import {
  Flex,
  Box,
  Center,
  Text,
  Heading,
  HStack,
  Button,
} from "@chakra-ui/react";
import AppContext from "../globalContext";
import { useState, useContext } from "react";


export default function Right() {
    const [backgroundWidth, setBackgroundWidth] = useState(1000);
    const [rightDownWidth, setRightDownWidth] = useState(1100);
    const [peopleImageWidth, setPeopleImageWidth] = useState(650);
    function RightItemsImage() {
      return (
        <Box position={"absolute"} right={'1rem'} top={"1.5rem"}>
          <Image
            priority={true}
            src={"/images/home/Asset10.png"}
            width={rightDownWidth}
            height="0"
            alt={"asset"}
          />
        </Box>
      );
    }
    function RightBackground() {
      return (
        <Box position={"absolute"} right={'0'} bottom={'0'}>
          <Image
            priority={true}
            src={"/images/home/Asset12.png"}
            width={backgroundWidth}
            height={"0"}
            alt={"asset"}
          />
        </Box>
      );
    }
    function PeopleImage() {
      return (
        <Box position={"absolute"} bottom={'0'}>
          <Image
            priority={true}
            src={"/images/home/Asset2.png"}
            width={peopleImageWidth}
            height={"0"}
            alt={"asset"}
          />
        </Box>
      );
  }
  return (
    <>
      <Box width={'100%'} height={'100%'} position={"relative"}>
        <RightBackground />
        <PeopleImage/>
        <RightItemsImage/>
        {/* <LeftText position={"absolute"} /> */}
      </Box>
    </>
  );
}
