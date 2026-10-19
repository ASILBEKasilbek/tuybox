import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { LuxuryCard } from '../common/LuxuryCard';

export const BudgetPlannerWidget: React.FC = () => {
  const [budgetMillions, setBudgetMillions] = useState<number>(80); // 80 mln so'm

  const total = budgetMillions * 1000000;

  const allocations = [
    { name: "To'yxona va Dasturxon", percent: 48, amount: total * 0.48, color: '#D4AF37' },
    { name: "San'atkor va Boshlovchi", percent: 20, amount: total * 0.20, color: '#10B981' },
    { name: "Foto & Video Montaj", percent: 12, amount: total * 0.12, color: '#3B82F6' },
    { name: "Kelin Libosi va Sarpo", percent: 10, amount: total * 0.10, color: '#EC4899' },
    { name: "Kortej va Avtomobillar", percent: 5, amount: total * 0.05, color: '#F59E0B' },
    { name: "Dekor va Taklifnomalar", percent: 5, amount: total * 0.05, color: '#8B5CF6' },
  ];

  return (
    <LuxuryCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.badge}>💡 AI PLANNING</Text>
        <Text style={styles.title}>To'y Byudjeti Kalkulyatori</Text>
        <Text style={styles.subtitle}>Byudjetingizga mos optimal to'y taqsimoti</Text>
      </View>

      {/* Byudjet tanlagich */}
      <View style={styles.budgetDisplayRow}>
        <TouchableOpacity
          onPress={() => setBudgetMillions(Math.max(30, budgetMillions - 10))}
          style={styles.adjustBtn}
        >
          <Text style={styles.adjustBtnText}>-</Text>
        </TouchableOpacity>

        <View style={styles.amountCenter}>
          <Text style={styles.budgetAmountText}>{budgetMillions} mln</Text>
          <Text style={styles.currencyText}>so'm jami byudjet</Text>
        </View>

        <TouchableOpacity
          onPress={() => setBudgetMillions(Math.min(300, budgetMillions + 10))}
          style={styles.adjustBtn}
        >
          <Text style={styles.adjustBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar (Vizual taqsimot) */}
      <View style={styles.progressBarWrapper}>
        {allocations.map((item, index) => (
          <View
            key={index}
            style={[styles.progressSegment, { flex: item.percent, backgroundColor: item.color }]}
          />
        ))}
      </View>

      {/* Taqsimot ro'yxati */}
      <View style={styles.list}>
        {allocations.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.nameRow}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.percentText}>{item.percent}%</Text>
            </View>
            <Text style={styles.amountText}>
              {Math.round(item.amount / 1000000).toLocaleString()} mln so'm
            </Text>
          </View>
        ))}
      </View>
    </LuxuryCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    color: COLORS.gold[700],
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  budgetDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    marginVertical: 12,
  },
  adjustBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  adjustBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  amountCenter: {
    alignItems: 'center',
  },
  budgetAmountText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  currencyText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBarWrapper: {
    height: 10,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressSegment: {
    height: '100%',
  },
  list: {
    marginTop: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  percentText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  amountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  }
});
