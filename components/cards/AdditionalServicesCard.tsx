import { Ionicons } from "@expo/vector-icons";
import { Switch, Text, TouchableOpacity, View } from "react-native";

interface AdditionalServicesCardProps {
  helpers: number;
  maxHelpers: number;
  helperPrice?: number;

  //   driverAssistance: boolean;
  //   driverAssistPrice?: number;

  onHelpersChange: (value: number) => void;
  //   onDriverAssistanceChange: (value: boolean) => void;
}

export default function AdditionalServicesCard({
  helpers,
  maxHelpers,
  helperPrice = 0,

  //   driverAssistance,
  //   driverAssistPrice = 0,

  onHelpersChange,
  //   onDriverAssistanceChange,
}: AdditionalServicesCardProps) {
  const showHelpers = maxHelpers > 0;
  //   const showDriverAssist = driverAssistPrice > 0;

  //   if (!showHelpers && !showDriverAssist) {
  if (!showHelpers) {
    return null;
  }

  return (
    <View>
      <Text className="mb-3 text-xl font-semibold text-zinc-900">
        Additional Services
      </Text>

      <View className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        {showHelpers && (
          <View className="p-5">
            <View className="flex-row items-center">
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                <Ionicons name="people-outline" size={24} color="#16a34a" />
              </View>

              <View className="flex-1">
                <Text className="text-base font-semibold text-zinc-900">
                  Helpers
                </Text>

                <Text className="mt-1 text-sm text-zinc-500">
                  Additional people to help load & unload your belongings.
                </Text>

                {helperPrice > 0 && (
                  <Text className="mt-2 text-xs font-medium text-green-600">
                    ₹{helperPrice} per helper
                  </Text>
                )}
              </View>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={helpers === 0}
                onPress={() => onHelpersChange(Math.max(0, helpers - 1))}
                className={`h-11 w-11 items-center justify-center rounded-full border ${
                  helpers === 0
                    ? "border-zinc-200 bg-zinc-100"
                    : "border-green-600 bg-green-600"
                }`}
              >
                <Ionicons
                  name="remove"
                  size={22}
                  color={helpers === 0 ? "#9ca3af" : "#fff"}
                />
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-3xl font-bold text-zinc-900">
                  {helpers}
                </Text>

                <Text className="mt-1 text-xs text-zinc-500">
                  Max {maxHelpers}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={helpers >= maxHelpers}
                onPress={() =>
                  onHelpersChange(Math.min(maxHelpers, helpers + 1))
                }
                className={`h-11 w-11 items-center justify-center rounded-full border ${
                  helpers >= maxHelpers
                    ? "border-zinc-200 bg-zinc-100"
                    : "border-green-600 bg-green-600"
                }`}
              >
                <Ionicons
                  name="add"
                  size={22}
                  color={helpers >= maxHelpers ? "#9ca3af" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* {showHelpers && showDriverAssist && (
          <View className="mx-5 h-px bg-zinc-100" />
        )}

        {showDriverAssist && (
          <View className="p-5">
            <View className="flex-row items-center justify-between">
              <View className="mr-4 flex-1">
                <Text className="text-base font-semibold text-zinc-900">
                  Driver Assistance
                </Text>

                <Text className="mt-1 text-sm text-zinc-500">
                  Driver can also help with loading & unloading.
                </Text>

                <Text className="mt-2 text-xs font-medium text-green-600">
                  +₹{driverAssistPrice}
                </Text>
              </View>

              <Switch
                value={driverAssistance}
                onValueChange={onDriverAssistanceChange}
                trackColor={{
                  false: "#d4d4d8",
                  true: "#22c55e",
                }}
                thumbColor="#fff"
              />
            </View>
          </View>
        )} */}
      </View>
    </View>
  );
}
