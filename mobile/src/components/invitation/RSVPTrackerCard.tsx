import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { LuxuryCard } from '../common/LuxuryCard';

interface RSVPTrackerCardProps {
  title: string;
  groomAndBride: string;
  daysRemaining: number;
  attendingCount: number;
  declinedCount: number;
}

export const RSVPTrackerCard: React.FC<RSVPTrackerCardProps> = ({
  title,
  groomAndBride,
  daysRemaining,
  attendingCount,
  declinedCount,
}) => {
  return (
    <LuxuryCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.badge}>💌 RAQAMLI TAKLIFNOMA</Text>
        <Text style={styles.coupleNames}>{groomAndBride}</Text>
        <Text style={styles.daysText}>To'ygacha {daysRemaining} kun qoldi ⏳</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: '#ECFDF5' }]}>
          <Text style={[styles.statNumber, { color: '#059669' }]}>{attendingCount}</Text>
          <Text style={styles.statLabel}>Boradiganlar</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#FEF2F2' }]}>
          <Text style={[styles.statNumber, { color: '#DC2626' }]}>{declinedCount}</Text>
          <Text style={styles.statLabel}>Borolmaydiganlar</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#F3F4F6' }]}>
          <Text style={[styles.statNumber, { color: '#111827' }]}>{attendingCount + declinedCount}</Text>
          <Text style={styles.statLabel}>Jami javoblar</Text>
        </View>
      </View>
    </LuxuryCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    color: COLORS.gold[700],
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  coupleNames: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  daysText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  }
});
