import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface EstimateFooterProps {
  total?: string;
  calculating?: boolean;
  submitting?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export default function EstimateFooter({
  total,
  calculating = false,
  submitting = false,
  onPress,
  disabled = false,
}: EstimateFooterProps) {
  const loading = calculating || submitting;

  const title = calculating
    ? "Calculating Fare..."
    : submitting
      ? "Submitting Booking..."
      : disabled
        ? "Upload Payment Screenshot"
        : "Confirm Booking";

  const subtitle = calculating
    ? "Please wait while we calculate your trip"
    : submitting
      ? "Sending your booking request"
      : disabled
        ? "Upload your UPI payment screenshot to continue"
        : "Review and confirm your booking";

  return (
    <View className="border-t border-zinc-200 bg-white px-6 pt-4 pb-6">
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={loading || disabled}
        onPress={onPress}
        className={`rounded-2xl px-5 py-4 ${
          loading ? "bg-green-500" : disabled ? "bg-zinc-300" : "bg-green-600"
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View
              className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${
                disabled && !loading ? "bg-zinc-400" : "bg-white/20"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name={
                    disabled
                      ? "lock-closed-outline"
                      : "checkmark-circle-outline"
                  }
                  size={22}
                  color="white"
                />
              )}
            </View>

            <View className="flex-1">
              <Text
                className={`text-lg font-semibold ${
                  disabled && !loading ? "text-zinc-700" : "text-white"
                }`}
              >
                {title}
              </Text>

              <Text
                className={`mt-1 text-sm ${
                  disabled && !loading ? "text-zinc-500" : "text-white/80"
                }`}
              >
                {subtitle}
              </Text>
            </View>
          </View>

          {!disabled && total && (
            <View className="ml-4 items-end">
              <Text className="text-2xl font-bold text-white">{total}</Text>

              <Ionicons name="arrow-forward" size={22} color="white" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View className="mt-4 flex-row items-center justify-center">
        <View className="flex-row items-center">
          <Ionicons name="shield-checkmark-outline" size={18} color="#16a34a" />
          <Text className="ml-2 text-sm text-zinc-600">Secure Booking</Text>
        </View>

        <View className="mx-4 h-4 w-px bg-zinc-300" />

        <View className="flex-row items-center">
          <Ionicons name="receipt-outline" size={18} color="#16a34a" />
          <Text className="ml-2 text-sm text-zinc-600">Final Price</Text>
        </View>
      </View>
    </View>
  );
}
