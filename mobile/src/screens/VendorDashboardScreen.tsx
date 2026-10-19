import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { GoldButton } from '../components/common/GoldButton';

export const VendorDashboardScreen: React.FC = () => {
  const [requests, setRequests] = useState([
    {
      id: 101,
      customerName: "Sardorbek Rahimov",
      phone: "+998 90 333 44 55",
      eventDate: "15-Oktabr, 2026",
      timeSlot: "Bazm vaqti (18:00 - 23:00)",
      guestCount: 400,
      totalPrice: 45000000,
      depositAmount: 4500000,
      notes: "Sahnani tort kesishga qulayroq qilib bersangiz",
    },
    {
      id: 102,
      customerName: "Bekzod Umarov",
      phone: "+998 97 111 22 33",
      eventDate: "22-Oktabr, 2026",
      timeSlot: "Osh vaqti (11:00 - 14:00)",
      guestCount: 300,
      totalPrice: 35000000,
      depositAmount: 3500000,
      notes: "Ertalab soat 10:00 da oshpazlar kiradi",
    }
  ]);

  const handleAction = (id: number, action: 'accept' | 'reject') => {
    Alert.alert(
      action === 'accept' ? "Qabul qilindi! 🎉" : "Rad etildi",
      action === 'accept'
        ? "Buyurtma tasdiqlandi. Mijozga SMS xabarnoma yuborildi va sana kalendarda avtomatik band qilindi."
        : "Buyurtma rad etildi va mijozga bildirishnoma yuborildi."
    );
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.badge}>👑 BIZNES KABINETI</Text>
          <Text style={styles.title}>Versal Grand Palace</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>🟢 Online</Text>
        </View>
      </View>

      {/* Moliya va Balans Kartochkasi */}
      <LuxuryCard style={styles.financeCard}>
        <Text style={styles.balanceLabel}>Kafolatlangan Balans (Escrow):</Text>
        <Text style={styles.balanceValue}>18,500,000 so'm</Text>
        <Text style={styles.balanceSubtext}>
          Ushbu mablag' to'ylar o'tgandan so'ng to'g'ridan-to'g'ri hisobingizga tushadi.
        </Text>
        <GoldButton
          title="Mablag'ni kartaga yechib olish 💳"
          onPress={() => Alert.alert("Mablag' yechish", "Kartangizga 18,500,000 so'm o'tkazish so'rovi yuborildi.")}
          style={{ marginTop: 14 }}
        />
      </LuxuryCard>

      {/* Tezkor Ko'rsatkichlar */}
      <View style={styles.statsRow}>
        <LuxuryCard style={styles.statCard}>
          <Text style={styles.statNumber}>184</Text>
          <Text style={styles.statLabel}>O'tgan to'ylar</Text>
        </LuxuryCard>
        <LuxuryCard style={styles.statCard}>
          <Text style={styles.statNumber}>4.95 ★</Text>
          <Text style={styles.statLabel}>Reyting</Text>
        </LuxuryCard>
        <LuxuryCard style={styles.statCard}>
          <Text style={styles.statNumber}>1.2K</Text>
          <Text style={styles.statLabel}>Ko'rishlar</Text>
        </LuxuryCard>
      </View>

      {/* Yangi Bron So'rovlari (CRM Leads) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          📥 Yangi Bron So'rovlari ({requests.length})
        </Text>
      </View>

      {requests.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Hozircha yangi so'rovlar yo'q ✨</Text>
        </View>
      ) : (
        requests.map((req) => (
          <LuxuryCard key={req.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View>
                <Text style={styles.customerName}>{req.customerName}</Text>
                <Text style={styles.customerPhone}>📞 {req.phone}</Text>
              </View>
              <View style={styles.depositBadge}>
                <Text style={styles.depositBadgeText}>
                  Avans: {req.depositAmount.toLocaleString()} so'm
                </Text>
              </View>
            </View>

            <View style={styles.detailsBox}>
              <Text style={styles.detailItem}>📅 <Text style={styles.detailBold}>Sana:</Text> {req.eventDate}</Text>
              <Text style={styles.detailItem}>⏰ <Text style={styles.detailBold}>Vaqt:</Text> {req.timeSlot}</Text>
              <Text style={styles.detailItem}>👥 <Text style={styles.detailBold}>Mehmon:</Text> {req.guestCount} kishi</Text>
              <Text style={styles.detailItem}>💰 <Text style={styles.detailBold}>Jami narx:</Text> {req.totalPrice.toLocaleString()} so'm</Text>
              {req.notes && (
                <Text style={styles.notesText}>💬 "{req.notes}"</Text>
              )}
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                onPress={() => handleAction(req.id, 'reject')}
                style={styles.rejectBtn}
              >
                <Text style={styles.rejectBtnText}>Rad etish</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleAction(req.id, 'accept')}
                style={styles.acceptBtn}
              >
                <Text style={styles.acceptBtnText}>Qabul qilish ✓</Text>
              </TouchableOpacity>
            </View>
          </LuxuryCard>
        ))
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gold[700],
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  financeCard: {
    backgroundColor: COLORS.obsidian[900],
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginVertical: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.gold[300],
    marginVertical: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  requestCard: {
    marginVertical: 8,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  customerPhone: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  depositBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  depositBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  detailsBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  detailItem: {
    fontSize: 13,
    color: '#374151',
  },
  detailBold: {
    fontWeight: '600',
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6B7280',
    marginTop: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  acceptBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  }
});
