import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import chatHistory from "../../assets/data/chatHistory.json";
import { router, usePathname } from "expo-router";

export default function HistoryChatsDrawer(props: DrawerContentComponentProps) {
  const pathName = usePathname();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {chatHistory.map((item) => (
        <DrawerItem
          key={item.id}
          label={item.title}
          inactiveTintColor="white"
          focused={pathName === `/chat/${item.id}`}
          onPress={() => {
            router.push(`/chat/${item.id}`);
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
}
