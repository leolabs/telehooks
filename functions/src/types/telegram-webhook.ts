export interface TelegramWebhook {
  update_id: number;
  message?: Message;
  edited_message?: EditedMessage;
}

export interface EditedMessage {
  message_id: number;
  from: From;
  chat: EditedMessageChat;
  date: number;
  edit_date: number;
  text: string;
  entities: Entity[];
}

export interface EditedMessageChat {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  type: Type;
}

export enum Type {
  Group = "group",
  Private = "private",
}

export interface Entity {
  offset: number;
  length: number;
  type: string;
}

export interface From {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: LanguageCode;
}

export enum LanguageCode {
  En = "en",
}

export interface Message {
  message_id: number;
  from: From;
  chat: MessageChat;
  date: number;
  new_chat_participant?: LeftChatMember;
  new_chat_member?: LeftChatMember;
  new_chat_members?: LeftChatMember[];
  left_chat_participant?: LeftChatMember;
  left_chat_member?: LeftChatMember;
  text?: string;
  entities?: Entity[];
  group_chat_created?: boolean;
}

export interface MessageChat {
  id: number;
  title?: string;
  type: Type;
  all_members_are_administrators?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface LeftChatMember {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
}
