import {
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";

export default function ChatInput({ onSend, isLaoding }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    setMessage("");

    try {
      onSend(message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View
        className="bg-[#262626] rounded-t-2xl "
        style={{ paddingBottom: insets.bottom }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ask anything....."
          className="pt-6 pb-2 px-4 text-white"
          placeholderTextColor="gray"
          multiline={true}
        />
        <View className="flex-row  justify-between items-center px-4">
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <View className="rounded-full bg-white p-2 flex-row gap-1 items-center">
            {!!message ? (
              <MaterialCommunityIcons
                name="arrow-up"
                size={29}
                color="black"
                disabled={isLaoding}
                onPress={handleSend}
              />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="account-voice"
                  size={15}
                  color="black"
                />
                <Text className="text-black text-sm">Voice</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
