import { Text, TextInput, View } from "react-native";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
}: InputFieldProps) {
  return (
    <View className="w-full mb-4">
      <Text className="mb-2 text-base font-medium text-[#5b2417]">{label}</Text>
      <TextInput
        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
