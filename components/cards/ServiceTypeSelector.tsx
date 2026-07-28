import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MovementType {
  id: number;
  name: string;
  description: string;
  min_fare: number;
  labour_capacity: number;
  price_per_labour: number;
  driver_assist_charge: number;
  additional_trip_fee: number;
  is_active: boolean;
}

interface ServiceTypeSelectorProps {
  selectedService: string;
  onSelect: (serviceId: string) => void;
}

const movementIcons: Record<number, string> = {
  1: "🏠",
  2: "🏢",
};

export default function ServiceTypeSelector({
  selectedService,
  onSelect,
}: ServiceTypeSelectorProps) {
  const [movementTypes, setMovementTypes] = useState<MovementType[]>([]);

  useEffect(() => {
    const getMovementTypes = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/get-movements-type`,
        );

        const data = await response.json();

        if (data.success) {
          setMovementTypes(data.data);

          if (!selectedService && data.data.length > 0) {
            onSelect(data.data[0].id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch movement types:", error);
      }
    };

    getMovementTypes();
  }, []);

  return (
    <View>
      <Text className="mb-3 text-xl font-semibold text-zinc-900">
        Type of Service
      </Text>

      <View className="flex-row gap-3">
        {movementTypes.map((service) => {
          const selected = selectedService === service.id.toString();

          return (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.8}
              onPress={() => onSelect(service.id.toString())}
              className={`flex-1 rounded-3xl border p-4 ${
                selected
                  ? "border-green-500 bg-green-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <View className="flex-row items-end gap-2">
                <View
                  className={`h-7 w-7 items-center justify-center rounded-full border-2 ${
                    selected ? "border-green-500" : "border-zinc-300"
                  }`}
                >
                  {selected && (
                    <View className="h-3 w-3 rounded-full bg-green-500" />
                  )}
                </View>

                <Text className="text-4xl">
                  {movementIcons[service.id] ?? "🚚"}
                </Text>
              </View>

              <Text className="mt-3 text-base font-semibold text-zinc-900">
                {service.name}
              </Text>

              <Text className="mt-2 text-sm leading-5 text-zinc-500">
                {service.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
