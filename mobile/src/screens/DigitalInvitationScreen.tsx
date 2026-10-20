import React from 'react';
import { View, Text, ScrollView, StyleSheet, Share } from 'react-native';
import { COLORS } from '../theme/colors';
import { RSVPTrackerCard } from '../components/invitation/RSVPTrackerCard';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { GoldButton } from '../components/common/GoldButton';

export const DigitalInvitationScreen: React.FC = () => {
  const inviteLink = "https://tuybor.uz/invite/asilbek-madina-2026";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Assalomu alaykum! Sizni to'yimizga taklif qilamiz! Hashamatli taklifnoma va lokatsiya: ${inviteLink}`,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>💌 VIP TELEGRAM RSVP</Text>
        </View>
        <Text style={styles.pageTitle}>Raqamli Taklifnoma & QR</Text>
        <Text style={styles.pageSubtitle}>
          Qog'oz taklifnoma o'rniga zamonaviy shaxsiy veb-sahifa va onlayn javoblar tizimi
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
          style={{ marginTop: 14 }}
        />
      </LuxuryCard>

      {/* So'nggi kelgan tabriklar va javoblar */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Oxirgi kelgan tabriklar va javoblar:</Text>
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

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    marginBottom: 16,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.4)',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A5506',
    letterSpacing: 0.8,
  },
  pageTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#110A03',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#7C6B5C',
    marginTop: 4,
    lineHeight: 18,
  },
  linkCard: {
    marginVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.35)',
    padding: 18,
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  linkCardTitle: {
    fontSize: 13,
    color: '#7C6B5C',
    fontWeight: '700',
    marginBottom: 8,
  },
  linkBox: {
    backgroundColor: '#FAF8F5',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
  },
  linkText: {
    color: '#8A5506',
    fontSize: 14,
    fontWeight: '800',
  },
  recentSection: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#110A03',
    marginBottom: 12,
  },
  rsvpItem: {
    marginVertical: 6,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.25)',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  rsvpItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  guestName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#110A03',
  },
  guestStatus: {
    fontSize: 12,
    fontWeight: '800',
  },
  statusGreen: {
    color: '#059669',
  },
  statusRed: {
    color: '#DC2626',
  },
  guestMessage: {
    fontSize: 13,
    color: '#5C4A3A',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 90,
  }
});
