import ChatInput from "@/components/ChatInput";
import { useChatStore } from "@/store/chatStore";
import { router } from "expo-router";
import {  Text, View } from "react-native";

export default function HomeScreen() {
  const createNewChat = useChatStore((state) => state.createNewChat);
  const addNewMessage = useChatStore((state) => state.addNewMessage);

  const handleSend = async (message: string) => {
    console.log("message", message);
    const newchatId = createNewChat(message.slice(0, 50));
    addNewMessage(newchatId, {
      id: Date.now().toString(),
      role: "user",
      message,
    });
    router.push(`/chat/${newchatId}`);
  };
  return (
    <View className=" justify-center flex-1">
      <View className="flex-1">
        <Text className="text-white font-bold">
          Open up App.tsx to start working on
        </Text>
      </View>
      <ChatInput onSend={handleSend} isLoading={false} />
    </View>
  );
}
