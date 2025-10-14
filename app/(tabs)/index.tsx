import ExitConfirmationModal from "@/components/modal/ExitConfirmationModal";
import DateTimeModal from "@/components/ui/DateTimeModal";
import InputField from "@/components/ui/InputField";
import LocationInput from "@/components/ui/LocationInput";
import { useAuthStore } from "@/store/authStore";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Landing() {
  const { user, token } = useAuthStore();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [errors, setErrors] = useState({
    pickup: "",
    dropoff: "",
    dateTime: "",
    name: "",
    email: "",
    contactNumber: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleExitApp = () => {
    setShowExitModal(false);

    if (Platform.OS === "android") {
      BackHandler.exitApp();
    }
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        if (showModal) {
          setShowModal(false);
          return true;
        }
        setShowExitModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
  }, [showModal]);

  const validateFields = () => {
    const newErrors = {
      pickup: pickup.trim() === "" ? "Pickup location is required" : "",
      dropoff: dropoff.trim() === "" ? "Dropoff location is required" : "",
      dateTime:
        !selectedDate || !selectedTime ? "Pickup date & time are required" : "",
      name: !user?.name ? "Name is required" : "",
      email: !user?.email ? "Email is required" : "",
      contactNumber:
        contactNumber.trim() === "" ? "Contact number is required" : "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e !== "");
    if (hasError) {
      console.log("Validation failed:", newErrors);
    }

    return !hasError;
  };

  const sendMoveRequest = async () => {
    if (!validateFields()) return;

    if (!selectedDate || !selectedTime) return;

    setLoading(true);

    const move_datetime = new Date(
      selectedDate!.getFullYear(),
      selectedDate!.getMonth(),
      selectedDate!.getDate(),
      selectedTime!.getHours(),
      selectedTime!.getMinutes()
    ).toISOString();

    const payload = {
      pickup,
      dropoff,
      move_datetime,
      phone: contactNumber,
      email: user?.email || "",
      name: user?.name || "",
    };

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/send-quote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Something went wrong");
        return;
      }

      alert("Request submitted successfully! Check your email.");
      setPickup("");
      setDropoff("");
      setContactNumber("");
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f4ee]">
      <StatusBar style="dark" />
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header / Title */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-[#5b2417] mb-2">
            Book now
          </Text>
          <Text className="text-gray-600 text-base">
            Enter your pickup and dropoff locations and select a convenient time
            to book.
          </Text>
        </View>

        <LocationInput
          label="Pickup Location"
          placeholder="Enter pickup"
          value={pickup}
          onChangeText={setPickup}
          onSelectSuggestion={setPickup}
        />
        {errors.pickup ? (
          <Text className="text-red-500 mb-2">{errors.pickup}</Text>
        ) : null}
        <LocationInput
          label="Dropoff Location"
          placeholder="Enter dropoff"
          value={dropoff}
          onChangeText={setDropoff}
          onSelectSuggestion={setDropoff}
        />
        {errors.dropoff ? (
          <Text className="text-red-500 mb-2">{errors.dropoff}</Text>
        ) : null}

        <InputField
          label="Contact Number"
          placeholder="Enter your phone number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.contactNumber ? (
          <Text className="text-red-500 mb-2">{errors.contactNumber}</Text>
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

        <TouchableOpacity
          className="bg-[#f59e0b] px-4 py-3 rounded-md mb-6"
          onPress={sendMoveRequest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-center">
              Book Now
            </Text>
          )}
        </TouchableOpacity>

        <DateTimeModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectDate={setSelectedDate}
          onSelectTime={setSelectedTime}
        />

        <ExitConfirmationModal
          visible={showExitModal}
          onClose={() => setShowExitModal(false)}
          onExit={handleExitApp}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
