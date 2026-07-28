import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Image } from "react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";

type PaymentMethod = "upi" | "cash";

interface PaymentMethodCardProps {
  selectedMethod: PaymentMethod;
  total: number;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodCard({
  selectedMethod,
  total,
  onSelect,
}: PaymentMethodCardProps) {
  const handleOpenUPI = async () => {
    const url =
      "upi://pay?" +
      `pa=${encodeURIComponent("mab.037135017810231@axisbank")}` +
      `&pn=${encodeURIComponent("Sturm")}` +
      `&am=${total}` +
      "&cu=INR" +
      `&tn=${encodeURIComponent("Booking Payment")}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(error);

      Alert.alert("Unable to open UPI", "Could not launch a UPI application.");
    }
  };

  return (
    <View className="mx-3 mt-2 rounded-3xl border border-zinc-200 bg-white p-5">
      <Text className="text-xl font-bold text-zinc-900">Payment Method</Text>

      <Text className="mt-1 text-sm text-zinc-500">
        Choose how you'd like to pay for your booking.
      </Text>

      <View className="mt-5 gap-3">
        {/* UPI */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelect("upi")}
          className={`rounded-2xl border p-4 ${
            selectedMethod === "upi"
              ? "border-green-500 bg-green-50"
              : "border-zinc-200"
          }`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-green-100">
                <Ionicons
                  name="phone-portrait-outline"
                  size={22}
                  color="#16a34a"
                />
              </View>

              <View>
                <Text className="text-base font-semibold text-zinc-900">
                  UPI Payment
                </Text>

                <Text className="mt-1 text-sm text-zinc-500">
                  Google Pay • PhonePe • Paytm • BHIM
                </Text>
              </View>
            </View>

            <Ionicons
              name={
                selectedMethod === "upi"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={22}
              color="#16a34a"
            />
          </View>
        </TouchableOpacity>

        {/* Cash */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelect("cash")}
          className={`rounded-2xl border p-4 ${
            selectedMethod === "cash"
              ? "border-green-500 bg-green-50"
              : "border-zinc-200"
          }`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-green-100">
                <Ionicons name="cash-outline" size={22} color="#16a34a" />
              </View>

              <View>
                <Text className="text-base font-semibold text-zinc-900">
                  Cash
                </Text>

                <Text className="mt-1 text-sm text-zinc-500">
                  Pay the driver after your trip
                </Text>
              </View>
            </View>

            <Ionicons
              name={
                selectedMethod === "cash"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={22}
              color="#16a34a"
            />
          </View>
        </TouchableOpacity>
      </View>

      {selectedMethod === "upi" && (
        <View className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
          <Text className="text-center text-lg font-bold text-zinc-900">
            Scan & Pay
          </Text>

          <Text className="mt-2 text-center text-sm text-zinc-600">
            Pay exactly
          </Text>

          <Text className="mt-1 text-center text-3xl font-bold text-green-700">
            ₹{total.toLocaleString("en-IN")}
          </Text>

          <Image
            source={require("@/assets/images/axis-bank-qr.jpeg")}
            resizeMode="contain"
            className="mt-5 h-72 w-full self-center rounded-xl"
          />

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleOpenUPI}
            className="mt-5 rounded-xl bg-green-600 py-4"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="open-outline" size={20} color="white" />

              <Text className="ml-2 text-base font-semibold text-white">
                Open UPI App
              </Text>
            </View>
          </TouchableOpacity>

          <View className="mt-4 rounded-xl bg-white p-3">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#16a34a"
              />

              <Text className="ml-2 flex-1 text-sm leading-5 text-zinc-600">
                After completing the payment, you'll be asked to upload a
                screenshot of the successful transaction for verification.
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="mt-5 rounded-2xl bg-green-50 p-3">
        <Text className="text-center text-sm font-medium text-green-700">
          Secure booking • Your information is encrypted
        </Text>
      </View>
    </View>
  );
}
