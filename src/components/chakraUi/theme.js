// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";



export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF3c00",
    },
  },
  fonts: {
    body: 'Open Sans, sans-serif',
  },
  styles: {
    global: (props) => ({
      body: {
        bg: 'gray.100',
      },
    }),
  },
  components: {
     Button,
  },
});
