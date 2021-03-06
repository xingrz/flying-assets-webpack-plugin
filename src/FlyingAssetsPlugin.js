import { compileFile } from 'pug';

export default class FlyingAssetsPlugin {

  constructor(render, options) {
    if (typeof options == 'undefined' && typeof render == 'object') {
      options = render;
      render = undefined;
    }

    if (typeof render == 'string') {
      this.render = compileFile(render);
    } else if (typeof render == 'function') {
      this.render = render;
    }

    this.options = {
      html: true,
      json: false,
      ...options,
    };
  }

  apply(compiler) {
    this.compiler = compiler;
    compiler.assets = {};
    compiler.plugin('emit', this.compile.bind(this));
  }

  compile(compilation, callback) {
    compilation.chunks.forEach((chunk) => {
      this.compiler.assets[chunk.name] = {
        styles: [],
        scripts: [],
      };

      const assets = this.compiler.assets[chunk.name];
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

    if (this.options.html && typeof this.render == 'function') {
      const html = this.render({
        assets: this.compiler.assets,
        publicPath: this.compiler.options.output.publicPath,
      });

      compilation.assets['index.html'] = {
        source: () => html,
        size: () => html.length,
      };

      this.compiler.html = html;
    }

    if (this.options.json) {
      const json = JSON.stringify(this.compiler.assets);
      compilation.assets['assets.json'] = {
        source: () => json,
        size: () => json.length,
      };
    }

    callback();
  }

}
