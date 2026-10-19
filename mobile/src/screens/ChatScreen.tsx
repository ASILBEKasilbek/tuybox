import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../theme/colors';
import { LuxuryCard } from '../components/common/LuxuryCard';

export const ChatScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'vendor',
      text: "Assalomu alaykum! 'Versal Grand Palace' to'yxonasiga xush kelibsiz. Qaysi sanaga to'y rejalashtiryapsiz?",
      time: "14:20"
    },
    {
      id: 2,
      sender: 'user',
      text: "Assalomu alaykum! 15-Oktabr kuni 400 kishilik to'y qilmoqchi edik. Standart paket narxi o'zgarmaydimi?",
      time: "14:22"
    },
    {
      id: 3,
      sender: 'vendor',
      text: "Ha, albatta! 15-Oktabr kuni ayni damda bo'sh turibdi. Narx 45,000,000 so'm, ichiga zal, chiroq va akustika kiradi.",
      time: "14:25"
    }
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'user',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.vendorName}>Versal Grand Palace</Text>
          <Text style={styles.statusOnline}>● Online</Text>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Text style={styles.callBtnText}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesList} contentContainerStyle={{ paddingVertical: 16 }}>
        {messages.map((m) => {
          const isMe = m.sender === 'user';
          return (
            <View
              key={m.id}
              style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowVendor]}
            >
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleVendor]}>
                <Text style={[styles.messageText, isMe ? styles.textMe : styles.textVendor]}>
                  {m.text}
                </Text>
                <Text style={[styles.timeText, isMe ? styles.timeMe : styles.timeVendor]}>
                  {m.time}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Xabar yozing..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>➔</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statusOnline: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  callBtn: {
    padding: 8,
  },
  callBtnText: {
    fontSize: 18,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowVendor: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: COLORS.obsidian[900],
    borderBottomRightRadius: 4,
  },
  bubbleVendor: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textMe: {
    color: '#FFFFFF',
  },
  textVendor: {
    color: '#1F2937',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMe: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  timeVendor: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gold[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#0B0E14',
    fontSize: 16,
    fontWeight: '800',
  }
});
