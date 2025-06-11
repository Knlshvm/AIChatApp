import ChatInput from "@/components/ChatInput";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const handleSend = (message) => {
    console.log("message", message);
  };
  return (
    <View className=" justify-center flex-1">
      <View className="flex-1">
        <Text className="text-white font-bold">
          Open up App.tsx to start working on
        </Text>
      </View>
      <ChatInput onSend={handleSend} isLaoding={false} />
    </View>
  );
}
