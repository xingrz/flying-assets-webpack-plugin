export default function(compiler) {
  return (req, res, next) => {
    res.send(compiler.html);
  };
};
