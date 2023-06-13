import { Text, Box } from "@chakra-ui/react";
import { FaPeopleArrows } from "react-icons/fa";
import { dateConvert } from "@/utils";
import { CustomField } from "@/pages/account";
import { BsCalendarEvent } from "react-icons/bs";
import { FaMoneyCheckAlt } from "react-icons/fa";

export default function MobileList({ friend, spentOrReceive }) {
  const mr = "0.5rem";
  const sp = 1
  const color = () => {
    return friend.sum >= 0 ? "#c0fafb" : "#ff9393";
  };
  return (
    <Box display={{ md: "none" }}>
      <CustomField
        icon={<FaMoneyCheckAlt fontSize={"1.5rem"} color={color()} />}
        header={<Text color={color()}>{spentOrReceive(friend.sum)}</Text>}
        text={<Text color={color()}>{friend.sum}</Text>}
        mr={mr}
      />
      <CustomField
        icon={<FaPeopleArrows fontSize={"1.5rem"} color={"gray"} />}
        header={<Text color={"white"}>Number of events</Text>}
        text={friend.event_length}
        mr={mr}
      />
      <CustomField
        icon={<BsCalendarEvent fontSize={"1.5rem"} color={"gray"} />}
        header={<Box color={"white"}>Last interaction</Box>}
        text={dateConvert(friend.last_log)}
        mr={mr}
      />
    </Box>
  );
}
