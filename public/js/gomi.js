const array = [
  ["a", "b"],
  ["c", "d"],
  ["e", "f"],
];

const result = array.reduce((prev, current) => {
  console.log("prev:" + prev);
  console.log("current:" + current);
  return prev + current[0] + current[1];
}, "");

console.log(result);
