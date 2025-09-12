import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearUser();
    router.replace("/home");
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#f5f4ee] items-center justify-center px-6">
        <Text className="text-[#5b2417] text-xl font-medium">
          You are not logged in.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee] px-6">
      <View className="flex-1 items-center justify-center gap-6">
        {/* Profile Picture */}
        {user.picture ? (
          <Image
            source={{ uri: user.picture }}
            className="w-32 h-32 rounded-full"
          />
        ) : (
          <View className="w-32 h-32 rounded-full bg-gray-300 items-center justify-center">
            <Text className="text-4xl text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
        )}

        {/* User Info */}
        <Text className="text-2xl font-bold text-[#5b2417]">
          {user.name || "Unnamed User"}
        </Text>
        <Text className="text-lg text-[#5b2417]/80">{user.email}</Text>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 bg-[#5b2417] px-6 py-3 rounded-md"
        >
          <Text className="text-white font-medium text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
