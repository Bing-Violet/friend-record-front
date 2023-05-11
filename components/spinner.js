import { Spinner, Center, Flex } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import AppContext from "./globalContext";

export default function CustomSpinner() {
  const context = useContext(AppContext);

  return (
    <>
      <Flex h={'100vh'} justifyContent={'center'} alignItems={'center'}>
        <Spinner size='xl' thickness='4px' color='white.500' />
      </Flex>
    </>
  );
}
