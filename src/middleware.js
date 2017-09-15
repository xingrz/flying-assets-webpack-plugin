export default function webpackAssetsMiddleware(compiler) {
  return (req, res, next) => {
    res.send(compiler.html);
  };
};
