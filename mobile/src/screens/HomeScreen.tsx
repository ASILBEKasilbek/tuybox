import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../theme/colors';
import { CategoryPillBar } from '../components/common/CategoryPillBar';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { BadgeVerified, LuxuryRating } from '../components/common/BadgeVerified';
import { BudgetPlannerWidget } from '../components/budget/BudgetPlannerWidget';

interface HomeScreenProps {
  onSelectService: (serviceId: number) => void;
  onOpenBudget: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectService, onOpenBudget }) => {
  const [selectedCat, setSelectedCat] = useState('all');

  const categories = [
    { id: 'all', name: 'Barchasi', icon: '✨' },
    { id: 'venues', name: "To'yxonalar", icon: '🏰' },
    { id: 'music', name: "San'atkorlar", icon: '🎤' },
    { id: 'photo', name: 'Foto & Video', icon: '📸' },
    { id: 'decor', name: 'Dekoratsiya', icon: '💐' },
    { id: 'auto', name: 'Kortej', icon: '🚘' },
  ];

  const featuredServices = [
    {
      id: 1,
      title: 'Versal Grand Ballroom (500 kishi)',
      category: "To'yxona",
      price: 45000000,
      city: 'Toshkent, Yakkasaroy',
      rating: 4.95,
      reviewsCount: 184,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800',
      distanceKm: 2.4,
    },
    {
      id: 2,
      title: "Jonli Ijro Ansambli va Xonandalar Guruhi",
      category: "San'atkor",
      price: 15000000,
      city: 'Toshkent',
      rating: 4.90,
      reviewsCount: 92,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
      distanceKm: 4.1,
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeLabel}>Xush kelibsiz 👋</Text>
          <Text style={styles.appTitle}>Tuyxona Platform</Text>
        </View>
        <TouchableOpacity style={styles.citySelector}>
          <Text style={styles.cityText}>📍 Toshkent ▾</Text>
        </TouchableOpacity>
      </View>

      {/* Stories / Real Weddings Carousel */}
      <View style={styles.storiesContainer}>
        {['Sardor & Madina', 'Bobur & Dildora', 'Javohir & Shahzoda', 'Sherzod & Kamola'].map((story, i) => (
          <View key={i} style={styles.storyItem}>
            <View style={styles.storyRing}>
              <View style={styles.storyAvatar}>
                <Text style={styles.storyAvatarText}>💍</Text>
              </View>
            </View>
            <Text style={styles.storyText} numberOfLines={1}>{story}</Text>
          </View>
        ))}
      </View>

      {/* Categories */}
      <CategoryPillBar
        categories={categories}
        selectedId={selectedCat}
        onSelect={setSelectedCat}
      />

      {/* AI Budget Widget Banner */}
      <View style={styles.widgetWrapper}>
        <BudgetPlannerWidget />
      </View>

      {/* Featured Luxury Services */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>👑 VIP & Eng Sara Xizmatlar</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Barchasi →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsList}>
        {featuredServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            onPress={() => onSelectService(service.id)}
            activeOpacity={0.9}
          >
            <LuxuryCard style={styles.serviceCard}>
              <Image source={{ uri: service.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.tagRow}>
                  <Text style={styles.categoryBadge}>{service.category}</Text>
                  <BadgeVerified />
                </View>

                <Text style={styles.serviceTitle}>{service.title}</Text>
                
                <View style={styles.metaRow}>
                  <LuxuryRating rating={service.rating} count={service.reviewsCount} />
                  <Text style={styles.distanceText}>• {service.distanceKm} km yaqin</Text>
                </View>

                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceLabel}>Boshlang'ich narxi:</Text>
                    <Text style={styles.priceValue}>{service.price.toLocaleString()} so'm</Text>
                  </View>
                  <View style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>Tafsilotlar</Text>
                  </View>
                </View>
              </View>
            </LuxuryCard>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
  },
  welcomeLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  citySelector: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  storiesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
  },
  storyRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D4AF37', // Oltin nishonli aylana
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatarText: {
    fontSize: 22,
  },
  storyText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  widgetWrapper: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.gold[700],
    fontWeight: '700',
  },
  cardsList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  serviceCard: {
    padding: 0,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  distanceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  priceLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  viewBtn: {
    backgroundColor: COLORS.obsidian[900],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewBtnText: {
    color: COLORS.gold[300],
    fontSize: 12,
    fontWeight: '700',
  }
});
