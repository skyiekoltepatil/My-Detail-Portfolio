export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
}

const DB_KEY = 'portfolio_contact_messages_db';

export const saveMessageToDatabase = async (data: { name: string; email: string; message: string }): Promise<ContactMessage> => {
  const newMessage: ContactMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
    timestamp: new Date().toISOString(),
    status: 'unread',
  };

  try {
    const existing = getStoredMessages();
    const updated = [newMessage, ...existing];
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving message to database:', err);
  }

  // Simulate network delay for realistic UI transition
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return newMessage;
};

export const getStoredMessages = (): ContactMessage[] => {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const markMessageAsRead = (id: string): ContactMessage[] => {
  try {
    const messages = getStoredMessages();
    const updated = messages.map((msg) =>
      msg.id === id ? { ...msg, status: 'read' as const } : msg
    );
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getStoredMessages();
  }
};

export const markAllMessagesAsRead = (): ContactMessage[] => {
  try {
    const messages = getStoredMessages();
    const updated = messages.map((msg) => ({ ...msg, status: 'read' as const }));
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getStoredMessages();
  }
};

export const deleteMessage = (id: string): ContactMessage[] => {
  try {
    const messages = getStoredMessages();
    const updated = messages.filter((msg) => msg.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getStoredMessages();
  }
};

export const clearStoredMessages = () => {
  localStorage.removeItem(DB_KEY);
};

export const getUnreadCount = (): number => {
  const messages = getStoredMessages();
  return messages.filter((m) => m.status === 'unread').length;
};
