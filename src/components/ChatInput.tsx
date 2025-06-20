import { useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  Platform,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ChatInputProps {
  onSend: (message: string, imageBase64: string | null) => Promise<void>;
  isLoading?: boolean;
  onGenerateImage: (text: string) => void;
}

export default function ChatInput({
  onSend,
  isLoading,
  onGenerateImage,
}: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleSend = async () => {
    const tempMessage = message.trim();
    const tempImage = imageBase64;

    setMessage("");
    setImageBase64(null);

    try {
      await onSend(tempMessage, tempImage);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        className="bg-[#262626] rounded-t-2xl pt-2"
        style={{ paddingBottom: insets.bottom }}
      >
        {imageBase64 && (
          <ImageBackground
            source={{ uri: imageBase64 }}
            className="w-[50px] h-[50px] mx-3 mt-2"
            imageStyle={{ borderRadius: 10 }}
          >
            <AntDesign
              name="closecircle"
              size={15}
              color="white"
              onPress={() => setImageBase64(null)}
              className="absolute right-1 top-1"
            />
          </ImageBackground>
        )}

        <TextInput
          placeholder="Ask anything"
          placeholderTextColor="grey"
          multiline
          className="text-white pt-4 pb-2 px-4"
          value={message}
          onChangeText={setMessage}
        />
        <View className="flex-row items-center px-4">
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color="white"
            onPress={pickImage}
          />
          {!!message || !!imageBase64 ? (
            <MaterialCommunityIcons
              name="arrow-up-circle"
              size={29}
              color="white"
              className="ml-auto"
              onPress={handleSend}
              disabled={isLoading}
            />
          ) : (
            <View className="flex-row ml-auto bg-white rounded-full p-2 items-center gap-1">
              <MaterialCommunityIcons
                name="account-voice"
                size={15}
                color="black"
              />
              <Text className="text-black text-xs">Voice</Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => onGenerateImage(message)}>
          <Text className="px-4 py-2 bg-green-600 text-white rounded-lg">
            Gen Img
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
