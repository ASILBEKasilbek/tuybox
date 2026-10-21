import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

type ChatMode = 'ai' | 'vendor';

interface Message {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const ChatScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<ChatMode>('ai');

  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'assistant',
      text: "Assalomu alaykum! Men TuyBor Royal AI to'y konsyerjiman 👑\n\nTo'yingiz sanasi, byudjetni taqsimlash, to'yxona va san'atkorlarni tanlash bo'yicha qanday yordam bera olaman?",
      time: "10:00",
    },
    {
      id: 2,
      sender: 'user',
      text: "Bizda taxminan $15,000 byudjet bor, 400 kishilik to'y uchun qanday taqsimlasak to'g'ri bo'ladi?",
      time: "10:02",
    },
    {
      id: 3,
      sender: 'assistant',
      text: "Ajoyib byudjet! 400 kishilik to'y uchun optimal taqsimot formulasi:\n\n1. 🏰 To'yxona & Osh (50%): ~85,000,000 so'm (Versal yoki Oqsaroy standart menyusi)\n2. 🎤 San'atkor & Boshlovchi (20%): ~35,000,000 so'm (Jonli guruh + xonanda)\n3. 📸 Foto & Video (10%): ~17,000,000 so'm (2 kamerali dron + Love Story)\n4. 💐 Bezak & Dekor (10%): ~17,000,000 so'm\n5. 🚗 Kortej & Taklifnomalar (10%): ~17,000,000 so'm\n\nTuyBor orqali 10% avans bilan bron qilsangiz, bepul shartnoma sug'urtasiga ega bo'lasiz!",
      time: "10:03",
    },
  ]);

  const [vendorMessages, setVendorMessages] = useState<Message[]>([
    {
      id: 101,
      sender: 'assistant',
      text: "Assalomu alaykum! 'Versal Grand Palace' ma'muriyatiga xush kelibsiz. Qaysi oy va kunga qiziqyapsiz?",
      time: "12:30",
    },
    {
      id: 102,
      sender: 'user',
      text: "15-Noyabr shanba kuni bo'shmi? Kechki bazm uchun.",
      time: "12:35",
    },
    {
      id: 103,
      sender: 'assistant',
      text: "Ha, 15-Noyabr kechki bazm ayni damda ochiq turibdi! Ilova orqali 10% kafolatli avans to'lab joyni o'zingizga mustahkamlab qo'yishingiz mumkin.",
      time: "12:38",
    },
  ]);

  const [inputText, setInputText] = useState('');

  const currentMessages = activeMode === 'ai' ? aiMessages : vendorMessages;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedText = inputText.trim();
    setInputText('');

    if (activeMode === 'ai') {
      const newAiList = [...aiMessages, userMsg];
      setAiMessages(newAiList);

      setTimeout(() => {
        let reply = "Savolingiz uchun tashakkur! TuyBor AI ushbu xizmat bo'yicha barcha kafolatlangan takliflarni tayyorladi.";
        if (updatedText.toLowerCase().includes('avans') || updatedText.toLowerCase().includes('shartnoma')) {
          reply = "🔒 TuyBor kafolati bo'yicha: To'langan 10% avans tadbir kuni to'liq yakunlanguncha muzlatiladi. Sizga rasmiy QR-shtrixli elektron kvitansiya beriladi.";
        } else if (updatedText.toLowerCase().includes('to\'yxona') || updatedText.toLowerCase().includes('saroy')) {
          reply = "Toshkentdagi Versal Grand va Oqsaroy saroylari hozirda eng yuqori reytingda turibdi (4.95+). Ikkalasida ham bepul avtoturargoh va LED ekranlar mavjud.";
        }

        setAiMessages([
          ...newAiList,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 700);
    } else {
      const newVendorList = [...vendorMessages, userMsg];
      setVendorMessages(newVendorList);

      setTimeout(() => {
        setVendorMessages([
          ...newVendorList,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: "Xabaringiz qabul qilindi. Menejerimiz bir necha daqiqada siz bilan telefon orqali ham bog'lanishi mumkin.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 900);
    }
  };

  const handlePromptChip = (chipText: string) => {
    setInputText(chipText);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* 👑 Luxury Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {activeMode === 'ai' ? '👑 TuyBor Royal AI Konsyerj' : '🏰 Versal Saroyi Ma\'muriyati'}
          </Text>
          <Text style={styles.statusOnline}>● Jonli bog'lanish faol</Text>
        </View>

        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Alert.alert("Qo'ng'iroq", "TuyBor Konsyerj yordam liniyasi: +998 71 200 45 45")}
        >
          <Text style={styles.callBtnText}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* 🔄 Switch Mode Tabs */}
      <View style={styles.tabSwitchContainer}>
        <TouchableOpacity
          style={[styles.switchTab, activeMode === 'ai' && styles.switchTabActive]}
          onPress={() => setActiveMode('ai')}
          activeOpacity={0.85}
        >
          <Text style={[styles.switchTabText, activeMode === 'ai' && styles.switchTabTextActive]}>
            🤖 AI Aqlli Konsyerj
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchTab, activeMode === 'vendor' && styles.switchTabActive]}
          onPress={() => setActiveMode('vendor')}
          activeOpacity={0.85}
        >
          <Text style={[styles.switchTabText, activeMode === 'vendor' && styles.switchTabTextActive]}>
            💬 To'yxona Menejeri
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Recommendation Chips (for AI Mode) */}
      {activeMode === 'ai' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContainer}
        >
          {[
            "To'y byudjetini taqsimlash 🧮",
            "10% Avans xavfsizligi qanday? 🔒",
            "Eng yaxshi to'yxonalar 🏰",
            "Kelin-kuyov valsi musiqalari 🎵",
          ].map((chip, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handlePromptChip(chip)}
              style={styles.chipPill}
              activeOpacity={0.8}
            >
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Messages */}
      <ScrollView
        style={styles.messagesList}
        contentContainerStyle={{ paddingVertical: 14, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {currentMessages.map((m) => {
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

      {/* ✍️ Luxury Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={activeMode === 'ai' ? "AI Konsyerjdan so'rang..." : "Menejerga savol yozing..."}
          placeholderTextColor="#8E7B6B"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          disabled={!inputText.trim()}
          activeOpacity={0.85}
        >
          <Text style={styles.sendButtonText}>➔</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 36,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(229, 169, 18, 0.25)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF9E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5A912',
  },
  backBtnText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#110A03',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#110A03',
  },
  statusOnline: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 1,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF9E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5A912',
  },
  callBtnText: {
    fontSize: 16,
  },
  tabSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
  },
  switchTabActive: {
    backgroundColor: '#1E140A',
    borderColor: '#E5A912',
  },
  switchTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C6B5C',
  },
  switchTabTextActive: {
    color: '#F5C538',
    fontWeight: '800',
  },
  chipsScroll: {
    maxHeight: 38,
    marginVertical: 4,
  },
  chipsContainer: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chipPill: {
    backgroundColor: '#FFF9E5',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  chipText: {
    fontSize: 11,
    color: '#8A5506',
    fontWeight: '700',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowVendor: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  bubbleMe: {
    backgroundColor: '#1E140A',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#E5A912',
  },
  bubbleVendor: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  textMe: {
    color: '#FFFFFF',
  },
  textVendor: {
    color: '#110A03',
  },
  timeText: {
    fontSize: 9.5,
    marginTop: 6,
    alignSelf: 'flex-end',
    fontWeight: '600',
  },
  timeMe: {
    color: '#D4AF37',
  },
  timeVendor: {
    color: '#8E7B6B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(229, 169, 18, 0.25)',
    gap: 10,
    marginBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#110A03',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.3)',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E140A',
    borderWidth: 1.5,
    borderColor: '#E5A912',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#F5C538',
    fontSize: 18,
    fontWeight: '900',
  },
});
