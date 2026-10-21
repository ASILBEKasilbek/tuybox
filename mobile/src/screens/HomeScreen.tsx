import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { COLORS } from '../theme/colors';
import { CategoryPillBar } from '../components/common/CategoryPillBar';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { BadgeVerified, LuxuryRating } from '../components/common/BadgeVerified';
import { BudgetPlannerWidget } from '../components/budget/BudgetPlannerWidget';

interface HomeScreenProps {
  onSelectService: (serviceId: number) => void;
  onOpenBudget: () => void;
  onOpenPremium?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectService, onOpenBudget, onOpenPremium }) => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([1]);

  const categories = [
    { id: 'all', name: 'Barchasi', icon: '✨' },
    { id: 'venues', name: "To'yxonalar", icon: '🏰' },
    { id: 'music', name: "San'atkorlar", icon: '🎤' },
    { id: 'photo', name: 'Foto & Video', icon: '📸' },
    { id: 'decor', name: 'Dekoratsiya', icon: '💐' },
    { id: 'auto', name: 'Kortej', icon: '🚘' },
  ];

  const stories = [
    { name: 'Sardor & Madina', icon: '👑', status: 'Yangi To\'y' },
    { name: 'Bobur & Dildora', icon: '💍', status: 'Versal' },
    { name: 'Javohir & Shahzoda', icon: '✨', status: 'Oqsaroy' },
    { name: 'Sherzod & Kamola', icon: '💎', status: 'Prezident' },
  ];

  const allServices = [
    {
      id: 1,
      catId: 'venues',
      title: 'Versal Grand Ballroom (500 kishi)',
      category: "To'yxona",
      price: 45000000,
      city: 'Toshkent, Yakkasaroy',
      rating: 4.95,
      reviewsCount: 184,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800',
      distanceKm: 2.4,
      badgeText: "VIP SARALANGAN",
    },
    {
      id: 2,
      catId: 'venues',
      title: 'Oqsaroy Palace & Crystal Hall (600 kishi)',
      category: "To'yxona",
      price: 55000000,
      city: 'Toshkent, Mirobod',
      rating: 4.98,
      reviewsCount: 210,
      image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=800',
      distanceKm: 3.8,
      badgeText: "QIROLLIK SAROYI",
    },
    {
      id: 3,
      catId: 'music',
      title: "Jonli Ijro Ansambli & Xonandalar",
      category: "San'atkor",
      price: 15000000,
      city: 'Toshkent',
      rating: 4.90,
      reviewsCount: 92,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
      distanceKm: 4.1,
      badgeText: "ENG KO'P BUYURTMA",
    },
    {
      id: 4,
      catId: 'music',
      title: "Shahzod Vokal Guruhi & DJ Live Show",
      category: "San'atkor",
      price: 12000000,
      city: 'Toshkent & Samarqand',
      rating: 4.88,
      reviewsCount: 65,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800',
      distanceKm: 1.5,
      badgeText: "MODERN SHOW",
    },
    {
      id: 5,
      catId: 'photo',
      title: "Gold Premium Foto & Video Studiya",
      category: "Foto & Video",
      price: 12000000,
      city: 'Toshkent & Viloyatlar',
      rating: 4.98,
      reviewsCount: 140,
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800',
      distanceKm: 1.8,
      badgeText: "DRON & LOVE STORY",
    },
    {
      id: 6,
      catId: 'photo',
      title: "Royal Cinematography 4K & Dron Studio",
      category: "Foto & Video",
      price: 18000000,
      city: 'Toshkent',
      rating: 4.96,
      reviewsCount: 112,
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800',
      distanceKm: 2.9,
      badgeText: "HOLLYWOOD SIFAT",
    },
    {
      id: 7,
      catId: 'decor',
      title: "Zardo'zi & Gullar Arkasi (Palace Decor)",
      category: "Dekoratsiya",
      price: 9000000,
      city: 'Toshkent',
      rating: 4.92,
      reviewsCount: 78,
      image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=800',
      distanceKm: 3.2,
      badgeText: "TABIIY GULLAR",
    },
    {
      id: 8,
      catId: 'auto',
      title: "Mercedes-Maybach S-Class Oq Kortej",
      category: "Kortej",
      price: 6500000,
      city: 'Toshkent shahar',
      rating: 4.99,
      reviewsCount: 95,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800',
      distanceKm: 2.1,
      badgeText: "VIP KORTEJ",
    }
  ];

  const filteredServices = allServices.filter((item) => {
    const matchesCat = selectedCat === 'all' || item.catId === selectedCat;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🏛️ Regal Top Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>👑</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>TUY</Text>
              <Text style={styles.brandTitleGold}>BOR</Text>
            </View>
            <Text style={styles.brandSubtitle}>To'y & Tantana Ekotizimi</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.vipBadgeBtn} onPress={onOpenPremium} activeOpacity={0.8}>
            <Text style={styles.vipBadgeText}>👑 VIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.citySelector}>
            <Text style={styles.cityText}>📍 Toshkent ▾</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 💍 Wedding Countdown Widget */}
      <View style={styles.countdownCard}>
        <View style={styles.countdownHeader}>
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownBadgeText}>💍 TO'Y REJASI</Text>
          </View>
          <Text style={styles.countdownDaysText}>24 kun qoldi</Text>
        </View>
        <Text style={styles.countdownTitle}>Asilbek & Madina Nikoh Oqshomi</Text>
        <Text style={styles.countdownDate}>📅 15-Noyabr, 2026 • Versal Grand Ballroom</Text>

        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBarFill, { width: '75%' }]} />
        </View>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Tayyorgarlik 75% yakunlandi</Text>
          <TouchableOpacity onPress={onOpenBudget}>
            <Text style={styles.progressActionLink}>Byudjet nazorati →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔍 Luxury Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="San'atkor, to'yxona yoki kortej qidirish..."
            placeholderTextColor="#8E7B6B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 6 }}>
              <Text style={{ fontSize: 13, color: '#8E7B6B' }}>✕</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterBtnIcon}>⚡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 👑 VIP 24K Gold Banner */}
      <TouchableOpacity 
        style={styles.promoBanner}
        activeOpacity={0.9}
        onPress={onOpenPremium || onOpenBudget}
      >
        <View style={styles.promoContent}>
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>👑 TUYBOR ROYAL VIP</Text>
          </View>
          <Text style={styles.promoTitle}>Google Play VIP Pass • 20% Chegirma</Text>
          <Text style={styles.promoSubtitle}>
            AI Byudjet optimizatori, cheksiz taklifnomalar va shaxsiy to'y konsyerji
          </Text>
          <View style={styles.promoCtaRow}>
            <Text style={styles.promoCtaText}>VIP Imtiyozlarni ko'rish →</Text>
          </View>
        </View>
        <Text style={styles.promoDecorIcon}>👑</Text>
      </TouchableOpacity>

      {/* 💍 Stories / Real Weddings Carousel */}
      <View style={styles.storiesContainer}>
        {stories.map((story, i) => (
          <View key={i} style={styles.storyItem}>
            <View style={styles.storyRing}>
              <View style={styles.storyAvatar}>
                <Text style={styles.storyAvatarText}>{story.icon}</Text>
              </View>
            </View>
            <Text style={styles.storyText} numberOfLines={1}>{story.name}</Text>
            <Text style={styles.storySubText}>{story.status}</Text>
          </View>
        ))}
      </View>

      {/* Categories Bar */}
      <CategoryPillBar
        categories={categories}
        selectedId={selectedCat}
        onSelect={setSelectedCat}
      />

      {/* AI Budget Widget Banner */}
      <View style={styles.widgetWrapper}>
        <BudgetPlannerWidget />
      </View>

      {/* Featured Luxury Services with Live Filter */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            {selectedCat === 'all'
              ? '👑 VIP & Eng Sara Xizmatlar'
              : `👑 ${categories.find((c) => c.id === selectedCat)?.name || 'Xizmatlar'}`}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredServices.length} ta tasdiqlangan rasmiy xizmat topildi
          </Text>
        </View>
        {selectedCat !== 'all' && (
          <TouchableOpacity onPress={() => setSelectedCat('all')}>
            <Text style={styles.seeAllText}>Barchasini ko'rish</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardsList}>
        {filteredServices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Hech narsa topilmadi</Text>
            <Text style={styles.emptySubtitle}>Boshqa qidiruv so'zi kiritib ko'ring yoki toifalarni almashtiring.</Text>
          </View>
        ) : (
          filteredServices.map((service) => {
            const isFav = favorites.includes(service.id);
            return (
              <TouchableOpacity
                key={service.id}
                onPress={() => onSelectService(service.id)}
                activeOpacity={0.92}
              >
                <LuxuryCard style={styles.serviceCard}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: service.image }} style={styles.cardImage} />
                    <View style={styles.imageOverlayBadge}>
                      <Text style={styles.imageOverlayBadgeText}>{service.badgeText}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.favBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(service.id);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.tagRow}>
                      <Text style={styles.categoryBadge}>{service.category}</Text>
                      <BadgeVerified />
                    </View>

                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    
                    <View style={styles.metaRow}>
                      <LuxuryRating rating={service.rating} count={service.reviewsCount} />
                      <Text style={styles.distanceText}>📍 {service.city}</Text>
                    </View>

                    <View style={styles.priceRow}>
                      <View>
                        <Text style={styles.priceLabel}>Rasmiy narxi:</Text>
                        <Text style={styles.priceValue}>{service.price.toLocaleString()} so'm</Text>
                      </View>
                      <View style={styles.viewBtn}>
                        <Text style={styles.viewBtnText}>Band Qilish →</Text>
                      </View>
                    </View>
                  </View>
                </LuxuryCard>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 169, 18, 0.2)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF9E5',
    borderWidth: 1.5,
    borderColor: '#E5A912',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  logoIcon: {
    fontSize: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#110A03',
    letterSpacing: 1.5,
  },
  brandTitleGold: {
    fontSize: 22,
    fontWeight: '900',
    color: '#E5A912',
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 10.5,
    color: '#8A5506',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vipBadgeBtn: {
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5A912',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  vipBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8A5506',
    letterSpacing: 0.5,
  },
  citySelector: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.3)',
  },
  cityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4E2C00',
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifIcon: {
    fontSize: 15,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  countdownCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    backgroundColor: '#1E140A',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5A912',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  countdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countdownBadge: {
    backgroundColor: 'rgba(229, 169, 18, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5A912',
  },
  countdownBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#F5C538',
    letterSpacing: 0.8,
  },
  countdownDaysText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FBF8F2',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countdownTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  countdownDate: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarWrapper: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E5A912',
    borderRadius: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    color: '#E0D0BE',
    fontWeight: '600',
  },
  progressActionLink: {
    fontSize: 11.5,
    color: '#F5C538',
    fontWeight: '800',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.35)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#110A03',
    fontWeight: '500',
  },
  filterBtn: {
    backgroundColor: '#FFF9E5',
    borderWidth: 1,
    borderColor: '#E5A912',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  filterBtnIcon: {
    fontSize: 13,
  },
  promoBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#1E140A',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E5A912',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  promoContent: {
    flex: 1,
    paddingRight: 10,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5A912',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  promoBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#110A03',
    letterSpacing: 0.8,
  },
  promoTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#D8C7B8',
    lineHeight: 16,
    marginBottom: 8,
  },
  promoCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoCtaText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#F5C538',
  },
  promoDecorIcon: {
    fontSize: 40,
    opacity: 0.9,
  },
  storiesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    width: 76,
  },
  storyRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#E5A912',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: '#FFF9E5',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  storyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatarText: {
    fontSize: 22,
  },
  storyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#110A03',
    textAlign: 'center',
  },
  storySubText: {
    fontSize: 9.5,
    color: '#8A5506',
    fontWeight: '600',
  },
  widgetWrapper: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#110A03',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#7C6B5C',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A5506',
  },
  cardsList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.35)',
    overflow: 'hidden',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
  },
  imageWrapper: {
    position: 'relative',
    height: 190,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(26, 16, 6, 0.82)',
    borderWidth: 1,
    borderColor: '#E5A912',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  imageOverlayBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F5C538',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#FFF9E5',
    color: '#8A5506',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.4)',
  },
  serviceTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#110A03',
    lineHeight: 22,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  distanceText: {
    fontSize: 12,
    color: '#7C6B5C',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 169, 18, 0.18)',
  },
  priceLabel: {
    fontSize: 11,
    color: '#8E7B6B',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#110A03',
  },
  viewBtn: {
    backgroundColor: '#FFF9E5',
    borderWidth: 1.5,
    borderColor: '#E5A912',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  viewBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#4E2C00',
  },
  favBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  favIcon: {
    fontSize: 16,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
    marginVertical: 10,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#110A03',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#7C6B5C',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 80,
  }
});
