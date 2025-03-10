// src/App.tsx
import ModelSwitcher from "@components/chat/ModelSwitcher.tsx";
import ChatBox from "./components/chat/ChatBox.tsx";
import { ChatProvider } from "./context/ChatContext.tsx";
import { CustomThemeProvider } from "./ThemeProviders/ThemeProvider";
import UserProfile from "@components/chat/UserProfile.tsx";
import { Box, AppBar, Toolbar } from "@mui/material";

function App() {
  return (
    <CustomThemeProvider>
      <ChatProvider>
        {/* Left Side: Model Switcher */}

        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ModelSwitcher />
            </Box>

            {/* Right Side: User Profile */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <UserProfile />
            </Box>
          </Toolbar>
        </AppBar>
        <ChatBox />
      </ChatProvider>
    </CustomThemeProvider>
  );
}

export default App;
