import { useState, useEffect } from "react";
import {
  Button,

} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jwt-decode"

export default function Logout({setUser}) {
    function logout() {
        const cookies = new Cookies
        cookies.remove("user")
        cookies.remove("jwt-tokens")
    }

    return (
        <Button colorScheme='red' variant='outline' onClick={logout}>Logout</Button>
    )
}