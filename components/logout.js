import { useState, useEffect, useContext } from "react";
import AppContext from "@/components/globalContext";
import {
  Button,

} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jwt-decode"
import { useRouter } from "next/router";

export default function Logout({setUser}) {
    const context = useContext(AppContext);
    const router = useRouter();
    async function logout() {
        const cookies = new Cookies
        cookies.remove("user")
        cookies.remove("access_token")
        cookies.remove("refresh_token")
        await context.setUser('')
        await context.setFriends([...[]])
        router.push('/')
    }

    return (
        <Button colorScheme='red' variant='outline' onClick={logout}>Logout</Button>
    )
}