import { useState, useEffect, useRef, forwardRef, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AppContext from "@/components/globalContext";

export default function FriendDetail({ user }) {
    const router = useRouter();
    const context = useContext(AppContext);
    const [mounted, setMounted] = useState(false);
    const [slug, setSlug] = useState("");
    useEffect(() => {
        console.log("to",router.query.token, router.isReady)
        if(router.isReady) {
            axios({
                method: "post",
                url: "/api/user/email-verify/",
                data: {token:router.query.token}
              })
                .then((res) => {
                    console.log("RESS", res.data)
                //   const data = jwt(res.data.tokens.access_token);
                //   cookies.set("jwt-tokens", {
                //     access_token: res.data.tokens.access_token,
                //     refresh_token: res.data.tokens.refresh_token,
                //   });
                //   cookies.set("user", data.user_id);
                //   context.setUser(data.user_id);
    
                })
                .catch((e) => {
                    console.log("ERROR", e)
                });
        } else {
            console.log('NO_TOKEN')
        }
    },[router.isReady])
    return (
        <>
        VALIDATION
        {router.query.token}
        </>
    )

}