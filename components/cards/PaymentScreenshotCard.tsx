import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface PaymentScreenshotCardProps {
  screenshot: ImagePicker.ImagePickerAsset | null;
  onChange: (asset: ImagePicker.ImagePickerAsset | null) => void;
}

export default function PaymentScreenshotCard({
  screenshot,
  onChange,
}: PaymentScreenshotCardProps) {
  const pickScreenshot = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to upload your payment screenshot.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      onChange(result.assets[0]);
    }
  };

  const removeScreenshot = () => {
    Alert.alert(
      "Remove Screenshot",
      "Remove the selected payment screenshot?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onChange(null),
        },
      ],
    );
  };

  return (
    <View className="mx-3 mt-3 rounded-3xl border border-zinc-200 bg-white p-5">
      <Text className="text-xl font-bold text-zinc-900">
        Payment Screenshot
      </Text>

      <Text className="mt-1 text-sm text-zinc-500">
        Upload the successful UPI payment screenshot for verification.
      </Text>

      {!screenshot ? (
        <>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={pickScreenshot}
            className="mt-5 items-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50 px-5 py-8"
          >
            <Ionicons name="cloud-upload-outline" size={46} color="#16a34a" />

            <Text className="mt-4 text-lg font-semibold text-zinc-900">
              Upload Screenshot
            </Text>

            <Text className="mt-2 text-center text-sm text-zinc-500">
              Tap to choose a payment screenshot
            </Text>

            <Text className="mt-5 text-xs text-zinc-400">JPG • PNG • HEIC</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View className="mt-5 overflow-hidden rounded-2xl border border-zinc-200">
            <Image
              source={{ uri: screenshot.uri }}
              resizeMode="cover"
              className="h-72 w-full"
            />
          </View>

          <View className="mt-4 flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />

            <Text className="ml-2 text-sm font-medium text-green-700">
              Screenshot attached successfully
            </Text>
          </View>

          <View className="mt-5 flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={pickScreenshot}
              className="flex-1 flex-row items-center justify-center rounded-xl bg-green-600 py-4"
            >
              <Ionicons name="refresh-outline" size={18} color="white" />

              <Text className="ml-2 font-semibold text-white">Replace</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={removeScreenshot}
              className="flex-row items-center justify-center rounded-xl border border-red-300 px-5"
            >
              <Ionicons name="trash-outline" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <View className="mt-5 rounded-2xl bg-green-50 p-4">
        <View className="flex-row">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#16a34a"
          />

          <Text className="ml-2 flex-1 text-sm leading-5 text-zinc-600">
            Your payment screenshot will be reviewed by our team before your
            booking is confirmed. Please ensure the transaction status is
            clearly visible.
          </Text>
        </View>
      </View>
    </View>
  );
}
