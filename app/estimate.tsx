import EstimateHeader from "@/components/estimate/EstimateHeader";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EstimateFooter from "@/components/estimate/EstimateFooter";
import PaymentMethodCard from "@/components/estimate/PaymentMethodCard";
import PriceEstimateCard from "@/components/estimate/PriceEstimateCard";
import TripSummaryCard from "@/components/estimate/TripSummaryCard";
import VehicleSummaryCard from "@/components/estimate/VehicleSummaryCard";
import BookingConfirmModal from "@/components/estimate/BookingConfirmModal";
import { useAuthStore } from "@/store/authStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import HelperSelectorCard from "@/components/cards/HelperSelectorCard";
import * as ImagePicker from "expo-image-picker";
import PaymentScreenshotCard from "@/components/cards/PaymentScreenshotCard";
// import { useFare } from "@/hooks/useFareTrip";

type PaymentMethod = "upi" | "cash";

type FareBreakdown = {
  baseFare: number;
  timeCharge: number;
  tolls: number;
  terrainCharge: number;
  labourCharge: number;
  driverAssistCharge: number;
  gst: number;
  total: number;
};

type FareData = {
  distance: string;
  duration: string;
  vehicleType: string;
  movementType: string;
  breakdown: FareBreakdown;
};

export default function EstimatePage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();

  const {
    pickup,
    dropoff,
    move_datetime,
    phone,
    email,
    name,
    vehicle,
    serviceType,
    helpers,
    driverAssistance,
  } = useLocalSearchParams<{
    pickup: string;
    dropoff: string;
    move_datetime: string;
    phone: string;
    email: string;
    name: string;
    vehicle: string;
    serviceType: string;
    helpers: string;
    driverAssistance: string;
  }>();
  const [helperCount, setHelperCount] = useState(Number(helpers ?? "0"));

  const hasDriverAssistance = driverAssistance === "true";

  // const { calculateFare, loading: fareLoading } = useFare();
  const [fareLoading, setFareLoading] = useState(false);
  const [fareData, setFareData] = useState<FareData | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function fetchFare() {
      if (!pickup || !dropoff || !move_datetime || !vehicle || !serviceType) {
        return;
      }

      try {
        setFareLoading(true);

        const payload = {
          origin: pickup,
          destination: dropoff,
          trip_start_time: move_datetime,
          vehicle_id: Number(vehicle),
          movement_id: Number(serviceType),
          num_labours: helperCount,
          driver_assistance: hasDriverAssistance,
          additional_trips: 0,
        };

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/user/trip`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const data = await response.json();

        console.log("Trip Response:\n", JSON.stringify(data, null, 2));

        if (!data.success) {
          Alert.alert("Fare Error", data.message);
          return;
        }

        setFareData({
          distance: `${data.data.distance_km.toFixed(1)} km`,
          duration: `${Math.round(data.data.duration_minutes)} mins`,
          vehicleType: data.data.vehicle_type,
          movementType: data.data.movement_type,
          breakdown: {
            baseFare: data.data.fare_breakdown.base_fare,
            timeCharge: data.data.fare_breakdown.time_charge,
            tolls: data.data.fare_breakdown.tolls_total,
            terrainCharge: data.data.fare_breakdown.terrain_charge,
            labourCharge: data.data.fare_breakdown.labour_charge,
            driverAssistCharge: data.data.fare_breakdown.driver_assist_charge,
            gst: data.data.fare_breakdown.gst_amount,
            total: data.data.fare_breakdown.final_fare_inr,
          },
        });
      } catch (error) {
        console.error("Fetch error:", error);

        if (error instanceof Error) {
          console.error(error.message);
          console.error(error.stack);
        }
      } finally {
        setFareLoading(false);
      }
    }

    fetchFare();
  }, [pickup, dropoff, move_datetime, vehicle, serviceType, helperCount]);

  const submitEstimateRequest = async () => {
    if (!fareData) {
      Alert.alert("Please wait", "Fare is still being calculated.");
      return;
    }

    if (paymentMethod === "upi" && !paymentScreenshot) {
      Alert.alert(
        "Screenshot Required",
        "Please upload your payment screenshot before continuing.",
      );
      return;
    }

    setLoading(true);

    const movementType = fareData.movementType;

    const payload = {
      pickup,
      dropoff,
      move_datetime,
      phone,
      email,
      name,
      movementType,
      vehicleType: fareData.vehicleType,
      fare: fareData.breakdown.total,
      distance: fareData.distance,
      duration: fareData.duration,

      helperRequired: helperCount > 0 || hasDriverAssistance,
      helperCount,
      floorPickup: 0,
      floorDropoff: 0,
      fragileItems: false,
    };

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      let body: string | FormData;

      if (paymentMethod === "upi" && paymentScreenshot) {
        const formData = new FormData();

        formData.append("pickup", pickup);
        formData.append("dropoff", dropoff);
        formData.append("move_datetime", move_datetime);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("name", name);
        formData.append("movementType", movementType);
        formData.append("vehicleType", fareData.vehicleType);

        formData.append("fare", fareData.breakdown.total.toString());
        formData.append("amount", fareData.breakdown.total.toString());

        formData.append("distance", fareData.distance);
        formData.append("duration", fareData.duration);

        formData.append("origin", pickup);
        formData.append("destination", dropoff);

        formData.append("screenshot", {
          uri: paymentScreenshot.uri,
          name: paymentScreenshot.fileName ?? "payment.jpg",
          type: paymentScreenshot.mimeType ?? "image/jpeg",
        } as unknown as Blob);

        formData.append(
          "helperRequired",
          String(helperCount > 0 || hasDriverAssistance),
        );

        formData.append("helperCount", helperCount.toString());
        formData.append("floorPickup", "0");
        formData.append("floorDropoff", "0");
        formData.append("fragileItems", "false");

        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(payload);
      }

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_WEBSITE_URL}/api/send-quote`,
        {
          method: "POST",
          headers,
          body,
        },
      );

      const data: {
        success: boolean;
        error?: string;
      } = await res.json();

      if (!data.success) {
        Alert.alert("Request Failed", data.error ?? "Something went wrong");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      router.replace({
        pathname: "/booking-success",
        params: {
          pickup,
          dropoff,
          move_datetime,
          movementType,
        },
      });
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Network Error",
        "Failed to submit request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <View className="flex-1">
        <ScrollView className="flex-1">
          <EstimateHeader />

          <TripSummaryCard
            pickup={pickup}
            dropoff={dropoff}
            moveDateTime={move_datetime}
            distance={fareData?.distance}
            duration={fareData?.duration}
          />

          <VehicleSummaryCard vehicleId={vehicle} />

          <HelperSelectorCard
            helperCount={helperCount}
            helperPrice={1000}
            loading={!fareData}
            maxHelpers={5}
            onIncrease={() => setHelperCount((prev) => Math.min(prev + 1, 5))}
            onDecrease={() => setHelperCount((prev) => Math.max(prev - 1, 0))}
          />

          <PriceEstimateCard
            breakdown={fareData?.breakdown}
            loading={fareLoading}
          />

          <PaymentMethodCard
            selectedMethod={paymentMethod}
            total={fareData?.breakdown.total ?? 0}
            onSelect={setPaymentMethod}
          />
          {paymentMethod === "upi" && (
            <PaymentScreenshotCard
              screenshot={paymentScreenshot}
              onChange={setPaymentScreenshot}
            />
          )}
        </ScrollView>

        <EstimateFooter
          total={fareData ? `₹${fareData.breakdown.total}` : undefined}
          calculating={!fareData || fareLoading}
          submitting={loading}
          disabled={paymentMethod === "upi" && paymentScreenshot === null}
          onPress={() => setShowConfirmModal(true)}
        />

        <BookingConfirmModal
          visible={showConfirmModal}
          fare={fareData ? `₹${fareData.breakdown.total}` : "Calculating..."}
          pickup={pickup}
          dropoff={dropoff}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            submitEstimateRequest();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
