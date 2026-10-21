import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../theme/colors';

interface PremiumScreenProps {
  onBack: () => void;
  onSuccessPurchase?: () => void;
}

interface PlanOption {
  id: string;
  productId: string;
  name: string;
  duration: string;
  priceUsd: string;
  priceUzsApprox: string;
  badge?: string;
  popular?: boolean;
}

export const PremiumScreen: React.FC<PremiumScreenProps> = ({ onBack, onSuccessPurchase }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('vip_pass');
  const [loading, setLoading] = useState<boolean>(false);
  const [purchased, setPurchased] = useState<boolean>(false);

  const plans: PlanOption[] = [
    {
      id: 'vip_pass',
      productId: 'uz.tuybor.vip.pass',
      name: "To'ygacha VIP Pass",
      duration: "1 martalik to'lov • Butun to'y yakunigacha",
      priceUsd: '$4.99',
      priceUzsApprox: "~65,000 so'm",
      badge: '👑 ENG OMMABOP • TEJAMKOR',
      popular: true,
    },
    {
      id: 'vip_monthly',
      productId: 'uz.tuybor.vip.monthly',
      name: "Oylik VIP A'zolik",
      duration: 'Oylik obuna • Istalgan vaqtda bekor qilinadi',
      priceUsd: '$1.99 / oy',
      priceUzsApprox: "~26,000 so'm / oy",
      badge: 'Moslashuvchan',
      popular: false,
    },
  ];

  const features = [
    {
      icon: '💌',
      title: 'Cheksiz VIP Raqamli Taklifnomalar',
      desc: "24K Palace, Zardo'zi va Oq Marmar shablonlari. Mehmonlar uchun shaxsiy QR-kodli RSVP va tabriklar taxtasi.",
    },
    {
      icon: '🧠',
      title: 'AI Smart Byudjet Optimizatori',
      desc: "Byudjetingizga qarab to'yxona, san'atkor va tasvirchilarni eng arzon va sifatli kombinatsiyada avtomat yig'ish.",
    },
    {
      icon: '🛡️',
      title: 'Double-Booking & Shartnoma Kafolati',
      desc: "Sana to'qnashuvlaridan 100% yuridik himoya va to'yxonalardan maxsus 15% gacha yopiq chegirmalar.",
    },
    {
      icon: '💬',
      title: '24/7 Shaxsiy To‘y Konsyerji',
      desc: "To'y o'tguniga qadar barcha tashkiliy savollarda shaxsiy professional koordinator.",
    },
    {
      icon: '🚫',
      title: '100% Reklamasiz & Oltin Toj Belgisi',
      desc: "Profilingiz va barcha taklifnomalaringizda TuyBor Royal status belgisi.",
    },
  ];

  const handlePurchase = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const chosenPlan = plans.find((p) => p.id === selectedPlanId);
    if (!chosenPlan) return;

    setLoading(true);

    // Google Play In-App Billing Flow Simulation
    setTimeout(() => {
      setLoading(false);
      setPurchased(true);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      Alert.alert(
        "👑 TuyBor Royal VIP Faollashtirildi!",
        `Google Play orqali xaridingiz muvaffaqiyatli amalga oshirildi (${chosenPlan.name} - ${chosenPlan.priceUsd}). Barcha VIP imtiyozlar va AI optimizator endi ochiq!`,
        [
          {
            text: "Ajoyib!",
            onPress: () => {
              if (onSuccessPurchase) onSuccessPurchase();
              onBack();
            },
          },
        ]
      );
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Floating Back Button */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={onBack} style={styles.closeBtn} activeOpacity={0.7}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.vipTagPill}>
            <Text style={styles.vipTagText}>👑 GOOGLE PLAY VERIFIED</Text>
          </View>
        </View>

        {/* Hero Crown Branding */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#FFF9E5', '#FDE074', '#F5C232', '#D49B1E', '#8A5506']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.crownCircle}
          >
            <Text style={styles.crownEmoji}>👑</Text>
          </LinearGradient>

          <Text style={styles.heroTitle}>TUYBOR ROYAL VIP</Text>
          <Text style={styles.heroSubtitle}>
            To'yingizni xatolarsiz, 10–25 mln so'mgacha tejab va qirollardek o'tkazish uchun shaxsiy imtiyozlar
          </Text>
        </View>

        {/* Feature Cards List */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionHeader}>👑 VIP Imtiyozlar To'plami:</Text>
          {features.map((feat, idx) => (
            <View key={idx} style={styles.featureCard}>
              <View style={styles.featureIconBox}>
                <Text style={styles.featureIcon}>{feat.icon}</Text>
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing Plans Selector */}
        <View style={styles.plansContainer}>
          <Text style={styles.sectionHeader}>💳 Tarifni Tanlang:</Text>

          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardActive,
                  plan.popular && styles.planCardPopularBorder,
                ]}
                onPress={() => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {}
                  setSelectedPlanId(plan.id);
                }}
                activeOpacity={0.85}
              >
                {plan.badge && (
                  <View style={[styles.planBadge, isSelected ? styles.planBadgeActive : null]}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}

                <View style={styles.planMainRow}>
                  <View style={styles.radioBox}>
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </View>

                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDuration}>{plan.duration}</Text>
                  </View>

                  <View style={styles.planPriceBox}>
                    <Text style={styles.planPriceUsd}>{plan.priceUsd}</Text>
                    <Text style={styles.planPriceUzs}>{plan.priceUzsApprox}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Google Play Purchase Button */}
        <View style={styles.ctaWrapper}>
          <TouchableOpacity
            style={styles.payBtn}
            onPress={handlePurchase}
            disabled={loading}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#FFF9E5', '#FDE074', '#F5C232', '#D49B1E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.payGradient}
            >
              {loading ? (
                <ActivityIndicator color="#4E2C00" size="small" />
              ) : (
                <>
                  <Text style={styles.googlePayLogo}>GPay</Text>
                  <Text style={styles.payBtnText}>
                    Google Play Orqali Faollashtirish ({plans.find((p) => p.id === selectedPlanId)?.priceUsd})
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Trust and Policy Footer */}
          <View style={styles.policyRow}>
            <Text style={styles.policyText}>
              🔒 100% xavfsiz Google Play to'lov tizimi. Istalgan vaqtda Google Play hisobingiz sozlamalaridan bekor qilish mumkin.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 28,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  closeIcon: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4E2C00',
  },
  vipTagPill: {
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.4)',
  },
  vipTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A5506',
    letterSpacing: 0.8,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  crownCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
    marginBottom: 12,
  },
  crownEmoji: {
    fontSize: 42,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#110A03',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#6B5A4B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4E2C00',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  featuresContainer: {
    marginTop: 10,
    marginBottom: 18,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF9E5',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureIcon: {
    fontSize: 22,
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#110A03',
  },
  featureDesc: {
    fontSize: 11.5,
    color: '#7C6B5C',
    marginTop: 2,
    lineHeight: 16,
  },
  plansContainer: {
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E8E3DD',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  planCardPopularBorder: {
    borderColor: 'rgba(229, 169, 18, 0.5)',
  },
  planCardActive: {
    borderColor: '#E5A912',
    backgroundColor: '#FFFDF5',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#8A5506',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeActive: {
    backgroundColor: '#E5A912',
  },
  planBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioBox: {
    marginRight: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4C8B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#E5A912',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5A912',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#110A03',
  },
  planDuration: {
    fontSize: 11,
    color: '#7C6B5C',
    marginTop: 2,
  },
  planPriceBox: {
    alignItems: 'flex-end',
  },
  planPriceUsd: {
    fontSize: 17,
    fontWeight: '900',
    color: '#8A5506',
  },
  planPriceUzs: {
    fontSize: 10,
    color: '#9E8D7E',
    marginTop: 2,
  },
  ctaWrapper: {
    marginTop: 6,
  },
  payBtn: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  payGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  googlePayLogo: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4E2C00',
    marginRight: 8,
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  payBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4E2C00',
    textAlign: 'center',
  },
  policyRow: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  policyText: {
    fontSize: 10.5,
    color: '#8E7E70',
    textAlign: 'center',
    lineHeight: 15,
  },
});
