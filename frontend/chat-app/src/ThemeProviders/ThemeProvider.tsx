import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode, useMemo, useState } from "react";
import { PaletteMode } from "@mui/material";

interface ThemeProps {
  children: ReactNode;
}

export const CustomThemeProvider = ({ children }: ThemeProps) => {
  const [mode, setMode] = useState<PaletteMode>("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
