import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Signup from "../components/signup";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  axios({
    method: "get",
    url: "/api/user/user-list/",
    data: {},
  })
    .then((res) => {
      console.log("RESPONSE", res);
    })
    .catch((e) => {});

  return (
    <>
      helo
      <Signup/>
    </>
  );
}
