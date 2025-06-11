import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text className="text-white">Chat screen {id}</Text>
    </View>
  );
}
