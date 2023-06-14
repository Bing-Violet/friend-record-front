import Image from "next/legacy/image";

export const avatarSvgArray = [
  "avatar-man1.svg",
  "avatar-man2.svg",
  "avatar-man3.svg",
  "avatar-man4.svg",
  "avatar-man5.svg",
  "avatar-woman1.svg",
  "avatar-woman2.svg",
  "avatar-woman3.svg",
  "avatar-woman4.svg",
  "avatar-woman5.svg",
];

const avatars = avatarSvgArray.map((a) => {
  return (props) => {
    const obj = {
      name: a,
      icon: <Image {...props} src={`/svgs/friends/${a}`}  layout="fill" objectFit="content" alt={a}/>,
    };
    return obj;
  };
});

const getAvaterObj = (name) => {
    const avatar = avatars.find((e) => e().name === name);
    return avatar

}
export { avatars, getAvaterObj };
