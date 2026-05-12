export { lightTheme } from "./light";
export { darkTheme } from "./dark";

export const themes = {
  light: () => import("./light").then((m) => m.lightTheme),
  dark: () => import("./dark").then((m) => m.darkTheme),
};
