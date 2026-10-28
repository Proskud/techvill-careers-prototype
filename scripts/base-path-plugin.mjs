// Prefix root-relative site paths ("/assets/…", "/blog", "/#technology", "/") with Vite's `base` at build time,
// so the same source runs at "/" locally and from a sub-folder such as GitHub Pages' "/<repo>/". Routing keeps
// working because both the compared pathname and the prefixed route literals carry the base.
// Protocol-relative URLs ("//…"), imports and regular expressions are left alone.
export default function basePathPlugin(base = "/") {
  const prefix = base.replace(/\/$/, "");
  const needsPrefix = (value) => typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith(`${prefix}/`);
  return () => ({
    name: "techvill-base-path",
    visitor: prefix ? {
      StringLiteral(path) {
        if (path.parentPath.isImportDeclaration() || path.parentPath.isExportNamedDeclaration() || path.parentPath.isExportAllDeclaration()) return;
        if (path.parentPath.isCallExpression() && path.parent.callee.type === "Import") return;
        if (needsPrefix(path.node.value)) path.node.value = prefix + path.node.value;
      },
      TemplateLiteral(path) {
        if (path.parentPath.isTaggedTemplateExpression()) return;
        const first = path.node.quasis[0];
        if (!needsPrefix(first.value.cooked)) return;
        first.value.cooked = prefix + first.value.cooked;
        first.value.raw = prefix + first.value.raw;
      },
    } : {},
  });
}
