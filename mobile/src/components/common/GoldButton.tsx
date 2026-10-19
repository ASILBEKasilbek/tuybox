import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../theme/colors';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'solid' | 'outline' | 'dark';
  icon?: React.ReactNode;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'solid',
  icon
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics mavjud bo'lmasa xatosiz o'tadi
    }
    onPress();
  };

  if (variant === 'solid') {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={[styles.touchable, style]}>
        <LinearGradient
          colors={['#F3E5AB', '#D4AF37', '#AA7C11']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {icon}
          <Text style={[styles.solidText, textStyle]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'dark') {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={[styles.darkButton, style]}>
        {icon}
        <Text style={[styles.darkText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={[styles.outlineButton, style]}>
      {icon}
      <Text style={[styles.outlineText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  solidText: {
    color: '#0B0E14',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gold[500],
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 24,
    gap: 8,
  },
  outlineText: {
    color: COLORS.gold[700],
    fontSize: 15,
    fontWeight: '600',
  },
  darkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.obsidian[900],
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  darkText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  }
});
