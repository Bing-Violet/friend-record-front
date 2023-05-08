import { useToast, Box } from '@chakra-ui/react'
import { useState, useEffect, useContext, useRef } from "react";


 
export default function toast({children}) {
    const toast = useToast()
    const toastIdRef = useRef()
    function addToast() {
        console.log("addtoast")
        toastIdRef.current = toast({title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 5000,
        isClosable: true, })
    }
    return (
        <Box onClick={addToast}>
        {children}
        </Box>
    )
}