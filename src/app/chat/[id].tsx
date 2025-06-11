import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import chatHistory from "assets/data/chatHistory.json";
import ChatInput from "@/components/ChatInput";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const chat = chatHistory.find((chat) => chat.id === id);

  const handleSend = (message) => {
    console.log("Message from id:", id, message);
  };

  if (!chat) {
    return (
      <View>
        <Text>chat {id} not found </Text>
      </View>
    );
  }
  return (
    <View className="flex-1">
      <View className="flex-1">
        <Text></Text>
      </View>

      <ChatInput onSend={handleSend} isLaoding={false} />
    </View>
  );
}
