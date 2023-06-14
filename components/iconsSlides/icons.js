import Image from "next/legacy/image";

export const eventSvgArray = [
  "beer.svg",
  "car.svg",
  "coffee.svg",
  "heart.svg",
  "movie.svg",
  "gift.svg",
  "cutlery.svg",
  "shopping.svg",
  "cog.svg",
];

const eventIcons = eventSvgArray.map((a) => {
  return (props) => {
    const obj = {
      name: a,
      icon: <Image {...props} src={`/svgs/events/${a}`} padding='20rem' layout="fill" objectFit="content" alt={a}/>,
    };
    return obj;
  };
});

const getIconObj = (name) => {
    const eventIcon = eventIcons.find((e) => e().name === name);
    return eventIcon

}
export { eventIcons, getIconObj };

// below is font var example
// const eventIcons = [
//   (props) => {
//     const color = 'red'
//     const obj = {
//       name: "coffee",
//       icon: <GiCoffeeCup color={color} {...props}/>,
//     };
//     return obj
//   },
//   (props) => {
//     const color = 'red'
//     const obj = {
//       name: "airplane",
//       icon: <GiCommercialAirplane color={color} {...props}/>,
//     };
//     return obj
//   },
//   (props) => {
//     const color = 'red'
//     const obj = {
//       name: "party",
//       icon: <GiPartyPopper color={color} {...props}/>,
//     };
//     return obj
//   },
//   (props) => {
//     const color = 'red'
//     const obj = {
//       name: "restaurant",
//       icon: <IoRestaurantOutline color={color} {...props}/>,
//     };
//     return obj
//   },
//   (props) => {
//     const color = 'red'
//     const obj = {
//       name: "beer",
//       icon: <IoBeerSharp color={color} {...props}/>,
//     };
//     return obj
//   },
//   (props) => {
//     const color = 'red'
//     const obj = {
//       name: "cake",
//       icon: <RiCake2Fill color={color} {...props}/>,
//     };
//     return obj
//   },
//   (props) => {
//     const color = 'red'
//     const obj = {
//       name: "movie",
//       icon: <BiMoviePlay color={color} {...props}/>,
//     };
//     return obj
//   },
//   (props) => {
//     const color = 'red'
//     const obj = {
//       name: "cog",
//       icon: <GiCog color={color} {...props}/>,
//     };
//     return obj
//   },
// ];

// export { eventIcons };
