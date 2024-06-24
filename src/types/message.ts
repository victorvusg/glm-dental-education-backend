import { Types } from 'mongoose';

export enum EMessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface IMessage {
  role: EMessageRole;
  content: string;
  createdAt: Date;
  dialogId: Types.ObjectId;
}

export type LlamaMessage = Pick<IMessage, 'role' | 'content'>;
