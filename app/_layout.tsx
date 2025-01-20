import { AuthContextProvider, useAuth } from "@/hooks/AuthContext";
import { NotificationContextProvider } from "@/hooks/NotificationContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import FlashMessage from "react-native-flash-message";
export default function RootLayout() {
  const router = useRouter();
  const MainLayout = () => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
      if (isAuthenticated) {
        router.replace("/screens/App");
      } else {
        router.replace("/");
      }
    }, [isAuthenticated]);

    return (
      <MenuProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="screens/App" />
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack>
        <FlashMessage position="top" /> {/* <--- here as the last component */}
      </MenuProvider>
    );
  };
  return (
    <AuthContextProvider>
      <NotificationContextProvider>
        <MainLayout />
      </NotificationContextProvider>
    </AuthContextProvider>
  );
}
