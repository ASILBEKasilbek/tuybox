import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const BadgeVerified: React.FC = () => {
  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.text}>VERIFIED</Text>
    </View>
  );
};

export const LuxuryRating: React.FC<{ rating: number; count?: number }> = ({ rating, count }) => {
  return (
    <View style={styles.ratingRow}>
      <Text style={styles.star}>★</Text>
      <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      {count !== undefined && <Text style={styles.countText}>({count})</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: '#F59E0B',
    fontSize: 14,
  },
  ratingValue: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
  },
  countText: {
    color: '#6B7280',
    fontSize: 12,
  }
});
