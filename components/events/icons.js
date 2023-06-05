import {
  GiCoffeeCup,
  GiCommercialAirplane,
  GiPartyPopper,
} from "react-icons/gi";
import { IoRestaurantOutline, IoBeerSharp } from "react-icons/io5";
import { RiCake2Fill } from "react-icons/ri";
import { BiMoviePlay } from "react-icons/bi";
import { GiCog } from "react-icons/gi";
const eventIcons = [
  (props) => {
    const color = 'red'
    const obj = {
      name: "coffee",
      icon: <GiCoffeeCup color={color} {...props}/>,
    };
    return obj
  },
  (props) => {
    const color = 'red'
    const obj = {
      name: "airplane",
      icon: <GiCommercialAirplane color={color} {...props}/>,
    };
    return obj
  },
  (props) => {
    const color = 'red'
    const obj = {
      name: "party",
      icon: <GiPartyPopper color={color} {...props}/>,
    };
    return obj
  },
  (props) => {
    const color = 'red'
    const obj = {
      name: "restaurant",
      icon: <IoRestaurantOutline color={color} {...props}/>,
    };
    return obj
  },
  (props) => {
    const color = 'red'
    const obj = {
      name: "beer",
      icon: <IoBeerSharp color={color} {...props}/>,
    };
    return obj
  },
  (props) => {
    const color = 'red'
    const obj = {
      name: "cake",
      icon: <RiCake2Fill color={color} {...props}/>,
    };
    return obj
  },
  (props) => {
    const color = 'red'
    const obj = {
      name: "movie",
      icon: <BiMoviePlay color={color} {...props}/>,
    };
    return obj
  },
  (props) => {
    const color = 'red'
    const obj = {
      name: "cog",
      icon: <GiCog color={color} {...props}/>,
    };
    return obj
  },
];

export { eventIcons };
