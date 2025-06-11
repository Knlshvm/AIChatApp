import "../../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import HistoryChatsDrawer from "@/components/HistoryChatsDrawer";

const myTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "white",
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={myTheme}>
        <Drawer
          drawerContent={HistoryChatsDrawer}
          screenOptions={{
            headerTitle: "",
            headerStyle: { backgroundColor: "black" },
            drawerInactiveTintColor: "white",
            drawerStyle: {
              borderRightColor: "gray",
              borderRightWidth: StyleSheet.hairlineWidth,
            },
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "ChatGpt",
              drawerIcon: () => (
                <FontAwesome5 name="atom" size={18} color="black" />
              ),
            }}
          />
          <Drawer.Screen
            name="chat/[id]"
            options={{
              //   drawerLabel: "ChatGpt",
              //   drawerIcon: () => (
              //     <FontAwesome5 name="atom" size={18} color="black" />
              //   ),

              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
