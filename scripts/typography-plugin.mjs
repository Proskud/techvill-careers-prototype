import { bindShortWords } from "../src/data/typography.mjs";

// Run on the project's existing Babel pipeline, before JSX compilation. This
// covers static JSX, data-driven cards, tooltips, modal copy and template parts
// without observers or editing React-owned text nodes after rendering.
export default function typographyPlugin({ types }) {
  const humanText = (value) => /[А-Яа-яЁё]/u.test(value) && !/^(?:https?:|mailto:|tel:|data:|\/|#)/i.test(value);
  return {
    name: "techvill-text-typography",
    visitor: {
      StringLiteral(path) {
        if (!humanText(path.node.value)) return;
        if (path.parentPath.isImportDeclaration() || path.parentPath.isExportNamedDeclaration() || path.parentPath.isExportAllDeclaration()) return;
        if (path.key === "key" && path.parentPath.isObjectProperty() && !path.parent.computed) return;
        // Transferred Markdown is formatted when displayed, after image URLs
        // are parsed. Do not alter its original source or Markdown structure.
        if (path.parentPath.isObjectProperty() && (path.parent.key.name ?? path.parent.key.value) === "content") return;
        if (path.parentPath.isJSXAttribute() && /^(href|src|srcSet|id|name|value|pattern|className|htmlFor|data-)/.test(path.parent.name.name)) return;
        const formatted = bindShortWords(path.node.value);
        // JSX attribute quotes do not interpret JS escapes such as \xA0.
        // Use a JS expression so Babel/esbuild decode Unicode exactly once.
        if (path.parentPath.isJSXAttribute()) {
          path.replaceWith(types.jsxExpressionContainer(types.stringLiteral(formatted)));
          path.skip();
        } else {
          path.node.value = formatted;
        }
      },
      JSXText(path) {
        path.node.value = bindShortWords(path.node.value);
      },
      TemplateElement(path) {
        if (path.parentPath.parentPath?.isTaggedTemplateExpression()) return;
        if (!humanText(path.node.value.cooked ?? "")) return;
        path.node.value.raw = bindShortWords(path.node.value.raw);
        path.node.value.cooked = bindShortWords(path.node.value.cooked);
      },
    },
  };
}
