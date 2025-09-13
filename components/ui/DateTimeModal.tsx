import { useState } from "react";
import {
  BackHandler,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface DateTimeModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedTime: Date | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: Date) => void;
}

// ----------------- Calendar Component -----------------
function Calendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const dates: Date[] = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    dates.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    );
  }

  const isPast = (date: Date) => {
    const now = new Date();
    if (now.getHours() >= 16) {
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      return date < tomorrow;
    }
    return date < new Date(now.setHours(0, 0, 0, 0));
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-2 items-center">
        <TouchableOpacity
          onPress={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
            )
          }
          className="p-2 rounded-full bg-gray-200"
          activeOpacity={1}
        >
          <Ionicons name="chevron-back" size={24} color="#5b2417" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <TouchableOpacity
          onPress={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
            )
          }
          className="p-2 rounded-full bg-gray-200"
          activeOpacity={1}
        >
          <Ionicons name="chevron-forward" size={24} color="#5b2417" />
        </TouchableOpacity>
      </View>

      {/* CALENDAR DAY NAME */}
      <View className="flex-row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <Text
            className="flex-1 text-center font-semibold text-gray-600 py-2"
            key={d}
          >
            {d}
          </Text>
        ))}
      </View>

      {/* CALENDAR DATE */}
      <View className="flex-row flex-wrap items-center justify-center">
        {dates.map((date) => {
          const disabled = isPast(date);
          const selected = selectedDate?.toDateString() === date.toDateString();
          return (
            <TouchableOpacity
              key={date.toDateString()}
              disabled={disabled}
              onPress={() => onSelectDate(date)}
              className={`w-1/7 p-3 m-0.5 rounded items-center justify-center ${
                selected
                  ? "bg-[#5b2417]"
                  : disabled
                    ? "bg-gray-200"
                    : "bg-white"
              }`}
              activeOpacity={1}
            >
              <Text
                className={`font-bold p-1 ${selected ? "text-white" : disabled ? "text-gray-400" : "text-[#5b2417]"}
          `}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ----------------- Time Picker Component -----------------
function TimePicker({
  selectedDate,
  selectedTime,
  onSelectTime,
}: {
  selectedDate: Date | null;
  selectedTime: Date | null;
  onSelectTime: (time: Date) => void;
}) {
  if (!selectedDate) return null;

  const times: Date[] = [];
  const start = new Date(selectedDate);
  const end = new Date(selectedDate);
  start.setHours(6, 0, 0, 0);
  end.setHours(20, 0, 0, 0);

  const now = new Date();
  const isToday = selectedDate.toDateString() === now.toDateString();

  let minTime: Date;
  if (isToday) {
    const temp = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const minutes = temp.getMinutes();
    const remainder = 15 - (minutes % 15);
    temp.setMinutes(minutes + remainder, 0, 0);
    minTime = temp;
  } else {
    minTime = start;
  }

  // Populate times in 15-min intervals
  let current = new Date(minTime);
  while (current <= end) {
    times.push(new Date(current));
    current = new Date(current.getTime() + 15 * 60 * 1000);
  }

  return (
    <View className="mb-4">
      <Text className="text-[#5b2417] mb-2">Time</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {times.map((time) => {
          const selected = selectedTime?.getTime() === time.getTime();
          return (
            <TouchableOpacity
              key={time.toTimeString()}
              className={`px-4 py-2 m-1 rounded ${
                selected ? "bg-[#5b2417]" : "bg-gray-200"
              }`}
              onPress={() => onSelectTime(time)}
              activeOpacity={1}
            >
              <Text className={`${selected ? "text-white" : "text-[#5b2417]"}`}>
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ----------------- Modal Wrapper -----------------
export default function DateTimeModal({
  visible,
  onClose,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: DateTimeModalProps) {
  // Handle Android Back button
  BackHandler.addEventListener("hardwareBackPress", () => {
    if (visible) {
      onClose();
      return true;
    }
    return false;
  });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      {/* Background Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50" />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <View className="absolute bottom-0 left-0 right-0 h-[70%] bg-[#f5f4ee] rounded-t-2xl p-6">
        <Text className="text-2xl font-bold text-[#5b2417] mb-4">
          Select Date & Time
        </Text>
        <Calendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
        <TimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />

        <TouchableOpacity
          className="bg-[#5b2417] px-4 py-3 mt-4 rounded"
          onPress={onClose}
        >
          <Text className="text-white text-center">Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
