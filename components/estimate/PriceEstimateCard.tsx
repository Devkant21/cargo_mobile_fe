import { ActivityIndicator, Text, View } from "react-native";

type FareBreakdown = {
  baseFare: number;
  timeCharge: number;
  labourCharge: number;
  driverAssistCharge: number;
  terrainCharge: number;
  intercityCharge: number;
  internationalCharge: number;
  nightDrivingCharge: number;
  nightSurcharge: number;
  overnightCharge: number;
  tolls: number;
  gst: number;
  total: number;
};

interface PriceEstimateCardProps {
  breakdown?: FareBreakdown;
  loading?: boolean;
  helperPrice?: number;
  helperCount?: number;
}

const formatPrice = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

type PriceRowProps = {
  label: string;
  amount: number;
  show?: boolean;
};

function PriceRow({ label, amount, show = true }: PriceRowProps) {
  if (!show) return null;

  return (
    <View className="flex-row items-center justify-between border-t border-zinc-100 py-3">
      <Text className="text-base text-zinc-700">{label}</Text>

      <Text className="text-base font-semibold text-zinc-900">
        {formatPrice(amount)}
      </Text>
    </View>
  );
}

export default function PriceEstimateCard({
  breakdown,
  loading,
  helperPrice = 800,
  helperCount = 0,
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

  const transportationFare = breakdown.baseFare + breakdown.timeCharge;
  const helperTotal = helperCount * helperPrice;

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
        <PriceRow label="Transportation" amount={transportationFare} />

        <PriceRow label="Helpers" amount={helperTotal} show={helperCount > 0} />

        <PriceRow
          label="Driver Assistance"
          amount={breakdown.driverAssistCharge}
          show={breakdown.driverAssistCharge > 0}
        />

        <PriceRow
          label="Terrain Charge"
          amount={breakdown.terrainCharge}
          show={breakdown.terrainCharge > 0}
        />

        <PriceRow
          label="Intercity Charge"
          amount={breakdown.intercityCharge}
          show={breakdown.intercityCharge > 0}
        />

        <PriceRow
          label="International Charge"
          amount={breakdown.internationalCharge}
          show={breakdown.internationalCharge > 0}
        />

        <PriceRow
          label="Night Driving"
          amount={breakdown.nightDrivingCharge}
          show={breakdown.nightDrivingCharge > 0}
        />

        <PriceRow
          label="Night Surcharge"
          amount={breakdown.nightSurcharge}
          show={breakdown.nightSurcharge > 0}
        />

        <PriceRow
          label="Overnight Charge"
          amount={breakdown.overnightCharge}
          show={breakdown.overnightCharge > 0}
        />

        <PriceRow
          label="Tolls"
          amount={breakdown.tolls}
          show={breakdown.tolls > 0}
        />

        <PriceRow label="GST" amount={breakdown.gst} />
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
