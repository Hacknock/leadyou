const hoge = "abbbabbabbbaabbbaabbaabbab";

const regex = new RegExp(String.raw`ab+a`, "g");
const meu = hoge.match(regex);
const piyo = meu.map((m) => {
  return m.match(/a(b+)a/)[1];
});

console.log(piyo);
