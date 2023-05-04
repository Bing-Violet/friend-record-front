import { useState, useEffect } from "react";
import { Input, Text, Button } from '@chakra-ui/react'
// API
// -> idle (no data to be shown, null)
// -> loading (the API request has been made, "loading")
// -> data (the API response has come back, { ... })
function Username({username,setUsername}) {
    // const [username, setValue] = useState("");
    const handleChange = (event) => setUsername(event.target.value);
    return (
      <>
        {/* <Text mb="8px">username: {username}</Text> */}
        <Input
          value={username}
          onChange={handleChange}
          placeholder="enter username"
          size="sm"
        />
      </>
    );
  }
export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    
//   function Username() {
//     // const [username, setValue] = useState("");
//     const handleChange = (event) => setUsername(event.target.value);
//     return (
//       <>
//         {/* <Text mb="8px">username: {username}</Text> */}
//         <Input
//           value={username}
//           onChange={handleChange}
//           placeholder="enter username"
//           size="sm"
//           autoFocus
//         />
//       </>
//     );
//   }
  function Email() {
    // const [email, setValue] = useState("");
    const handleChange = (event) => setEmail(event.target.value);
    return (
      <>
        {/* <Text mb="8px">email: {email}</Text> */}
        <Input
          value={email}
          onChange={handleChange}
          placeholder="enter valid email"
          size="sm"
        />
      </>
    );
  }
  function Password() {
    // const [password, setValue] = useState("");
    const handleChange = (event) => setPassword(event.target.value);
    
    return (
      <>
        {/* <Text mb="8px">Password: {password}</Text> */}
        <Input
          value={password}
          onChange={handleChange}
          placeholder="enter password"
          size="sm"
        />
      </>
    );
  }
  function ConfirmationPassword() {
    // const [password, setValue] = useState("");
    const handleChange = (event) => setConfirmationPassword(event.target.value);
    
    return (
      <>
        {/* <Text mb="8px">Password: {password}</Text> */}
        <Input
          value={confirmationPassword}
          onChange={handleChange}
          placeholder="enter password again"
          size="sm"
        />
      </>
    );
  }
  function SubmitButton() {
    const [allSet, setValue] = useState(false);
    // function formCheck() {
    //     if(password&&confirmationPassword&&username&&email) {
    //         setValue(true)
    //     } else {
    //         console.log("not ready")
    //     }
    // }
    return (
        <Button colorScheme='teal' variant='solid'>SUBMIT</Button>
    )
  }
  return (
    <div>
      <h2>Signup</h2>
      <Username username={username} setUsername={setUsername}/>
      <Email />
      <Password  />
      <ConfirmationPassword/>
      <SubmitButton/>
    </div>
  );
}
