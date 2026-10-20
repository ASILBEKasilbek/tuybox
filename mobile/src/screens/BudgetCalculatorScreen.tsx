import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BudgetPlannerWidget } from '../components/budget/BudgetPlannerWidget';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { GoldButton } from '../components/common/GoldButton';

export const BudgetCalculatorScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>👑 SMART ALLOCATION</Text>
        </View>
        <Text style={styles.pageTitle}>To'y Byudjeti Kalkulyatori</Text>
        <Text style={styles.pageSubtitle}>
          Mavjud pulingizga eng munosib to'yxona, san'atkor va jamoani optimal yig'ing
        </Text>
      </View>

      <BudgetPlannerWidget />

      <LuxuryCard style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 TuyBor Smart Maslahatlari</Text>
        <Text style={styles.tipItem}>
          • To'yxonani qish va bahor oylarida band qilsangiz, 15% dan 25% gacha chegirma olishingiz mumkin.
        </Text>
        <Text style={styles.tipItem}>
          • Foto va video studiyalarni «Hammasi ichida (All-Inclusive)» to'plami bilan olish alohida buyurtma berishdan 20% arzonroq tushadi.
        </Text>
        <Text style={styles.tipItem}>
          • TuyBor orqali rasmiylashtirilgan har bir shartnoma 100% kafolatlangan va double-booking (sanalarning to'qnashishi) xavfi yo'q.
        </Text>
      </LuxuryCard>

      <View style={styles.ctaWrapper}>
        <GoldButton
          title="Shu Byudjetga To'y Paketini Yig'ish →"
          onPress={() => {}}
        />
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
  tipsCard: {
    marginVertical: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.35)',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4E2C00',
    marginBottom: 10,
  },
  tipItem: {
    fontSize: 13,
    color: '#5C4A3A',
    lineHeight: 20,
    marginBottom: 8,
  },
  ctaWrapper: {
    marginVertical: 12,
  },
  bottomSpacer: {
    height: 90,
  }
});
