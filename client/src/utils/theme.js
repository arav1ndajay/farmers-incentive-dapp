import { createCss } from "@stitches/react";

const primaryColor = "#FF4242";
const textColor = "#787878";
const darkBg = "#201e1d";
const success = "#4ebf2b";
const error = "#f2541f";
const warning = "#e8bd00";
const info = "#3B7BF9";

export const { styled, css, global, keyframes, getCssString, theme } =
  createCss({
    theme: {
      colors: {
        gray400: "gainsboro",
        gray500: "lightgray",
      },
    },
    media: {
      bp1: "(max-width: 960px)",
      bp2: "(max-width: 768px)",
    },
    utils: {
      marginX: (config) => (value) => ({
        marginLeft: value,
        marginRight: value,
      }),
    },
  });
