import React from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

interface ExitConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onExit: () => void;
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  visible,
  onClose,
  onExit,
}) => {
  const primaryColor = "#5b2417";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-6">
        <View className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-2xl">
          <Text
            className="text-xl font-extrabold mb-4"
            style={{ color: primaryColor }}
          >
            Confirm Exit
          </Text>
          <Text className="text-base mb-8 text-gray-700">
            Do you want to exit the application?
            {Platform.OS === "android" && (
              <Text className="italic text-sm text-gray-500">
                {"\n\n"}Pressing the back button again will close the app.
              </Text>
            )}
          </Text>

          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              className="px-5 py-3 rounded-xl border border-gray-300 bg-white shadow-sm"
              onPress={onClose}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-5 py-3 rounded-xl shadow-md"
              style={{ backgroundColor: primaryColor }}
              onPress={onExit}
            >
              <Text className="text-white font-semibold">Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ExitConfirmationModal;
