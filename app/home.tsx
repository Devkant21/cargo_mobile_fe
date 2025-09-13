import { useAuthStore } from "@/store/authStore";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ConditionsModal from "@/components/modal/ConditionsModal";
import PrivacyModal from "@/components/modal/PrivacyModal";
import { useRouter } from "expo-router";

interface GoogleUserInfo {
  email: string;
  name?: string | null;
  photo?: string | null;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, setUser, clearUser, isLoggedIn } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);
  const [isConditionsVisible, setIsConditionsVisible] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: false,
    });

    if (isLoggedIn && user) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, user]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data || !userInfo.data.user) {
        throw new Error("Google Sign-In did not return user data");
      }

      const googleUser: GoogleUserInfo = {
        email: userInfo.data.user.email,
        name: userInfo.data.user.name ?? null,
        photo: userInfo.data.user.photo ?? null,
      };

      setUser({
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.photo,
      });

      router.replace("/(tabs)");
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
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <View className="flex-1 items-center justify-center px-6">
        {/* App Name */}
        <Text className="text-3xl font-black text-[#5b2417] mb-10">
          Orbits Movers
        </Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <View
                style={{
                  width: 200,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <ActivityIndicator size="small" color="#4285F4" />
              </View>
            ) : (
              <Image
                source={require("../assets/images/googleSignIn.png")}
                style={{ width: 280, height: 50, resizeMode: "contain" }}
              />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Terms & Privacy */}
        <View className="w-full max-w-[320px] mt-8">
          <Text className="text-center text-sm leading-tight text-black/70">
            By signing in, you agree to Orbits Movers and Packers{" "}
            <Text
              className="underline text-[#5b2417]/80"
              onPress={() => setIsConditionsVisible(true)}
            >
              Conditions of Use
            </Text>{" "}
            and{" "}
            <Text
              className="underline text-[#5b2417]/80"
              onPress={() => setIsPrivacyVisible(true)}
            >
              Privacy Notice
            </Text>
          </Text>
        </View>
      </View>

      <ConditionsModal
        visible={isConditionsVisible}
        onClose={() => setIsConditionsVisible(false)}
      />
      <PrivacyModal
        visible={isPrivacyVisible}
        onClose={() => setIsPrivacyVisible(false)}
      />
    </SafeAreaView>
  );
}
