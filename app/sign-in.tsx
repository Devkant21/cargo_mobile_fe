import { useAuthStore } from "@/store/authStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GoogleUserInfo {
  email: string;
  name?: string | null;
  photo?: string | null;
}

export default function SignIn() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: false,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      const googleUser: GoogleUserInfo = {
        email: (response as any).user?.email ?? "",
        name: (response as any).user?.name ?? null,
        photo: (response as any).user?.photo ?? null,
      };

      setUser(googleUser);
      router.replace("/");
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        setError("Sign-in cancelled");
      } else if (err.code === statusCodes.IN_PROGRESS) {
        setError("Sign-in already in progress");
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Google Play Services not available or outdated");
      } else {
        setError(err.message || "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="justify-center items-center p-6"
      >
        <Text className="text-3xl font-bold text-[#12264b] mb-10">
          Sign in to Cargo
        </Text>

        {loading ? (
          <View className="mt-4">
            <Text className="text-gray-500">Signing in...</Text>
          </View>
        ) : (
          <TouchableOpacity
            className="flex-row items-center bg-[#DB4437] px-6 py-3 rounded-lg"
            onPress={handleGoogleSignIn}
          >
            <MaterialCommunityIcons name="google" size={24} color="#fff" />
            <Text className="text-white font-semibold text-lg ml-3">
              Sign in with Google
            </Text>
          </TouchableOpacity>
        )}

        {error && (
          <Text className="text-red-500 mt-4 text-center">{error}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
