import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HelperSelectorCardProps {
  helperCount: number;
  helperPrice: number;
  loading?: boolean;
  maxHelpers?: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function HelperSelectorCard({
  helperCount,
  helperPrice,
  loading = false,
  maxHelpers = 5,
  onIncrease,
  onDecrease,
}: HelperSelectorCardProps) {
  return (
    <View className="mx-3 mt-2 rounded-3xl border border-zinc-200 bg-white p-5">
      <Text className="text-xl font-bold text-zinc-900">Extra Helpers</Text>

      <Text className="mt-1 text-sm leading-5 text-zinc-500">
        Need help loading or unloading? Add helpers and we'll instantly
        recalculate your estimate.
      </Text>

      <View className="mt-5 flex-row items-center justify-between rounded-2xl bg-zinc-50 p-4">
        <View>
          <Text className="text-base font-semibold text-zinc-900">
            {helperCount} {helperCount === 1 ? "Helper" : "Helpers"}
          </Text>

          <Text className="mt-1 text-sm text-zinc-500">
            ₹{helperPrice.toLocaleString("en-IN")} each
          </Text>
        </View>

        <View className="flex-row items-center rounded-full border border-zinc-200 bg-white">
          <Pressable
            onPress={onDecrease}
            disabled={helperCount === 0 || loading}
            className={`h-12 w-12 items-center justify-center ${
              helperCount === 0 || loading ? "opacity-40" : "active:bg-zinc-100"
            }`}
          >
            <Ionicons name="remove" size={22} color="#18181b" />
          </Pressable>

          <View className="w-12 items-center">
            <Text className="text-lg font-bold text-zinc-900">
              {helperCount}
            </Text>
          </View>

          <Pressable
            onPress={onIncrease}
            disabled={helperCount >= maxHelpers || loading}
            className={`h-12 w-12 items-center justify-center ${
              helperCount >= maxHelpers || loading
                ? "opacity-40"
                : "active:bg-zinc-100"
            }`}
          >
            <Ionicons name="add" size={22} color="#16a34a" />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <Text className="mt-3 text-sm text-green-600">
          Updating estimate...
        </Text>
      ) : helperCount === 0 ? (
        <Text className="mt-3 text-sm text-zinc-500">No helpers selected.</Text>
      ) : (
        <Text className="mt-3 text-sm text-zinc-500">
          Labour charges will be reflected in the price breakdown below.
        </Text>
      )}
    </View>
  );
}
