import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import { BadgeVerified, LuxuryRating } from '../components/common/BadgeVerified';
import { InteractiveBookingCalendar } from '../components/calendar/InteractiveBookingCalendar';
import { LuxuryCard } from '../components/common/LuxuryCard';

interface ServiceDetailScreenProps {
  serviceId: number;
  onBack: () => void;
}

export const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({ serviceId, onBack }) => {
  const [selectedPkg, setSelectedPkg] = useState(0);

  const service = {
    id: 1,
    title: 'Versal Grand Ballroom (500 kishi)',
    category: "To'yxonalar va Restoranlar",
    businessName: 'Versal Grand Palace',
    address: "Toshkent sh., Yakkasaroy tumani, Shota Rustaveli 45",
    description: "Toshkent markazidagi eng hashamatli to'yxonalardan biri. Kristal qandillar, eng so'nggi rusumdagi panoramali akustika, professional to'y yoritgichlari va 500 nafargacha mehmonni bag'riga sig'diruvchi viqorli zal.",
    rating: 4.95,
    reviewsCount: 184,
    basePrice: 45000000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200',
    ],
    packages: [
      { name: "Standart Paket", price: 45000000, desc: "Zal ijarasi + bazaviy akustika va chiroq" },
      { name: "VIP Oltin Paket", price: 65000000, desc: "To'liq LED ekranlar + VIP to'y dasturxoni + xizmat" },
    ]
  };

  const handleBookConfirm = (date: string, timeSlot: string) => {
    Alert.alert(
      "Muvaffaqiyatli!",
      `Bron so'rovingiz ${date} (${timeSlot === 'day_osh' ? 'Osh' : 'Bazm'}) kuni uchun yuborildi. Click/Payme orqali avans to'lash sahifasi ochilmoqda...`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: service.images[0] }} style={styles.heroImage} />
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <Text style={styles.categoryText}>{service.category}</Text>
                <BadgeVerified />
              </View>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.address}>📍 {service.address}</Text>
            </View>
          </View>

          <View style={styles.ratingBar}>
            <LuxuryRating rating={service.rating} count={service.reviewsCount} />
            <Text style={styles.ratingHighlight}>⭐ 99% ijobiy fikrlar</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Qo'ng'iroq</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={styles.actionText}>Xarita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>↗️</Text>
              <Text style={styles.actionText}>Ulashish</Text>
            </TouchableOpacity>
          </View>

          {/* Tavsif */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Xizmat haqida</Text>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>

          {/* Paketlar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tariflar va Paketlar</Text>
            <View style={styles.packagesList}>
              {service.packages.map((pkg, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedPkg(idx)}
                  style={[styles.pkgCard, selectedPkg === idx && styles.pkgCardActive]}
                >
                  <View style={styles.pkgHeader}>
                    <Text style={[styles.pkgName, selectedPkg === idx && styles.pkgNameActive]}>{pkg.name}</Text>
                    <Text style={styles.pkgPrice}>{pkg.price.toLocaleString()} so'm</Text>
                  </View>
                  <Text style={styles.pkgDesc}>{pkg.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Jonli Kalendar va Bronlash */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Jonli Kalendar & Bronlash</Text>
            <Text style={styles.sectionSubtitle}>Xizmatning bo'sh kunini tanlang va bir zumda bron qiling</Text>
            <InteractiveBookingCalendar
              serviceTitle={service.title}
              basePrice={service.packages[selectedPkg].price}
              onBookConfirm={handleBookConfirm}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  imageWrapper: {
    position: 'relative',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  titleRow: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#4B5563',
  },
  ratingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    marginVertical: 12,
  },
  ratingHighlight: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  actionText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  packagesList: {
    gap: 10,
  },
  pkgCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  pkgCardActive: {
    borderColor: COLORS.gold[500],
    backgroundColor: COLORS.gold[50],
  },
  pkgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pkgName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  pkgNameActive: {
    color: COLORS.gold[700],
  },
  pkgPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  pkgDesc: {
    fontSize: 12,
    color: '#6B7280',
  }
});
