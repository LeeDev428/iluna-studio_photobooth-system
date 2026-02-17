import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';

export default function AdminChatScreen({ route, navigation }) {
  const user = route.params?.user || {};
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.user_id);
    }
  }, [selectedUser]);

  const loadConversations = async () => {
    try {
      const response = await api.get('/admin/get_all_messages.php');
      if (response.data.success) {
        setConversations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/get_user_messages.php?user_id=${userId}`);
      if (response.data.success) {
        setMessages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      const response = await api.post('/admin/send_message.php', {
        user_id: selectedUser.user_id,
        message: messageText.trim()
      });

      if (response.data.success) {
        setMessageText('');
        loadMessages(selectedUser.user_id);
        loadConversations();
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#0D9488', '#14B8A6']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedUser ? selectedUser.user_name : 'Messages'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.mainContainer}>
          {/* Conversations List */}
          {!selectedUser && (
            <ScrollView style={styles.conversationsList}>
              {conversations.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No conversations yet</Text>
                </View>
              ) : (
                conversations.map((conv) => (
                  <TouchableOpacity
                    key={conv.user_id}
                    style={styles.conversationItem}
                    onPress={() => setSelectedUser(conv)}
                  >
                    <View style={styles.conversationLeft}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{conv.user_name.charAt(0)}</Text>
                      </View>
                      <View style={styles.conversationInfo}>
                        <Text style={styles.conversationName}>{conv.user_name}</Text>
                        <Text style={styles.conversationPreview} numberOfLines={1}>
                          {conv.last_sender === 'admin' ? 'You: ' : ''}
                          {conv.last_message || 'No messages'}
                        </Text>
                      </View>
                    </View>
                    {conv.unread_count > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{conv.unread_count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}

          {/* Chat View */}
          {selectedUser && (
            <KeyboardAvoidingView
              style={styles.chatContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={90}
            >
              <ScrollView style={styles.messagesContainer}>
                {messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubble,
                      msg.sender === 'admin' ? styles.adminMessage : styles.userMessage
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      msg.sender === 'admin' ? styles.adminMessageText : styles.userMessageText
                    ]}>
                      {msg.message}
                    </Text>
                    <Text style={[
                      styles.messageTime,
                      msg.sender === 'admin' ? styles.adminTimeText : styles.userTimeText
                    ]}>
                      {formatTime(msg.created_at)}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type your message..."
                  placeholderTextColor="#9CA3AF"
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                  <Text style={styles.sendIcon}>➤</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AdminDashboard', { user })}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📊</Text>
            </View>
            <Text style={styles.navLabel}>Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AdminChat', { user })}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>💬</Text>
            </View>
            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
  },
  conversationsList: {
    flex: 1,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conversationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  conversationPreview: {
    fontSize: 14,
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
  },
  adminMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0D9488',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#1F2937',
  },
  adminMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
  },
  userTimeText: {
    color: '#6B7280',
  },
  adminTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 10,
  },
  sendBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});
