import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";

interface VehicleSelectorProps {
  selectedVehicle: string;
  onSelect: (vehicleId: string) => void;
}

interface Vehicle {
  id: number;
  name: string;
  description: string;
  image_url: string;
  base_fare: number;
  price_per_km: number;
  price_per_minute: number;
  is_out_of_state: boolean;
}

const fallbackImage = require("@/assets/images/ditruck.png");

const vehicleImages: Record<number, ReturnType<typeof require>> = {
  1: require("@/assets/images/truck.png"),
  2: require("@/assets/images/ditruck.png"),
};

export default function VehicleSelector({
  selectedVehicle,
  onSelect,
}: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const getVehicles = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/get-vehicles`,
        );

        const data = await response.json();

        if (data.success) {
          setVehicles(data.data);

          if (!selectedVehicle && data.data.length > 0) {
            onSelect(data.data[0].id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };

    getVehicles();
  }, []);

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-zinc-900">
          Vehicle Needed?
        </Text>
      </View>

      <View className="flex-row">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4"
        >
          {vehicles.map((vehicle) => {
            const selected = selectedVehicle === vehicle.id.toString();

            return (
              <TouchableOpacity
                key={vehicle.id}
                activeOpacity={0.8}
                onPress={() => onSelect(vehicle.id.toString())}
                className={`w-[170px] rounded-3xl border p-3 ${
                  selected
                    ? "border-green-500 bg-green-50"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <Image
                  source={vehicleImages[vehicle.id] ?? fallbackImage}
                  resizeMode="contain"
                  className="h-24 w-full"
                />

                <View className="mt-1 items-center">
                  <Text className="text-lg font-semibold text-zinc-900">
                    {vehicle.name}
                  </Text>

                  <Text className="mt-2 text-center text-sm leading-4 text-zinc-500">
                    {vehicle.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
