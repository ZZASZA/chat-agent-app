import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据文件路径（JSON 存储）
const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'chat-data.json');

// 确保 data 目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 内存存储
interface DataStore {
  sessions: Record<string, DbSession>;
  messages: Record<string, DbMessage>;
}

function loadData(): DataStore {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('[DB] Failed to load data file, starting fresh:', e);
  }
  return { sessions: {}, messages: {} };
}

function saveData(data: DataStore): void {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('[DB] Failed to save data file:', e);
  }
}

// 初始化数据存储
let store = loadData();

// 类型定义
export interface DbSession {
  id: string;
  title: string;
  model: string;
  sdk_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  model: string | null;
  created_at: string;
  tool_calls: string | null;
}

// ============= 会话操作 =============

// 获取所有会话
export function getAllSessions(): DbSession[] {
  return Object.values(store.sessions).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

// 获取单个会话
export function getSession(id: string): DbSession | undefined {
  return store.sessions[id];
}

// 创建会话
export function createSession(session: DbSession): DbSession {
  store.sessions[session.id] = session;
  saveData(store);
  return session;
}

// 更新会话
export function updateSession(id: string, updates: Partial<Pick<DbSession, 'title' | 'model' | 'sdk_session_id'>>): boolean {
  const session = store.sessions[id];
  if (!session) return false;

  if (updates.title !== undefined) session.title = updates.title;
  if (updates.model !== undefined) session.model = updates.model;
  if (updates.sdk_session_id !== undefined) session.sdk_session_id = updates.sdk_session_id;
  session.updated_at = new Date().toISOString();

  store.sessions[id] = session;
  saveData(store);
  return true;
}

// 删除会话
export function deleteSession(id: string): boolean {
  if (!store.sessions[id]) return false;

  // 同时删除该会话的所有消息
  for (const [msgId, msg] of Object.entries(store.messages)) {
    if (msg.session_id === id) {
      delete store.messages[msgId];
    }
  }

  delete store.sessions[id];
  saveData(store);
  return true;
}

// ============= 消息操作 =============

// 获取会话的所有消息
export function getMessagesBySession(sessionId: string): DbMessage[] {
  return Object.values(store.messages)
    .filter(msg => msg.session_id === sessionId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

// 创建消息
export function createMessage(message: DbMessage): DbMessage {
  store.messages[message.id] = message;

  // 更新会话的 updated_at
  const session = store.sessions[message.session_id];
  if (session) {
    session.updated_at = new Date().toISOString();
  }

  saveData(store);
  return message;
}

// 更新消息内容
export function updateMessage(id: string, updates: Partial<Pick<DbMessage, 'content' | 'tool_calls'>>): boolean {
  const message = store.messages[id];
  if (!message) return false;

  if (updates.content !== undefined) message.content = updates.content;
  if (updates.tool_calls !== undefined) message.tool_calls = updates.tool_calls;

  store.messages[id] = message;
  saveData(store);
  return true;
}

// 删除消息
export function deleteMessage(id: string): boolean {
  if (!store.messages[id]) return false;
  delete store.messages[id];
  saveData(store);
  return true;
}

// 批量创建消息
export function createMessages(messages: DbMessage[]): void {
  for (const msg of messages) {
    store.messages[msg.id] = msg;
  }
  saveData(store);
}

// 清空所有数据
export function clearAllData(): void {
  store = { sessions: {}, messages: {} };
  saveData(store);
}

export default store;
