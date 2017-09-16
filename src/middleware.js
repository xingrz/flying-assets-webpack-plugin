export default function webpackAssetsMiddleware(compiler, options = {}) {
  return (req, res, next) => {
    res.locals.assets = compiler.assets;
    if (typeof options.render != 'boolean' || options.render) {
      res.send(compiler.html);
    } else {
      next();
    }
  };
};
