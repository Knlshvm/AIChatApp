import ChatInput from "@/components/ChatInput";
import { useChatStore } from "@/store/chatStore";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const createNewChat = useChatStore((state) => state.createNewChat);
  const addNewMessage = useChatStore((state) => state.addNewMessage);
  const setIsWaitingForResponse = useChatStore(
    (state) => state.setIsWaitingForResponse
  );

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

  const handleSend = async (message: string, imageBase64: string | null) => {
    setIsWaitingForResponse(true);
    const chatId = createNewChat(message.slice(0, 50));
    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      message,
      ...(imageBase64 && { image: imageBase64 }),
    };
    addNewMessage(chatId, newMessage);
    router.push(`/chat/${chatId}`);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: message, imageBase64 },

            {
              role: "user",
              content: message,
              ...(imageBase64 && { imageBase64 }),
            },
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

      addNewMessage(chatId, aiResponseMessage);
    } catch (error) {
      console.log("Home chat error:", error);
    } finally {
      setIsWaitingForResponse(false);
    }
  };
  const handleGenerateImage = async (prompt: string) => {
    setIsWaitingForResponse(true);
    const chatId = createNewChat(prompt.slice(0, 50));
    const userPrompt = {
      id: Date.now().toString(),
      role: "user" as const,
      message: prompt,
    };
    addNewMessage(chatId, userPrompt);
    router.push(`/chat/${chatId}`);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          generateImage: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const imageResponse = {
        id: Date.now().toString(),
        role: "assistant" as const,
        message: "Here is your generated image:",
        image: data.generatedImage,
      };

      addNewMessage(chatId, imageResponse);
    } catch (error) {
      console.log("Image generation error:", error);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  return (
    <View className=" justify-center flex-1">
      <View className="flex-1"></View>
      <ChatInput
        onSend={handleSend}
        isLoading={false}
        onGenerateImage={handleGenerateImage}
      />
    </View>
  );
}
