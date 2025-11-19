import { extendTheme } from 'native-base';
import { colors, spacing, borderRadius, fontSize } from './tokens';

/**
 * NativeBase Theme Configuration
 * Extends the default NativeBase theme with our custom design tokens
 */
export const nativeBaseTheme = extendTheme({
  colors: {
    // Map our design tokens to NativeBase color system
    primary: {
      50: colors.primary[50],
      100: colors.primary[100],
      200: colors.primary[200],
      300: colors.primary[300],
      400: colors.primary[400],
      500: colors.primary[500],
      600: colors.primary[600],
      700: colors.primary[700],
      800: colors.primary[800],
      900: colors.primary[900],
    },
    secondary: {
      50: colors.secondary[50],
      100: colors.secondary[100],
      200: colors.secondary[200],
      300: colors.secondary[300],
      400: colors.secondary[400],
      500: colors.secondary[500],
      600: colors.secondary[600],
      700: colors.secondary[700],
      800: colors.secondary[800],
      900: colors.secondary[900],
    },
    success: {
      50: colors.success[50],
      500: colors.success[500],
      700: colors.success[700],
    },
    error: {
      50: colors.error[50],
      500: colors.error[500],
      700: colors.error[700],
    },
    warning: {
      50: colors.warning[50],
      500: colors.warning[500],
      700: colors.warning[700],
    },
    info: {
      50: colors.info[50],
      500: colors.info[500],
      700: colors.info[700],
    },
  },

  // Font configuration
  fonts: {
    heading: "System",
    body: "System",
    mono: "Courier",
  },

  fontSizes: {
    "2xs": fontSize.xs,
    xs: fontSize.xs,
    sm: fontSize.sm,
    md: fontSize.base,
    lg: fontSize.lg,
    xl: fontSize.xl,
    "2xl": fontSize["2xl"],
    "3xl": fontSize["3xl"],
    "4xl": fontSize["4xl"],
    "5xl": fontSize["5xl"],
    "6xl": fontSize["6xl"],
  },

  // Spacing configuration
  space: {
    0: spacing[0],
    1: spacing[1],
    2: spacing[2],
    3: spacing[3],
    4: spacing[4],
    5: spacing[5],
    6: spacing[6],
    8: spacing[8],
    10: spacing[10],
    12: spacing[12],
    16: spacing[16],
    20: spacing[20],
    24: spacing[24],
    32: spacing[32],
  },

  // Border radius configuration
  radii: {
    none: borderRadius.none,
    sm: borderRadius.sm,
    md: borderRadius.md,
    lg: borderRadius.lg,
    xl: borderRadius.xl,
    "2xl": borderRadius["2xl"],
    "3xl": borderRadius["3xl"],
    full: borderRadius.full,
  },

  // Component-specific overrides
  components: {
    Button: {
      // Default button styling
      baseStyle: {
        rounded: "lg",
        _text: {
          fontWeight: "semibold",
        },
      },
      // Button sizes
      sizes: {
        sm: {
          px: 4,
          py: 2,
          _text: {
            fontSize: "sm",
          },
        },
        md: {
          px: 6,
          py: 3,
          _text: {
            fontSize: "md",
          },
        },
        lg: {
          px: 8,
          py: 4,
          _text: {
            fontSize: "lg",
          },
        },
      },
      // Default variant
      defaultProps: {
        size: "md",
        variant: "solid",
      },
    },

    Input: {
      baseStyle: {
        rounded: "md",
        px: 4,
        py: 3,
        fontSize: "md",
        borderWidth: 1,
        borderColor: "gray.300",
        _focus: {
          borderColor: "primary.500",
          bg: "white",
        },
      },
      defaultProps: {
        size: "md",
      },
    },

    Card: {
      baseStyle: {
        rounded: "xl",
        p: 4,
        bg: "white",
        shadow: 2,
      },
    },

    Heading: {
      baseStyle: {
        fontWeight: "bold",
        color: "gray.900",
      },
      sizes: {
        sm: {
          fontSize: "lg",
        },
        md: {
          fontSize: "2xl",
        },
        lg: {
          fontSize: "3xl",
        },
        xl: {
          fontSize: "4xl",
        },
      },
      defaultProps: {
        size: "md",
      },
    },

    Text: {
      baseStyle: {
        color: "gray.700",
      },
      sizes: {
        sm: {
          fontSize: "sm",
        },
        md: {
          fontSize: "md",
        },
        lg: {
          fontSize: "lg",
        },
      },
      defaultProps: {
        size: "md",
      },
    },
  },

  // Global configuration
  config: {
    // Changing initialColorMode to 'light' or 'dark'
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export type NativeBaseTheme = typeof nativeBaseTheme;

export default nativeBaseTheme;
