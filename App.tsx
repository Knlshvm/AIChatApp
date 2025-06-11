import "./global.css";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View className="items-center justify-center flex-1 bg-white dark:bg-black">
      <Text className="text-black dark:text-white font-bold">
        Open up App.tsx to start working on
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
