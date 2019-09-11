export interface SlackPayload {
  text: string;
  team_id: string;
  channel_id: string;
  user_id: string;
  bot_id: string;
  channel_name: string;
  command: string;
  user_name: string;
}