// Side-effect CSS imports (e.g. import "./index.css") have no type declarations
// under moduleResolution "bundler". This shim makes them valid for type-checking.
declare module "*.css";
