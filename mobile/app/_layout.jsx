import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ThemeProvider } from "@/context/ThemeContext";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ThemeProvider>
        <SafeScreen>
          <Slot />
        </SafeScreen>
      </ThemeProvider>
    </ClerkProvider>
  );
}
