import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import { Chat, Message } from "@/types/types";
import { markdownStyles } from "@/utils/Markdown";

interface MessageListItemProps {
  messageItem: Message;
}

export default function MessageListItem({ messageItem }: MessageListItemProps) {
  const { message, role } = messageItem;
  const isUSer = role === "user";

  return (
    <View
      className={`flex-row mb-3 px-2 ${
        isUSer ? "justify-end" : "justify-start"
      }`}
    >
      <View
        className={`${
          isUSer && "bg-[#262626] max-w-[70%]"
        } rounded-xl px-4 py-1`}
      >
        <Markdown style={markdownStyles}>{message}</Markdown>
      </View>
    </View>
  );
}
