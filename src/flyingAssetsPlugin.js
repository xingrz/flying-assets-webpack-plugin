import { compileFile } from 'pug';

export default class FlyingAssetsPlugin {

  assets = {};

  constructor(template) {
    this.render = compileFile(template);
  }

  apply(compiler) {
    this.compiler = compiler;
    compiler.plugin('emit', this.compile.bind(this));
  }

  compile(compilation, callback) {
    compilation.chunks.forEach((chunk) => {
      this.assets[chunk.name] = {
        styles: [],
        scripts: [],
      };

      const assets = this.assets[chunk.name];
      chunk.files.forEach(file => {
        if (file.match(/\.css$/)) {
          assets.styles.push(file);
        } else if (file.match(/\.js$/)) {
          assets.scripts.push(file);
        } else {
          // ignored unknown file types
        }
      });
    });

    const html = this.render({
      assets: this.assets,
      publicPath: this.compiler.options.output.publicPath,
    });

    compilation.assets['index.html'] = {
      source: () => html,
      size: () => html.length,
    };

    this.compiler.html = html;

    callback();
  }

}
