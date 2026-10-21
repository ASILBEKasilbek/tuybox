import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { BadgeVerified, LuxuryRating } from '../components/common/BadgeVerified';
import { InteractiveBookingCalendar } from '../components/calendar/InteractiveBookingCalendar';

interface ServiceDetailScreenProps {
  serviceId: number;
  onBack: () => void;
}

interface ServiceData {
  id: number;
  title: string;
  category: string;
  businessName: string;
  address: string;
  description: string;
  rating: number;
  reviewsCount: number;
  basePrice: number;
  images: string[];
  features: string[];
  packages: {
    name: string;
    price: number;
    desc: string;
    perks: string[];
  }[];
  reviews: {
    author: string;
    date: string;
    rating: number;
    comment: string;
  }[];
}

const SERVICES_DATABASE: Record<number, ServiceData> = {
  1: {
    id: 1,
    title: 'Versal Grand Ballroom (500 kishi)',
    category: "To'yxonalar & Saroylar",
    businessName: 'Versal Grand Palace LLC',
    address: "Toshkent sh., Yakkasaroy tumani, Shota Rustaveli 45",
    description: "Toshkent markazidagi eng hashamatli to'yxonalardan biri. Kristal qandillar, eng so'nggi rusumdagi panoramali akustika, professional to'y yoritgichlari va 500 nafargacha mehmonni bag'riga sig'diruvchi viqorli zal.",
    rating: 4.95,
    reviewsCount: 184,
    basePrice: 45000000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200',
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=1200',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200',
    ],
    features: [
      '500 kishilik zal sig\'imi',
      'L-Acoustics konsert darajasidagi akustika',
      '200 kv.m ultra-HD LED ekranlar',
      '200 ta avtomobil uchun VIP avtoturargoh',
      'Kelinsalom va alohida kelin-kuyov xonalari',
    ],
    packages: [
      {
        name: "Standart Oqshom",
        price: 45000000,
        desc: "Zal ijarasi + bazaviy akustika va chiroq effektlari",
        perks: ['Zal ijarasi (6 soat)', 'Standart akustika', 'Garderob va qo\'riqlash'],
      },
      {
        name: "VIP Oltin Qirollik",
        price: 65000000,
        desc: "To'liq LED ekranlar + VIP to'y dasturxoni bezagi + og'ir tutun",
        perks: ['200 kv.m LED ekranlar', 'Og\'ir tutun va salyut', 'VIP xizmat ko\'rsatish guruhi', 'Kelin-kuyov suit xonasi'],
      },
      {
        name: "Sulton Imperial VIP",
        price: 85000000,
        desc: "Eksklyuziv zardo'zi dekor, shaxsiy konsyerj va jonli orkestr zali",
        perks: ['Eksklyuziv gulli dekoratsiya', 'Shaxsiy to\'y menejeri', 'Prezident kortej kutib olishi', 'Cheksiz fotosessiya zonasi'],
      },
    ],
    reviews: [
      {
        author: 'Sardor & Dilnoza',
        date: '12-Oktabr, 2026',
        rating: 5,
        comment: 'To\'yimiz ertakdagidek o\'tdi! Akustika va xizmat ko\'rsatish a\'lo darajada. Mehmonlarimiz hayratda qolishdi.',
      },
      {
        author: 'Bobur Mirzayev',
        date: '28-Sentabr, 2026',
        rating: 5,
        comment: 'TuyBor orqali 10% avans to\'lab bir kunda band qildik. Shartnoma rasmiy va ishonchli tuzildi. Rahmat!',
      },
    ],
  },
  2: {
    id: 2,
    title: 'Oqsaroy Palace & Crystal Hall (600 kishi)',
    category: "To'yxonalar & Saroylar",
    businessName: 'Oqsaroy Palace Group',
    address: "Toshkent sh., Mirobod tumani, Nukus ko'chasi 18",
    description: "Keng ko'lamli hashamat, baland shiftlar va Oq Carrara marmaridan ishlangan poyondozlar. 600 nafargacha mehmon uchun poytaxtning eng nufuzli saroylaridan biri.",
    rating: 4.98,
    reviewsCount: 210,
    basePrice: 55000000,
    images: [
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=1200',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200',
    ],
    features: [
      '600 kishilik asosiy zal',
      'Fransuz billur qandillari',
      'Maxsus lazer shou texnikasi',
      'Valet-parking xizmati',
    ],
    packages: [
      {
        name: "Klassik Bazm",
        price: 55000000,
        desc: "Keng qamrovli zal ijarasi va professional ovoz",
        perks: ['Asosiy zal ijarasi', 'Professional DJ pulti', 'Qo\'riqlash xizmati'],
      },
      {
        name: "Royal Crystal VIP",
        price: 75000000,
        desc: "Marmar poyondoz bezagi, to'liq yoritish va shaxsiy oshpazlar",
        perks: ['Kristal qandil yoritish shousi', 'VIP mehmonlar kutib olish', 'To\'liq dekoratsiya'],
      },
    ],
    reviews: [
      {
        author: 'Jahongir & Malika',
        date: '5-Oktabr, 2026',
        rating: 5,
        comment: 'Oqsaroy o\'z nomiga munosib! Hamma narsa eng oliy darajada tashkillashtirildi.',
      },
    ],
  },
  3: {
    id: 3,
    title: "Jonli Ijro Ansambli & Xonandalar",
    category: "San'atkor & Musiqa",
    businessName: 'TuyBor Music Records',
    address: "Toshkent sh., Shayxontohur",
    description: "O'zbekistonning eng sara xalqaro va milliy to'y qo'shiqlarini jonli ijro etuvchi ansambl. Zamonaviy xitlar, milliy mumtoz va to'y vals musiqalari to'liq jonli orkestr jo'rligida.",
    rating: 4.90,
    reviewsCount: 92,
    basePrice: 15000000,
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
    ],
    features: [
      '6 kishilik professional jonli ansambl',
      'Kelin-kuyov birinchi raqsi uchun maxsus qo\'shiq',
      'To\'liq ovoz uskunasi va mikrofonlar',
      'Karnay-surnay guruhi bilan hamohang ijro',
    ],
    packages: [
      {
        name: "Kechki To'y Blok",
        price: 15000000,
        desc: "3 soatlik jonli musiqiy blok + DJ hamrohligi",
        perks: ['3 soat jonli ijro', 'Sevimlilaringiz ro\'yxati', 'Kelin-kuyov valsi'],
      },
      {
        name: "Butun Oqshom VIP",
        price: 22000000,
        desc: "Boshidan oxirigacha jonli ansambl va taniqli yakkaxon xonandalar",
        perks: ['To\'liq 5 soatlik dastur', '2 nafar yakkaxon san\'atkor', 'Interaktiv mehmonlar shousi'],
      },
    ],
    reviews: [
      {
        author: 'Sherzod Aliyev',
        date: '20-Sentabr, 2026',
        rating: 5,
        comment: 'Jonli ovoz haqiqatan hayratlanarli darajada toza yangradi. Rahmat jamoaga!',
      },
    ],
  },
};

export const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({ serviceId, onBack }) => {
  const service = SERVICES_DATABASE[serviceId] || SERVICES_DATABASE[1];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(0);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('15-Noyabr, 2026');
  const [selectedSlot, setSelectedSlot] = useState('Kechki Bazm (18:00 - 23:00)');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const currentPkg = service.packages[selectedPkg] || service.packages[0];
  const advanceDeposit = Math.round(currentPkg.price * 0.10);

  const handleCalendarSelect = (date: string, timeSlot: string) => {
    setSelectedDate(date);
    setSelectedSlot(timeSlot === 'day_osh' ? 'Ertalabki Osh (07:00 - 13:00)' : 'Kechki Bazm (18:00 - 23:00)');
    setBookingModalVisible(true);
  };

  const executeAdvancePayment = (provider: 'Click' | 'Payme' | 'Uzum') => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setBookingModalVisible(false);
      Alert.alert(
        "🎉 10% Avans To'landi!",
        `Tabriklaymiz! ${provider} orqali ${advanceDeposit.toLocaleString()} so'm miqdorida avans to'lovi muvaffaqiyatli qabul qilindi.\n\nSana: ${selectedDate}\nTadbir: ${selectedSlot}\nXizmat: ${service.title}\n\nTuyBor xavfsiz depoziti orqali rasmiy elektron chek va shartnoma profilingizga biriktirildi.`
      );
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 📸 Multi-Image Carousel Header */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: service.images[activeImageIdx] || service.images[0] }}
            style={styles.heroImage}
          />
          <View style={styles.imageGradientOverlay} />

          {/* Back Button */}
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Photo Counter */}
          <View style={styles.photoCounterBadge}>
            <Text style={styles.photoCounterText}>
              📷 {activeImageIdx + 1} / {service.images.length}
            </Text>
          </View>

          {/* Thumbnail Selector Dots */}
          {service.images.length > 1 && (
            <View style={styles.thumbnailDotsRow}>
              {service.images.map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveImageIdx(idx)}
                  style={[
                    styles.thumbnailDot,
                    activeImageIdx === idx && styles.thumbnailDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* 🏛️ Main Content Card */}
        <View style={styles.content}>
          {/* Header Row */}
          <View style={styles.titleSection}>
            <View style={styles.badgeRow}>
              <Text style={styles.categoryBadge}>{service.category}</Text>
              <BadgeVerified />
              <View style={styles.ratingPill}>
                <Text style={styles.ratingPillText}>★ {service.rating}</Text>
              </View>
            </View>

            <Text style={styles.title}>{service.title}</Text>
            <Text style={styles.address}>📍 {service.address}</Text>
          </View>

          {/* 🔒 100% Escrow & Safety Guarantee Card */}
          <View style={styles.escrowCard}>
            <View style={styles.escrowHeader}>
              <Text style={styles.escrowIcon}>🔒</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.escrowTitle}>TuyBor Xavfsiz Depozit Kafolati</Text>
                <Text style={styles.escrowSubtitle}>
                  10% avans to'lovi tadbir muvaffaqiyatli o'tgunga qadar TuyBor hisobida xavfsiz saqlanadi. Rasmiy elektron shartnoma taqdim etiladi.
                </Text>
              </View>
            </View>
            <View style={styles.escrowBadgesRow}>
              <Text style={styles.escrowBadgeItem}>⚡ 0% Komissiya</Text>
              <Text style={styles.escrowBadgeItem}>📜 Rasmiy Shartnoma</Text>
              <Text style={styles.escrowBadgeItem}>🛡️ 100% Qaytarish Kafolati</Text>
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert("Qo'ng'iroq", `${service.businessName} rasmiy qo'ng'iroq markazi: +998 71 200 45 45`)}
            >
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Qo'ng'iroq</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert("Shaxsiy Chat", "To'y menejeri bilan bevosita muzokara boshlandi.")}
            >
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Menejer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert("Lokatsiya", `${service.address}\nYandex Xaritada yo'nalish ochilmoqda...`)}
            >
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={styles.actionText}>Lokatsiya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert("Ulashish", `${service.title} taklif havolasi nusxalandi!`)}
            >
              <Text style={styles.actionIcon}>↗️</Text>
              <Text style={styles.actionText}>Ulashish</Text>
            </TouchableOpacity>
          </View>

          {/* 💎 Afzalliklari & Xususiyatlari */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Xizmat Afzalliklari</Text>
            <View style={styles.featuresList}>
              {service.features.map((feat, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 📜 Tavsif */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tafsilotlar</Text>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>

          {/* 👑 Paketlar & Tariflar */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Tariflar & Paketlar</Text>
              <Text style={styles.sectionHint}>Kerakli paketni tanlang</Text>
            </View>

            <View style={styles.packagesList}>
              {service.packages.map((pkg, idx) => {
                const isActive = selectedPkg === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedPkg(idx)}
                    activeOpacity={0.9}
                    style={[styles.pkgCard, isActive && styles.pkgCardActive]}
                  >
                    <View style={styles.pkgHeader}>
                      <View>
                        <Text style={[styles.pkgName, isActive && styles.pkgNameActive]}>
                          {isActive ? '👑 ' : ''}{pkg.name}
                        </Text>
                        <Text style={styles.pkgDesc}>{pkg.desc}</Text>
                      </View>
                      <View style={styles.pkgPriceCol}>
                        <Text style={styles.pkgPrice}>{pkg.price.toLocaleString()} so'm</Text>
                        <Text style={styles.pkgDepositText}>10% Avans: {Math.round(pkg.price * 0.1).toLocaleString()} so'm</Text>
                      </View>
                    </View>

                    {/* Perks */}
                    <View style={styles.pkgPerksRow}>
                      {pkg.perks.map((perk, pIdx) => (
                        <View key={pIdx} style={styles.pkgPerkPill}>
                          <Text style={styles.pkgPerkText}>✦ {perk}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 📅 Jonli Kalendar & Bo'sh Kunlar */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>📅 Jonli Kalendar & Band Qilish</Text>
              <Text style={styles.sectionHint}>Yashil kunlar — bo'sh</Text>
            </View>
            <InteractiveBookingCalendar
              serviceTitle={service.title}
              basePrice={currentPkg.price}
              onBookConfirm={handleCalendarSelect}
            />
          </View>

          {/* ⭐ Fikrlar & Sharhlar */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Mehmonlar va Mijozlar Fikri</Text>
              <View style={styles.reviewsMeta}>
                <LuxuryRating rating={service.rating} count={service.reviewsCount} />
              </View>
            </View>

            {service.reviews.map((rev, idx) => (
              <View key={idx} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>👑</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewAuthor}>{rev.author}</Text>
                    <Text style={styles.reviewDate}>{rev.date}</Text>
                  </View>
                  <Text style={styles.reviewStars}>{'⭐'.repeat(rev.rating)}</Text>
                </View>
                <Text style={styles.reviewComment}>"{rev.comment}"</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 💳 Floating Sticky Bottom Bar for Direct Advance Booking */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.stickyPriceCol}>
          <Text style={styles.stickyPriceLabel}>10% KAFOLAT AVANSI:</Text>
          <Text style={styles.stickyPriceValue}>{advanceDeposit.toLocaleString()} so'm</Text>
          <Text style={styles.stickyPriceTotal}>Jami: {currentPkg.price.toLocaleString()} so'm</Text>
        </View>

        <TouchableOpacity
          style={styles.stickyBookBtn}
          onPress={() => setBookingModalVisible(true)}
          activeOpacity={0.88}
        >
          <Text style={styles.stickyBookBtnText}>Avans To'lash →</Text>
        </TouchableOpacity>
      </View>

      {/* 🏛️ Click / Payme / Uzum 10% Advance Deposit Modal */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.modalBadge}>
                  <Text style={styles.modalBadgeText}>🔒 RASMIY XAVFSIZ DEPOZIT</Text>
                </View>
                <Text style={styles.modalTitle}>10% Avans To'lovi</Text>
              </View>
              <TouchableOpacity
                onPress={() => setBookingModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Summary Box */}
            <View style={styles.modalSummaryBox}>
              <Text style={styles.modalServiceTitle}>{service.title}</Text>
              <Text style={styles.modalPkgName}>Tanlangan tarif: {currentPkg.name}</Text>
              
              <View style={styles.modalDivider} />

              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Sana & Vaqt:</Text>
                <Text style={styles.modalDetailVal}>{selectedDate} • {selectedSlot.split(' ')[0]}</Text>
              </View>

              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Paket narxi:</Text>
                <Text style={styles.modalDetailVal}>{currentPkg.price.toLocaleString()} so'm</Text>
              </View>

              <View style={[styles.modalDetailRow, { marginTop: 6 }]}>
                <Text style={styles.modalDepositLabel}>To'lanadigan 10% Avans:</Text>
                <Text style={styles.modalDepositVal}>{advanceDeposit.toLocaleString()} so'm</Text>
              </View>
            </View>

            {/* Payment Method Providers */}
            <Text style={styles.paymentMethodTitle}>To'lov tizimini tanlang (0% komissiya):</Text>
            
            <View style={styles.paymentButtonsCol}>
              <TouchableOpacity
                style={[styles.payProviderBtn, styles.clickBtn]}
                onPress={() => executeAdvancePayment('Click')}
                disabled={isProcessingPayment}
                activeOpacity={0.85}
              >
                <Text style={styles.payProviderName}>Click Up 🔵</Text>
                <Text style={styles.payProviderSub}>{advanceDeposit.toLocaleString()} so'm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.payProviderBtn, styles.paymeBtn]}
                onPress={() => executeAdvancePayment('Payme')}
                disabled={isProcessingPayment}
                activeOpacity={0.85}
              >
                <Text style={styles.payProviderName}>Payme 🟢</Text>
                <Text style={styles.payProviderSub}>{advanceDeposit.toLocaleString()} so'm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.payProviderBtn, styles.uzumBtn]}
                onPress={() => executeAdvancePayment('Uzum')}
                disabled={isProcessingPayment}
                activeOpacity={0.85}
              >
                <Text style={styles.payProviderName}>Uzum Bank 🟣</Text>
                <Text style={styles.payProviderSub}>{advanceDeposit.toLocaleString()} so'm</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSafetyFootnote}>
              🔒 Shartnoma avtomatik tarzda PDF shaklida rasmiylashtiriladi va to'lov TuyBor Escrow hisobida xavfsiz muzlatiladi.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageWrapper: {
    position: 'relative',
    height: 310,
    backgroundColor: '#1E140A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 10, 3, 0.28)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 36,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5A912',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#110A03',
  },
  photoCounterBadge: {
    position: 'absolute',
    bottom: 16,
    right: 18,
    backgroundColor: 'rgba(17, 10, 3, 0.8)',
    borderWidth: 1,
    borderColor: '#E5A912',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  photoCounterText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#F5C538',
  },
  thumbnailDotsRow: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  thumbnailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  thumbnailDotActive: {
    width: 22,
    backgroundColor: '#E5A912',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.35)',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  ratingPill: {
    backgroundColor: '#1E140A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5A912',
    marginLeft: 'auto',
  },
  ratingPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F5C538',
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: '#110A03',
    lineHeight: 27,
    marginBottom: 6,
  },
  address: {
    fontSize: 12.5,
    color: '#7C6B5C',
    fontWeight: '500',
  },
  escrowCard: {
    marginTop: 14,
    backgroundColor: '#1E140A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5A912',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  escrowHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  escrowIcon: {
    fontSize: 24,
  },
  escrowTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  escrowSubtitle: {
    fontSize: 11.5,
    color: '#D4AF37',
    lineHeight: 16,
  },
  escrowBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 169, 18, 0.25)',
  },
  escrowBadgeItem: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FBF8F2',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.3)',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 3,
  },
  actionText: {
    fontSize: 11,
    color: '#4E2C00',
    fontWeight: '700',
  },
  section: {
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#110A03',
  },
  sectionHint: {
    fontSize: 11.5,
    color: '#8A5506',
    fontWeight: '600',
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureCheck: {
    fontSize: 14,
    fontWeight: '900',
    color: '#E5A912',
  },
  featureText: {
    fontSize: 13,
    color: '#2A1B0E',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 13.5,
    color: '#4E3E31',
    lineHeight: 21,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
  },
  packagesList: {
    gap: 12,
  },
  pkgCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.3)',
  },
  pkgCardActive: {
    borderColor: '#E5A912',
    backgroundColor: '#FFFDF9',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  pkgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  pkgName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#110A03',
    marginBottom: 2,
  },
  pkgNameActive: {
    color: '#8A5506',
  },
  pkgDesc: {
    fontSize: 11.5,
    color: '#7C6B5C',
    maxWidth: 190,
  },
  pkgPriceCol: {
    alignItems: 'flex-end',
  },
  pkgPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#110A03',
  },
  pkgDepositText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '800',
    marginTop: 2,
  },
  pkgPerksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 169, 18, 0.15)',
  },
  pkgPerkPill: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.2)',
  },
  pkgPerkText: {
    fontSize: 10.5,
    color: '#4E2C00',
    fontWeight: '700',
  },
  reviewsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
    marginTop: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF9E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5A912',
  },
  reviewAvatarText: {
    fontSize: 14,
  },
  reviewAuthor: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#110A03',
  },
  reviewDate: {
    fontSize: 11,
    color: '#8E7B6B',
  },
  reviewStars: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 12.5,
    color: '#4E3E31',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 60,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(229, 169, 18, 0.35)',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  stickyPriceCol: {
    flex: 1,
  },
  stickyPriceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  stickyPriceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#110A03',
  },
  stickyPriceTotal: {
    fontSize: 11,
    color: '#8E7B6B',
  },
  stickyBookBtn: {
    backgroundColor: '#1E140A',
    borderWidth: 1.5,
    borderColor: '#E5A912',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  stickyBookBtnText: {
    color: '#F5C538',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 10, 3, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#E5A912',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalBadge: {
    backgroundColor: '#FFF9E5',
    borderWidth: 1,
    borderColor: '#E5A912',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  modalBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8A5506',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#110A03',
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EAE5DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#4E3E31',
    fontWeight: '800',
  },
  modalSummaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.3)',
    marginBottom: 16,
  },
  modalServiceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#110A03',
  },
  modalPkgName: {
    fontSize: 12,
    color: '#8A5506',
    fontWeight: '600',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: 'rgba(229, 169, 18, 0.2)',
    marginVertical: 10,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modalDetailLabel: {
    fontSize: 12,
    color: '#7C6B5C',
  },
  modalDetailVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#110A03',
  },
  modalDepositLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  modalDepositVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
  },
  paymentMethodTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#110A03',
    marginBottom: 10,
  },
  paymentButtonsCol: {
    gap: 8,
  },
  payProviderBtn: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clickBtn: {
    backgroundColor: '#0073FF',
  },
  paymeBtn: {
    backgroundColor: '#00CCCC',
  },
  uzumBtn: {
    backgroundColor: '#7000FF',
  },
  payProviderName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  payProviderSub: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSafetyFootnote: {
    fontSize: 11,
    color: '#7C6B5C',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 14,
  },
});
