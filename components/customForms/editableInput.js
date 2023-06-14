import { BsCheck2Square } from "react-icons/bs";
import { RiEdit2Line } from "react-icons/ri";
import { FormControl, Input, Flex } from "@chakra-ui/react";
import { useState, useEffect, forwardRef } from "react";

//parent of this component should be absolute.


export const EditableInput = forwardRef(({ value, func }, ref) => {
  const [editedValue, setEditedValue] = useState("");
  const [editIsOpen, setEditIsOpen] = useState(false);
  useEffect(() => {
    setEditedValue(value);
  }, [editIsOpen]);
  const handleChange = (event) => {
    setEditedValue(event.target.value), ref.current = event.target.value;
  };
  function editFunc() {
    if (value === editedValue || !editedValue) {
      setEditIsOpen(!editIsOpen);
    } else {
      func();
      setEditIsOpen(!editIsOpen);
    }
  }
  const editOrCheckIcon = editIsOpen ? (
    <BsCheck2Square
      color={value === editedValue || !editedValue ? "#ef7a67" : "#00b01a"}
      onClick={() => {
        editFunc();
      }}
    />
  ) : (
    <RiEdit2Line
      color={"#00b01a"}
      onClick={() => {
        setEditIsOpen(!editIsOpen);
      }}
      ml={"0.3rem"}
    />
  );
  let markup;
  if (editIsOpen) {
    markup = (
      <Flex alignItems={"center"} w={"100%"} position={"relative"}>
        <FormControl isInvalid={!editedValue}>
          <Input
          maxLength={20}
            bg={"#ebebeb"}
            border={"solid #f864ea"}
            value={editedValue}
            onChange={handleChange}
            isInvalid={!editedValue}
            placeholder="Must not be empty!"
            _placeholder={{ color: "red" }}
            _hover={{ boder:"solid #f864ea" }}
            focusBorderColor={editedValue ? "" : "red.300"}
            size="sm"
          />
        </FormControl>
        {editOrCheckIcon}
      </Flex>
    );
  } else {
    markup = (
      <Flex alignItems={"center"} w={"100%"} position={"relative"}>
        {value}
        {editOrCheckIcon}
      </Flex>
    );
  }
  return <>{markup}</>;
});
