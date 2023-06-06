import { Spinner, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import AppContext from "./globalContext";

export default function CustomSpinner() {
  const context = useContext(AppContext);
  const color = useColorModeValue("gray","white")
  return (
    <>
      <Flex key={useColorModeValue('light', 'dark')}  h={'100vh'} justifyContent={'center'} alignItems={'center'}>
        <Spinner  size='xl' thickness='4px' color={color} />
      </Flex>
    </>
  );
}
