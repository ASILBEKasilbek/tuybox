import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { GoldButton } from '../components/common/GoldButton';

type InvitationTheme = 'gold' | 'marble' | 'zardozi';

interface ThemeConfig {
  id: InvitationTheme;
  title: string;
  subtitle: string;
  icon: string;
  bgGrad: string;
  cardBg: string;
  borderColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  accentGold: string;
  ornament: string;
}

const INVITATION_THEMES: Record<InvitationTheme, ThemeConfig> = {
  gold: {
    id: 'gold',
    title: '24K Royal Palace',
    subtitle: "Shoxona Oltin & Qora Aqiq",
    icon: '👑',
    bgGrad: '#150E06',
    cardBg: '#1C1309',
    borderColor: '#E5A912',
    primaryTextColor: '#FFFFFF',
    secondaryTextColor: '#D4AF37',
    accentGold: '#F5C538',
    ornament: '⚜️  ✦  ⚜️',
  },
  marble: {
    id: 'marble',
    title: 'Carrara Marmar & Kristal',
    subtitle: 'Klassik oq nafislik & billur',
    icon: '🏛️',
    bgGrad: '#FBFBFC',
    cardBg: '#FFFFFF',
    borderColor: '#D4AF37',
    primaryTextColor: '#1A1816',
    secondaryTextColor: '#8A5506',
    accentGold: '#B8860B',
    ornament: '🌸  ✦  🌸',
  },
  zardozi: {
    id: 'zardozi',
    title: "Milliy Zardo'zi & Atlas",
    subtitle: 'Buxoro zarbofi & Samarqand an\'anasi',
    icon: '✨',
    bgGrad: '#2D0A14',
    cardBg: '#3B0F1B',
    borderColor: '#FFD700',
    primaryTextColor: '#FFF5EB',
    secondaryTextColor: '#F6C97E',
    accentGold: '#FFDF73',
    ornament: '✨  ❖  ✨',
  },
};

export const DigitalInvitationScreen: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<InvitationTheme>('gold');
  const [groomName, setGroomName] = useState('Asilbek');
  const [brideName, setBrideName] = useState('Madina');
  const [weddingDate, setWeddingDate] = useState('15-Noyabr, 2026');
  const [weddingTime, setWeddingTime] = useState('18:00');
  const [venueName, setVenueName] = useState('Versal Grand Ballroom');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [guestQrModal, setGuestQrModal] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState('Akmal & Nargiza');

  const theme = INVITATION_THEMES[selectedTheme];
  const inviteLink = `https://tuybor.uz/invite/${groomName.toLowerCase()}-${brideName.toLowerCase()}-2026`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `💍 Assalomu alaykum!\n\nSizni ${groomName} & ${brideName} ning muhtasham Nikoh Oqshomiga taklif etamiz!\n\n📅 Sana: ${weddingDate}, soat ${weddingTime}\n🏛️ Manzil: ${venueName}\n\n💌 Shaxsiy raqamli taklifnoma va qulay marshrut havolasi:\n${inviteLink}\n\nTo'yda sizni kutib qolamiz!`,
      });
    } catch {
      // Ignored
    }
  };

  const toggleMusic = () => {
    setIsPlayingMusic(!isPlayingMusic);
    Alert.alert(
      isPlayingMusic ? "Musiqa to'xtatildi" : "🎵 Musiqa yangramoqda",
      isPlayingMusic
        ? "To'y valsi pauzaga qo'yildi."
        : "Fransuz orkestri ijrosidagi to'y valsi yoqildi. Mehmonlar taklifnomani ochganda fon musiqasi yangraydi."
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 👑 Screen Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>💌 RAQAMLI TAKLIFNOMA STUDIO</Text>
        </View>
        <Text style={styles.pageTitle}>Shaxsiy Taklifnoma & QR</Text>
        <Text style={styles.pageSubtitle}>
          Qog'oz taklifnoma o'rniga zamonaviy interaktiv sahifa, QR mehmon nazorati va onlayn tabriklar
        </Text>
      </View>

      {/* 🎨 Theme Selector Tabs */}
      <View style={styles.themeSelectorSection}>
        <Text style={styles.sectionHeaderTitle}>Dizayn Usulini Tanlang:</Text>
        <View style={styles.themeRow}>
          {(['gold', 'marble', 'zardozi'] as InvitationTheme[]).map((tKey) => {
            const item = INVITATION_THEMES[tKey];
            const isActive = selectedTheme === tKey;
            return (
              <TouchableOpacity
                key={tKey}
                onPress={() => setSelectedTheme(tKey)}
                style={[styles.themeTab, isActive && styles.themeTabActive]}
                activeOpacity={0.85}
              >
                <Text style={styles.themeIcon}>{item.icon}</Text>
                <Text style={[styles.themeTabTitle, isActive && styles.themeTabTitleActive]}>
                  {item.title}
                </Text>
                {isActive && <View style={styles.themeActiveDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 💌 Live Luxury Invitation Card Preview */}
      <View style={styles.previewContainer}>
        <View style={styles.previewHeaderRow}>
          <Text style={styles.previewLabel}>JONLI KO'RINISH (PREVIEW)</Text>
          <TouchableOpacity onPress={toggleMusic} style={styles.musicToggleBtn}>
            <Text style={styles.musicToggleText}>
              {isPlayingMusic ? '🔊 Musiqa: Yoqilgan' : '🔇 Musiqa: O\'chiq'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.invitationCard,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          {/* Decorative Corner Borders */}
          <Text style={[styles.cardCornerTopLeft, { color: theme.accentGold }]}>❖</Text>
          <Text style={[styles.cardCornerTopRight, { color: theme.accentGold }]}>❖</Text>
          <Text style={[styles.cardCornerBottomLeft, { color: theme.accentGold }]}>❖</Text>
          <Text style={[styles.cardCornerBottomRight, { color: theme.accentGold }]}>❖</Text>

          <Text style={[styles.cardOrnament, { color: theme.accentGold }]}>{theme.ornament}</Text>
          
          <Text style={[styles.cardPresents, { color: theme.secondaryTextColor }]}>
            NIKOH TO'YI TAKLIFNOMASI
          </Text>

          {/* Monogram Seal */}
          <View style={[styles.monogramSeal, { borderColor: theme.accentGold }]}>
            <Text style={[styles.monogramText, { color: theme.accentGold }]}>
              {groomName.charAt(0)} & {brideName.charAt(0)}
            </Text>
          </View>

          {/* Couple Names */}
          <Text style={[styles.coupleNames, { color: theme.primaryTextColor }]}>
            {groomName} & {brideName}
          </Text>

          <Text style={[styles.cardInviteText, { color: theme.secondaryTextColor }]}>
            Sizni hayotimizdagi eng quvonchli va unutilmas tantana — nikoh oqshomimizga aziz mehmonimiz bo'lishga taklif qilamiz.
          </Text>

          {/* Date & Location Pill */}
          <View style={[styles.dateLocationBox, { borderColor: theme.borderColor }]}>
            <Text style={[styles.cardDateText, { color: theme.primaryTextColor }]}>
              📅 {weddingDate} • {weddingTime}
            </Text>
            <Text style={[styles.cardVenueText, { color: theme.secondaryTextColor }]}>
              🏛️ {venueName}
            </Text>
          </View>

          {/* Scannable VIP Entry Badge */}
          <View style={styles.vipPassBox}>
            <Text style={styles.vipQrSymbol}>▦ ▨ ▧</Text>
            <View>
              <Text style={[styles.vipPassTitle, { color: theme.accentGold }]}>
                MEHMON VIP ENTRY PASS
              </Text>
              <Text style={[styles.vipPassSubtitle, { color: theme.secondaryTextColor }]}>
                QR-kod stol raqami va joylashuv uchun
              </Text>
            </View>
          </View>

          <Text style={[styles.cardOrnament, { color: theme.accentGold, marginTop: 14 }]}>
            {theme.ornament}
          </Text>
        </View>
      </View>

      {/* 📊 Real-time RSVP Tracker Card */}
      <View style={styles.trackerCard}>
        <View style={styles.trackerHeader}>
          <Text style={styles.trackerBadge}>📊 JONLI RSVP STATISTIKA</Text>
          <Text style={styles.trackerTitle}>To'yga 24 kun qoldi ⏳</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#ECFDF5' }]}>
            <Text style={[styles.statNumber, { color: '#059669' }]}>240</Text>
            <Text style={styles.statLabel}>Boradiganlar</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#FEF2F2' }]}>
            <Text style={[styles.statNumber, { color: '#DC2626' }]}>15</Text>
            <Text style={styles.statLabel}>Borolmaydiganlar</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#FFFBEB' }]}>
            <Text style={[styles.statNumber, { color: '#D97706' }]}>45</Text>
            <Text style={styles.statLabel}>Kutilmoqda</Text>
          </View>
        </View>
      </View>

      {/* 🔗 Personal Link & Share Actions */}
      <LuxuryCard style={styles.linkCard}>
        <Text style={styles.linkCardTitle}>Shaxsiy to'y veb-sayti havolangiz:</Text>
        <View style={styles.linkBox}>
          <Text style={styles.linkText} numberOfLines={1}>{inviteLink}</Text>
        </View>

        <View style={styles.actionButtonsCol}>
          <GoldButton
            title="Telegram orqali mehmonlarga yuborish ✈️"
            onPress={handleShare}
          />

          <TouchableOpacity
            style={styles.qrPassGenerateBtn}
            onPress={() => setGuestQrModal(true)}
            activeOpacity={0.88}
          >
            <Text style={styles.qrPassGenerateBtnText}>
              🎟️ Shaxsiy Mehmon QR-passini ko'rish
            </Text>
          </TouchableOpacity>
        </View>
      </LuxuryCard>

      {/* 💬 So'nggi kelgan tabriklar */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>Oxirgi kelgan tilaklar & javoblar</Text>
          <Text style={styles.recentCountBadge}>Jami: 255 ta</Text>
        </View>

        {[
          {
            name: "Sardorbek va oilasi",
            status: "Albatta boramiz (+3 kishi)",
            text: "Baxtli bo'linglar, to'yda ko'rishguncha!",
            time: "10 daqiqa oldin",
          },
          {
            name: "Dilshod Akramov",
            status: "Boraman (+1 kishi)",
            text: "Qo'sha qaringlar, umringlar uzoq va barakali bo'lsin!",
            time: "Bugun, 14:20",
          },
          {
            name: "Kamola & Timur",
            status: "Albatta boramiz (+2 kishi)",
            text: "Juda ajoyib taklifnoma bo'libdi! Katta xursandchilik bilan boramiz.",
            time: "Kecha, 21:05",
          },
          {
            name: "Jamshid Qodirov",
            status: "Bora olmayman",
            text: "Afsuski xizmat safaridaman, chin dildan muborakbod etaman!",
            time: "Kecha, 18:30",
          },
        ].map((item, idx) => (
          <View key={idx} style={styles.rsvpItem}>
            <View style={styles.rsvpItemHeader}>
              <View>
                <Text style={styles.guestName}>{item.name}</Text>
                <Text style={styles.guestTime}>{item.time}</Text>
              </View>
              <Text
                style={[
                  styles.guestStatus,
                  item.status.includes('boramiz') || item.status.includes('Boraman')
                    ? styles.statusGreen
                    : styles.statusRed,
                ]}
              >
                {item.status}
              </Text>
            </View>
            <Text style={styles.guestMessage}>"{item.text}"</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacer} />

      {/* 🎟️ Individual Guest QR Pass Modal */}
      <Modal
        visible={guestQrModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setGuestQrModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.qrModalCard}>
            <View style={styles.qrModalHeader}>
              <Text style={styles.qrModalBadge}>🎟️ MEHMON PASS QR</Text>
              <TouchableOpacity onPress={() => setGuestQrModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.qrModalTitle}>Tantanaga Kirish Chiptasi</Text>
            <Text style={styles.qrModalSubtitle}>
              Mehmon to'yxonaga kelganda ushbu QR-kod skaner qilinadi va unga maxsus stol belgilanadi.
            </Text>

            {/* Simulated QR Code Graphic */}
            <View style={styles.qrGraphicBox}>
              <Text style={styles.qrBigSymbol}>▣ ▤ ▥ ▦ ▧ ▨ ▩</Text>
              <Text style={styles.qrBigSymbol}>▧ ▨ ▩ ▣ ▤ ▥ ▦</Text>
              <Text style={styles.qrBigSymbol}>▦ ▧ ▨ ▩ ▣ ▤ ▥</Text>
              <Text style={styles.qrCodeHash}>ID: VIP-TUYBOR-2026-089</Text>
            </View>

            <View style={styles.qrGuestInputRow}>
              <Text style={styles.qrInputLabel}>Mehmon ismi:</Text>
              <TextInput
                style={styles.qrTextInput}
                value={guestNameInput}
                onChangeText={setGuestNameInput}
                placeholder="Mehmon ismini yozing"
              />
            </View>

            <View style={styles.qrMetaRow}>
              <Text style={styles.qrMetaItem}>Stol: № 4 (VIP)</Text>
              <Text style={styles.qrMetaItem}>Joylar: 2 kishi</Text>
            </View>

            <TouchableOpacity
              style={styles.qrShareBtn}
              onPress={() => {
                setGuestQrModal(false);
                Alert.alert("Yuborildi", `${guestNameInput} uchun shaxsiy QR-pass Telegram orqali yuborishga tayyorlandi!`);
              }}
            >
              <Text style={styles.qrShareBtnText}>QR-Passni Mehmoniga Yuborish ✈️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    marginBottom: 16,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.4)',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A5506',
    letterSpacing: 0.8,
  },
  pageTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#110A03',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#7C6B5C',
    marginTop: 4,
    lineHeight: 18,
  },
  themeSelectorSection: {
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#110A03',
    marginBottom: 10,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeTab: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.25)',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    position: 'relative',
  },
  themeTabActive: {
    borderColor: '#E5A912',
    backgroundColor: '#FFFDF9',
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  themeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  themeTabTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C6B5C',
    textAlign: 'center',
  },
  themeTabTitleActive: {
    color: '#8A5506',
    fontWeight: '900',
  },
  themeActiveDot: {
    position: 'absolute',
    bottom: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E5A912',
  },
  previewContainer: {
    marginBottom: 18,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#8A5506',
    letterSpacing: 0.8,
  },
  musicToggleBtn: {
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5A912',
  },
  musicToggleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A5506',
  },
  invitationCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
    position: 'relative',
  },
  cardCornerTopLeft: {
    position: 'absolute',
    top: 10,
    left: 12,
    fontSize: 14,
  },
  cardCornerTopRight: {
    position: 'absolute',
    top: 10,
    right: 12,
    fontSize: 14,
  },
  cardCornerBottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    fontSize: 14,
  },
  cardCornerBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    fontSize: 14,
  },
  cardOrnament: {
    fontSize: 14,
    letterSpacing: 4,
    marginBottom: 6,
  },
  cardPresents: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  monogramSeal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(229, 169, 18, 0.1)',
  },
  monogramText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  coupleNames: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardInviteText: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  dateLocationBox: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 14,
  },
  cardDateText: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  cardVenueText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vipPassBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    width: '100%',
  },
  vipQrSymbol: {
    fontSize: 20,
    color: '#E5A912',
    letterSpacing: 2,
  },
  vipPassTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  vipPassSubtitle: {
    fontSize: 10,
    fontWeight: '500',
  },
  trackerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.35)',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackerBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8A5506',
  },
  trackerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C6B5C',
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
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  linkCard: {
    marginVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.35)',
    padding: 18,
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  linkCardTitle: {
    fontSize: 12.5,
    color: '#7C6B5C',
    fontWeight: '700',
    marginBottom: 8,
  },
  linkBox: {
    backgroundColor: '#FAF8F5',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
    marginBottom: 14,
  },
  linkText: {
    color: '#8A5506',
    fontSize: 13.5,
    fontWeight: '800',
  },
  actionButtonsCol: {
    gap: 10,
  },
  qrPassGenerateBtn: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E5A912',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  qrPassGenerateBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A5506',
  },
  recentSection: {
    marginTop: 18,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#110A03',
  },
  recentCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A5506',
  },
  rsvpItem: {
    marginVertical: 5,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.25)',
  },
  rsvpItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  guestName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#110A03',
  },
  guestTime: {
    fontSize: 10,
    color: '#8E7B6B',
    marginTop: 1,
  },
  guestStatus: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusGreen: {
    backgroundColor: '#ECFDF5',
    color: '#059669',
  },
  statusRed: {
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
  },
  guestMessage: {
    fontSize: 12.5,
    color: '#4E3E31',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 90,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 10, 3, 0.78)',
    justifyContent: 'center',
    padding: 20,
  },
  qrModalCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#E5A912',
    alignItems: 'center',
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  qrModalBadge: {
    backgroundColor: '#FFF9E5',
    borderWidth: 1,
    borderColor: '#E5A912',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: '900',
    color: '#8A5506',
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4E3E31',
    padding: 4,
  },
  qrModalTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#110A03',
    marginBottom: 4,
  },
  qrModalSubtitle: {
    fontSize: 12,
    color: '#7C6B5C',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  qrGraphicBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5A912',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  qrBigSymbol: {
    fontSize: 22,
    letterSpacing: 4,
    color: '#110A03',
  },
  qrCodeHash: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#8A5506',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  qrGuestInputRow: {
    width: '100%',
    marginTop: 10,
  },
  qrInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4E2C00',
    marginBottom: 4,
  },
  qrTextInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 18, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#110A03',
  },
  qrMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 12,
  },
  qrMetaItem: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  qrShareBtn: {
    backgroundColor: '#1E140A',
    borderWidth: 1.5,
    borderColor: '#E5A912',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  qrShareBtnText: {
    color: '#F5C538',
    fontSize: 13.5,
    fontWeight: '900',
  },
});
