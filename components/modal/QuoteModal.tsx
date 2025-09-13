import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface QuoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    pickup: string;
    dropoff: string;
    date: Date | null;
    time: Date | null;
    phone: string;
    name?: string | null;
    email?: string;
  }) => void;
  pickup: string;
  dropoff: string;
  date: Date | null;
  time: Date | null;
  name?: string | null;
  email?: string;
}

export default function QuoteModal({
  visible,
  onClose,
  onSubmit,
  pickup,
  dropoff,
  date,
  time,
  name,
  email,
}: QuoteModalProps) {
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    // Remove non-digit characters
    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const data = {
      pickup,
      dropoff,
      date,
      time,
      phone: digitsOnly,
      name,
      email,
    };
    onSubmit(data);

    // Show the submitted data in an alert
    Alert.alert("Quote Submitted", JSON.stringify(data, null, 2));

    setPhone(""); // reset
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 items-center justify-center">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="w-11/12 bg-white rounded-2xl p-6"
          >
            <Text className="text-2xl font-bold text-[#5b2417] mb-4 text-center">
              Enter Your Phone Number
            </Text>

            <Text className="text-gray-600 mb-2">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-4 py-3 mb-6"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10} // restrict to 10 digits
            />

            <TouchableOpacity
              className="bg-[#f59e0b] px-4 py-3 rounded-md mb-4"
              onPress={handleSubmit}
            >
              <Text className="text-white text-center font-semibold">
                Get Quote
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-3 rounded-md"
              onPress={onClose}
            >
              <Text className="text-[#5b2417] text-center">Cancel</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
