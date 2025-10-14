import "../global.css";

import { AuthProvider } from "@/context/AuthContext";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f5f4ee" },
        }}
      >
        <Stack.Screen name="home" />
      </Stack>
    </AuthProvider>
  );
}
