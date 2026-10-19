import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { COLORS } from '../theme/colors';
import { RSVPTrackerCard } from '../components/invitation/RSVPTrackerCard';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { GoldButton } from '../components/common/GoldButton';

export const DigitalInvitationScreen: React.FC = () => {
  const inviteLink = "https://tuyxona.uz/invite/asilbek-madina-2026";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Assalomu alaykum! Sizni to'yimizga taklif qilamiz! Manzil va tafsilotlar: ${inviteLink}`,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>💌 Raqamli Taklifnoma & QR</Text>
        <Text style={styles.pageSubtitle}>
          Qog'oz taklifnoma o'rniga zamonaviy shaxsiy veb-sahifa va Telegram RSVP
        </Text>
      </View>

      {/* RSVP Tracker */}
      <RSVPTrackerCard
        title="To'y Taklifnomasi"
        groomAndBride="Asilbek & Madina"
        daysRemaining={19}
        attendingCount={240}
        declinedCount={15}
      />

      {/* Havola va Ulashish */}
      <LuxuryCard style={styles.linkCard}>
        <Text style={styles.linkCardTitle}>Shaxsiy to'y havolangiz:</Text>
        <View style={styles.linkBox}>
          <Text style={styles.linkText} numberOfLines={1}>{inviteLink}</Text>
        </View>
        <GoldButton
          title="Telegram orqali mehmonlarga yuborish ✈️"
          onPress={handleShare}
          style={{ marginTop: 12 }}
        />
      </LuxuryCard>

      {/* So'nggi kelgan tabriklar va javoblar */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Oxirgi kelgan tabriklar:</Text>
        {[
          { name: "Sardorbek va oilasi", status: "Albatta boramiz (+3 kishi)", text: "Baxtli bo'linglar, to'yda ko'rishguncha!" },
          { name: "Dilshod Akramov", status: "Boraman (+1 kishi)", text: "Qo'sha qaringlar, umringlar uzoq bo'lsin!" },
          { name: "Jamshid Qodirov", status: "Bora olmayman", text: "Afsuski xizmat safaridaman, chin dildan tabriklayman!" },
        ].map((item, idx) => (
          <LuxuryCard key={idx} style={styles.rsvpItem}>
            <View style={styles.rsvpItemHeader}>
              <Text style={styles.guestName}>{item.name}</Text>
              <Text style={[styles.guestStatus, item.status.includes('Boramiz') || item.status.includes('Boraman') ? styles.statusGreen : styles.statusRed]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.guestMessage}>"{item.text}"</Text>
          </LuxuryCard>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  linkCard: {
    marginVertical: 10,
  },
  linkCardTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  linkBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
  },
  linkText: {
    color: COLORS.gold[700],
    fontSize: 14,
    fontWeight: '700',
  },
  recentSection: {
    marginTop: 16,
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  rsvpItem: {
    marginVertical: 6,
    padding: 14,
  },
  rsvpItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  guestName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  guestStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusGreen: {
    color: '#059669',
  },
  statusRed: {
    color: '#DC2626',
  },
  guestMessage: {
    fontSize: 13,
    color: '#4B5563',
    fontStyle: 'italic',
  }
});
