import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../theme/colors';

interface LuxuryCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'glass' | 'outlined';
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({ children, style, variant = 'elevated' }) => {
  return (
    <View style={[styles.card, variant === 'glass' && styles.glassCard, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.porcelain.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)', // Oltin tusli nozik chegara
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  }
});
