import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/legacy/image";
// import { GiPlantSeed } from "react-icons/gi";
import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Logo() {
  const router = useRouter();
  //     const LogoBox = styled.span`
  //     font-weight: bold;
  //     font-size: 18px;
  //     display: inline-flex;
  //     align-items: center;
  //     height: 30px;
  //     line-height: 20px;
  //     padding: 10px;
  //     > svg {
  //       transition: 200ms ease;
  //     }
  //     &:hover > svg {
  //       transform: rotate(50deg);
  //     }
  //   `;
  return (
    <Box>
      <Link href={router.pathname === "/" ? {} : "/"} scroll={false}>
        <Image priority={true} src={"/logo1.png"} style={{ width: '40px', height: 'auto' }} width="0"
    height="0" />
      </Link>
    </Box>
  );
}
