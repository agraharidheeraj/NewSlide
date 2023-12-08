export const Button = {
    baseStyle: {
      borderRadius: "4rem",
      fontSize: "10pt",
      fontWeight: 700,
      _focus: {
        boxShadow: "none",
      },
    },
    sizes: {
      sm: {
        fontSize: "8pt",
      },
      md: {
        fontSize: "10pt",
      },
    },
    variants: {
      solid: {
        color: "white",
        bg: "blue.500",
        _hover: {
          bg: "blue.400",
        },
      },
      outline: {
        color: "blue.500",
        border: "1px solid",
        borderColor: "blue.500",
      },
      googleauth: {
        height: "34px",
        border: "1px solid",
        borderColor: "gray.300",
        _hover: {
          bg: "gray.50",
        },
      },
    },
  };
  