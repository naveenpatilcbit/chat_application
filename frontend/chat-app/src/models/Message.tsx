export interface Message {
  message: string;
  sender: "user" | "bot";
  id: number;
}

export interface MessageListAPIResponse {
  ok: boolean;
  json: any;
}
