import ChatInput from "@/components/ChatInput";
import { useChatStore } from "@/store/chatStore";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const createNewChat = useChatStore((state) => state.createNewChat);
  const addNewMessage = useChatStore((state) => state.addNewMessage);

  // const handleSend = async (message: string) => {
  //   const chatId = createNewChat(message.slice(0, 50));
  //   const newMessage = {
  //     id: Date.now().toString(),
  //     role: "user" as const,
  //     message,
  //   };
  //   addNewMessage(chatId, newMessage);
  //   router.push(`/chat/${chatId}`);

  //   try {
  //     const response = await fetch("/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ message }),
  //     });
  //     const data = await response.json();

  //     if (!data) {
  //       throw new Error(data.error);
  //     }

  //     const aiResponseMessage = {
  //       id: Date.now().toString(),
  //       message: data.responseMessage,
  //       responseId: data.responseId,
  //       role: "assistant" as const,
  //     };

  //     addNewMessage(chatId, aiResponseMessage);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSend = async (message: string) => {
    const chatId = createNewChat(message.slice(0, 50));
    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      message,
    };
    addNewMessage(chatId, newMessage);
    router.push(`/chat/${chatId}`);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const aiResponseMessage = {
        id: Date.now().toString(),
        message: data.responseMessage,
        responseId: data.responseId,
        role: "assistant" as const,
      };

      addNewMessage(chatId, aiResponseMessage);
    } catch (error) {
      console.log("Home chat error:", error);
    }
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
