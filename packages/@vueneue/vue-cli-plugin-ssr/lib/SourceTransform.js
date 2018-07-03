const recast = require('recast');
const babel = require('@babel/parser');

const babelParser = {
  parse: source =>
    babel.parse(source, {
      sourceType: 'module',
      plugins: ['objectRestSpread', 'typescript'],
    }),
};

/**
 * Class to transform easly Vue base files (main.js, router.js, store.js)
 */
class SourceTransform {
  constructor(source, customParser = null) {
    this.source = source;

    // Use babel parser to support rest/spread
    this.ast = recast.parse(source, {
      parser: customParser || babelParser,
    });
  }

  /**
   * Add code after imports statements
   * @param {string} code
   */
  addImport(code) {
    const toImport = i => recast.parse(`${i}\n`).program.body[0];

    let lastImportIndex = -1;
    recast.types.visit(this.ast, {
      visitImportDeclaration: ({ node }) => {
        lastImportIndex = this.ast.program.body.findIndex(n => n === node);
        return false;
      },
    });

    delete this.ast.program.body[lastImportIndex].loc;
    const newImport = toImport(code);
    this.ast.program.body.splice(lastImportIndex + 1, 0, newImport);
  }

  /**
   * Remove an import by module name
   * @param {string} moduleName
   */
  removeImport(moduleName) {
    recast.types.visit(this.ast, {
      visitImportDeclaration: nodePath => {
        const { node } = nodePath;
        if (node.source.value == moduleName) {
          nodePath.prune();
        }
        return false;
      },
    });
  }

  /**
   * Remove Vue.use() statement
   * @param {string} useName
   */
  removeVueUse(useName) {
    recast.types.visit(this.ast, {
      visitCallExpression: nodePath => {
        const { node } = nodePath;
        if (node.callee.type === 'MemberExpression') {
          if (
            node.callee.object.name === 'Vue' &&
            node.callee.property.name === 'use' &&
            node.arguments[0].name === useName
          ) {
            nodePath.prune();
          }
        }
        return false;
      },
    });
  }

  /**
   * Replace `export default new` by an arrow function
   * @param {string} className
   */
  replaceExportNewToArrow(className) {
    const builder = recast.types.builders;

    recast.types.visit(this.ast, {
      visitNewExpression(nodePath) {
        const { node } = nodePath;

        const { parentPath } = nodePath;
        const parentNode = parentPath.node;

        if (
          (node.callee.name === className ||
            node.callee.property.name === className) &&
          parentNode.type === 'ExportDefaultDeclaration'
        ) {
          const returnStatement = builder.returnStatement(node);
          const blockStatement = builder.blockStatement([returnStatement]);
          const arrowFunc = builder.arrowFunctionExpression([], blockStatement);
          nodePath.replace(arrowFunc);
        }
        return false;
      },
    });
  }

  /**
   * Add a variable to a new statement (eg new Vue(options))
   * @param {string} className
   * @param {string} code
   * @param {int} index
   */
  addToNew(className, code, toEnd = false) {
    const toProperty = i => {
      return recast.parse(`({${i}})`).program.body[0].expression.properties;
    };
    recast.types.visit(this.ast, {
      visitNewExpression: ({ node }) => {
        if (node.callee.name === className) {
          const options = node.arguments[0];
          if (options && options.type === 'ObjectExpression') {
            const props = options.properties;
            if (!toEnd) {
              options.properties = [...[].concat(toProperty(code)), ...props];
            } else {
              options.properties = [...props, ...[].concat(toProperty(code))];
            }
          }
        }
        return false;
      },
    });
  }

  print() {
    return recast.print(this.ast).code;
  }
}

module.exports = SourceTransform;
