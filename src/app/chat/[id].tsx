import { View, Text, FlatList, Animated, Easing } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatInput from "@/components/ChatInput";
import MessageListItem from "@/components/MessageListItem";
import { useChatStore } from "@/store/chatStore";
import { useEffect, useRef, useState } from "react";

export default function ChatScreen() {
  const flatListRef = useRef<FlatList | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { id } = useLocalSearchParams();
  const chat = useChatStore((state) =>
    state.chatHistory.find((chat) => chat.id === id)
  );

  const addNewMessage = useChatStore((state) => state.addNewMessage);
  const isWaitingForResponse = useChatStore(
    (state) => state.isWaitingForResponse
  );

  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const isLoading = isWaitingForResponse || isLoadingResponse;

  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timeout);
  }, [chat?.messages]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;

    if (isLoading) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.delay(1),
          Animated.timing(fadeAnim, {
            toValue: 0.4,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isLoading]);

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

  const handleSend = async (message: string, imageBase64: string | null) => {
    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      message,
      ...(imageBase64 && { image: imageBase64 }),
    };
    addNewMessage(id, newMessage);

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

  const handleGenerateImage = async (prompt: string) => {
    setIsLoadingResponse(true);
    const userPrompt = {
      id: Date.now().toString(),
      role: "user" as const,
      message: prompt,
    };
    addNewMessage(id, userPrompt);

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
            { role: "user", content: prompt },
          ],
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

      addNewMessage(chat.id, imageResponse);
    } catch (error) {
      console.error("Image generation error:", error);
    } finally {
      setIsLoadingResponse(false);
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
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={chat?.messages || []}
          renderItem={({ item }) => <MessageListItem messageItem={item} />}
          contentContainerStyle={{ paddingTop: 15 }}
          ListFooterComponent={() =>
            isLoading && (
              <Animated.Text
                style={{ opacity: fadeAnim }}
                className="text-[#939393] px-6 mb-4"
              >
                Waiting for response...
              </Animated.Text>
            )
          }
        />
      </View>
      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        onGenerateImage={handleGenerateImage}
      />
    </View>
  );
}
