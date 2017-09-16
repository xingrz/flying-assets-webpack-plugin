export default function webpackAssetsMiddleware(compiler, options = {}) {
  options = {
    render: true,
    ... options,
  };

  return (req, res, next) => {
    res.locals.assets = compiler.assets;
    if (options.render) {
      res.send(compiler.html);
    } else {
      next();
    }
  };
};
