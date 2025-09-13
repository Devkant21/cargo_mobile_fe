import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import QuoteModal from "@/components/modal/QuoteModal";
import DateTimeModal from "@/components/ui/DateTimeModal";
import InputField from "@/components/ui/InputField";

import { useAuthStore } from "@/store/authStore";

export default function Landing() {
  const { user } = useAuthStore();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const [errors, setErrors] = useState({
    pickup: "",
    dropoff: "",
    dateTime: "",
    name: "",
    email: "",
  });

  const validateFields = () => {
    const newErrors = {
      pickup: pickup.trim() === "" ? "Pickup location is required" : "",
      dropoff: dropoff.trim() === "" ? "Dropoff location is required" : "",
      dateTime:
        !selectedDate || !selectedTime ? "Pickup date & time are required" : "",
      name: !user?.name ? "Name is required" : "",
      email: !user?.email ? "Email is required" : "",
    };

    setErrors(newErrors);

    // Check if any error exists
    return !Object.values(newErrors).some((e) => e !== "");
  };

  const handleGetQuote = () => {
    if (validateFields()) {
      setShowQuoteModal(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <StatusBar style="dark" />

      <ScrollView className="flex-1 px-6 py-8">
        {/* Header / Title */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-[#5b2417] mb-2">
            Get a Quote
          </Text>
          <Text className="text-gray-600 text-base">
            Enter your pickup and dropoff locations and select a convenient time
            to get your quote instantly.
          </Text>
        </View>

        {/* Input Fields */}
        <InputField
          label="Pickup Location"
          placeholder="Enter pickup"
          value={pickup}
          onChangeText={setPickup}
        />
        {errors.pickup ? (
          <Text className="text-red-500 mb-2">{errors.pickup}</Text>
        ) : null}
        <InputField
          label="Dropoff Location"
          placeholder="Enter dropoff"
          value={dropoff}
          onChangeText={setDropoff}
        />
        {errors.dropoff ? (
          <Text className="text-red-500 mb-2">{errors.dropoff}</Text>
        ) : null}

        {/* Date & Time Picker */}
        <TouchableOpacity
          className="bg-[#5b2417] px-4 py-3 rounded-md mb-6 mt-4"
          onPress={() => setShowModal(true)}
        >
          <Text className="text-white text-center">
            {selectedDate && selectedTime
              ? `${selectedDate.toDateString()} ${selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Select Pickup Date & Time"}
          </Text>
        </TouchableOpacity>
        {errors.dateTime ? (
          <Text className="text-red-500 mb-2">{errors.dateTime}</Text>
        ) : null}

        {/* CTA Button */}
        <TouchableOpacity
          className="bg-[#f59e0b] px-4 py-3 rounded-md mb-6"
          onPress={handleGetQuote}
        >
          <Text className="text-white font-semibold text-center">
            Get Quote
          </Text>
        </TouchableOpacity>

        {/* Optional Tips / Info */}
        <View className="mt-4">
          <Text className="text-gray-500 text-sm text-center">
            You can change pickup/dropoff or select a different time before
            requesting a quote.
          </Text>
        </View>

        {/* DateTime Modal */}
        <DateTimeModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectDate={setSelectedDate}
          onSelectTime={setSelectedTime}
        />

        <QuoteModal
          visible={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          pickup={pickup}
          dropoff={dropoff}
          date={selectedDate}
          time={selectedTime}
          name={user?.name}
          email={user?.email}
          onSubmit={(data) => console.log("Quote Data:", data)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
