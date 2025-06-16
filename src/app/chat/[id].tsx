import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatInput from "@/components/ChatInput";
import MessageListItem from "@/components/MessageListItem";
import { useChatStore } from "@/store/chatStore";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const chat = useChatStore((state) =>
    state.chatHistory.find((chat) => chat.id === id)
  );

  const addNewMessage = useChatStore((state) => state.addNewMessage);

  if (!id || Array.isArray(id) || !chat) {
    return (
      <View>
        <Text>Invalid or missing chat ID or Chat context</Text>
      </View>
    );
  }

  //   const handleSend = async (message: string) => {
  //     const newMessage = {
  //       id: Date.now().toString(),
  //       role: "user" as const,
  //       message,
  //     };
  //     addNewMessage(id, newMessage);

  //     const previousResponseId =
  //       chat.messages[chat.messages.length - 1]?.responseId;
  //     try {
  //       const response = await fetch("/api/chat", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           message,
  //           previousResponseId,
  //         }),
  //       });

  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.error);
  //       }

  //       const aiResponseMessage = {
  //         id: Date.now().toString(),
  //         message: data.responseMessage,
  //         responseId: data.responseId,
  //         role: "assistant" as const,
  //       };

  //       addNewMessage(chat.id, aiResponseMessage);
  //     } catch (error) {
  //       console.error("Chat error:", error);
  //     }
  //   };

  const handleSend = async (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      message,
    };
    addNewMessage(id, newMessage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...chat.messages.map((m) => ({
              role: m.role,
              content: m.message,
            })),
            { role: "user", content: message },
          ],
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

      addNewMessage(chat.id, aiResponseMessage);
    } catch (error) {
      console.error("Chat error:", error);
    }
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
      <FlatList
        data={chat.messages}
        renderItem={({ item }) => <MessageListItem messageItem={item} />}
      />

      <ChatInput onSend={handleSend} isLoading={false} />
    </View>
  );
}
