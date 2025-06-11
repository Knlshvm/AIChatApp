import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-white font-bold">
        Open up App.tsx to start working on
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
