import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BudgetPlannerWidget } from '../components/budget/BudgetPlannerWidget';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { GoldButton } from '../components/common/GoldButton';

export const BudgetCalculatorScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>💍 To'y Byudjeti Kalkulyatori</Text>
        <Text style={styles.pageSubtitle}>
          Mavjud pulingizga eng munosib to'yxona, san'atkor va jamoani yig'ing
        </Text>
      </View>

      <BudgetPlannerWidget />

      <LuxuryCard style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Antigravity Smart Maslahatlar</Text>
        <Text style={styles.tipItem}>
          • To'yxonani qish va bahor mavsumlarida band qilsangiz, 10% dan 20% gacha tejash mumkin.
        </Text>
        <Text style={styles.tipItem}>
          • Foto va video studiyalarni «Hammasi ichida» to'plami bilan olish alohida buyurtma berishdan ko'ra arzonroq tushadi.
        </Text>
        <Text style={styles.tipItem}>
          • Platforma orqali rasmiylashtirilgan har bir shartnoma 100% Escrow xavfsiz depozit bilan kafolatlanadi.
        </Text>
      </LuxuryCard>

      <View style={styles.ctaWrapper}>
        <GoldButton
          title="Shu byudjetga to'y paketini yig'ish"
          onPress={() => {}}
        />
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
    lineHeight: 18,
  },
  tipsCard: {
    marginVertical: 12,
    backgroundColor: '#FFFBEB',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 20,
    marginBottom: 6,
  },
  ctaWrapper: {
    marginVertical: 20,
    marginBottom: 60,
  }
});
