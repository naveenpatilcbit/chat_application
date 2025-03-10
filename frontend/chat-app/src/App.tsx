// src/App.tsx
import ChatBox from "./components/chat/ChatBox.tsx";
import { ChatProvider } from "./context/ChatContext.tsx";
import { CustomThemeProvider } from "./ThemeProviders/ThemeProvider";

function App() {
  return (
    <CustomThemeProvider>
      <ChatProvider>
        <ChatBox />
      </ChatProvider>
    </CustomThemeProvider>
  );
}

export default App;
