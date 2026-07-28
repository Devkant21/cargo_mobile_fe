import { ActivityIndicator, Text, View } from "react-native";

interface FareBreakdown {
  baseFare: number;
  timeCharge: number;
  tolls: number;
  terrainCharge: number;
  labourCharge: number;
  gst: number;
  total: number;
}

interface PriceEstimateCardProps {
  breakdown?: FareBreakdown;
  loading?: boolean;
}

const formatPrice = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export default function PriceEstimateCard({
  breakdown,
  loading,
}: PriceEstimateCardProps) {
  if (!breakdown) {
    return (
      <View className="mx-3 mt-2 rounded-3xl border border-zinc-200 bg-white p-5">
        <Text className="text-xl font-bold text-zinc-900">Price Breakdown</Text>

        <Text className="mt-6 text-center text-zinc-500">
          Calculating estimate...
        </Text>
      </View>
    );
  }

  const transportation =
    breakdown.baseFare + breakdown.timeCharge + breakdown.terrainCharge;

  return (
    <View className="mx-3 mt-2 rounded-3xl border border-zinc-200 bg-white p-5">
      <Text className="text-xl font-bold text-zinc-900">Price Breakdown</Text>

      <Text className="mt-1 text-sm text-zinc-500">
        Based on your selected vehicle and trip.
      </Text>

      {loading && (
        <View className="mt-3 flex-row items-center">
          <ActivityIndicator size="small" color="#16a34a" />

          <Text className="ml-2 text-sm text-green-700">
            Updating estimate...
          </Text>
        </View>
      )}

      <View className="mt-6">
        {/* Transportation */}
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-base text-zinc-700">Transportation</Text>

          <Text className="text-base font-semibold text-zinc-900">
            {formatPrice(transportation)}
          </Text>
        </View>

        {/* Helpers */}
        {breakdown.labourCharge > 0 && (
          <View className="flex-row items-center justify-between border-t border-zinc-100 py-3">
            <Text className="text-base text-zinc-700">Helpers</Text>

            <Text className="text-base font-semibold text-zinc-900">
              {formatPrice(breakdown.labourCharge)}
            </Text>
          </View>
        )}

        {/* Tolls */}
        {breakdown.tolls > 0 && (
          <View className="flex-row items-center justify-between border-t border-zinc-100 py-3">
            <Text className="text-base text-zinc-700">Tolls</Text>

            <Text className="text-base font-semibold text-zinc-900">
              {formatPrice(breakdown.tolls)}
            </Text>
          </View>
        )}

        {/* GST */}
        <View className="flex-row items-center justify-between border-t border-zinc-100 py-3">
          <Text className="text-base text-zinc-700">GST</Text>

          <Text className="text-base font-semibold text-zinc-900">
            {formatPrice(breakdown.gst)}
          </Text>
        </View>
      </View>

      <View className="mt-4 rounded-2xl bg-green-50 px-5 py-4">
        <Text className="text-sm font-medium text-green-700">
          Estimated Total
        </Text>

        <Text className="mt-1 text-4xl font-bold text-green-700">
          {formatPrice(breakdown.total)}
        </Text>
      </View>
    </View>
  );
}
