const API_URLS = {
  auth: 'https://functions.poehali.dev/260a0df5-778b-410b-a24f-edfcac663155',
  chats: 'https://functions.poehali.dev/eb16627a-c5f8-419f-9501-077dea0dbaa4',
  payments: 'https://functions.poehali.dev/1fc6f7fc-30d4-4613-bec2-17cbd8f2a7cf',
};

export const api = {
  async register(phone: string, nickname: string, username: string, avatar_type: string, avatar_value: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        phone,
        nickname,
        username,
        avatar_type,
        avatar_value,
      }),
    });
    return response.json();
  },

  async login(phone: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        phone,
      }),
    });
    return response.json();
  },

  async createChat(type: string, name: string, description: string, created_by: number, members: number[]) {
    const response = await fetch(API_URLS.chats, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_chat',
        type,
        name,
        description,
        created_by,
        members,
      }),
    });
    return response.json();
  },

  async sendMessage(chat_id: number, sender_id: number, content: string, message_type = 'text') {
    const response = await fetch(API_URLS.chats, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_message',
        chat_id,
        sender_id,
        content,
        message_type,
      }),
    });
    return response.json();
  },

  async getChats(user_id: number) {
    const response = await fetch(`${API_URLS.chats}?action=get_chats&user_id=${user_id}`);
    return response.json();
  },

  async getMessages(chat_id: number) {
    const response = await fetch(`${API_URLS.chats}?action=get_messages&chat_id=${chat_id}`);
    return response.json();
  },

  async addContact(user_id: number, contact_id: number) {
    const response = await fetch(API_URLS.chats, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_contact',
        user_id,
        contact_id,
      }),
    });
    return response.json();
  },

  async getContacts(user_id: number) {
    const response = await fetch(`${API_URLS.chats}?action=get_contacts&user_id=${user_id}`);
    return response.json();
  },

  async createPayment(user_id: number, payment_type: string, payment_method: string, amount = 350) {
    const response = await fetch(API_URLS.payments, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_payment',
        user_id,
        payment_type,
        payment_method,
        amount,
      }),
    });
    return response.json();
  },

  async confirmPayment(transaction_id: string) {
    const response = await fetch(API_URLS.payments, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'confirm_payment',
        transaction_id,
      }),
    });
    return response.json();
  },
};
