import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { COLORS } from '../../theme/colors';
import { GoldButton } from '../common/GoldButton';
import { LuxuryCard } from '../common/LuxuryCard';
import { CalendarDay } from '../../types';

interface InteractiveBookingCalendarProps {
  serviceTitle: string;
  basePrice: number;
  onBookConfirm: (date: string, timeSlot: string) => void;
}

export const InteractiveBookingCalendar: React.FC<InteractiveBookingCalendarProps> = ({
  serviceTitle,
  basePrice,
  onBookConfirm,
}) => {
  // Demo uchun 28 kunlik oylik kalendar
  const [selectedDay, setSelectedDay] = useState<number | null>(15);
  const [timeSlot, setTimeSlot] = useState<'day_osh' | 'evening_party'>('evening_party');
  const [modalVisible, setModalVisible] = useState(false);

  // Namuna kunlar va ularning bandlik statusi (yashil/qizil)
  const bookedDays = [3, 7, 12, 18, 24];

  const handleDayPress = (day: number) => {
    if (bookedDays.includes(day)) {
      return; // Band kun tanlanmaydi
    }
    setSelectedDay(day);
  };

  const depositAmount = Math.round(basePrice * 0.10);

  return (
    <LuxuryCard style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthTitle}>Oktabr 2026</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: COLORS.emerald }]} />
            <Text style={styles.legendText}>Bo'sh</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: COLORS.crimson }]} />
            <Text style={styles.legendText}>Band</Text>
          </View>
        </View>
      </View>

      {/* Hafta kunlari sarlavhasi */}
      <View style={styles.weekDaysRow}>
        {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((d, i) => (
          <Text key={i} style={styles.weekDayText}>{d}</Text>
        ))}
      </View>

      {/* Kalendar Grid (Kunlar) */}
      <View style={styles.grid}>
        {Array.from({ length: 28 }, (_, index) => {
          const dayNum = index + 1;
          const isBooked = bookedDays.includes(dayNum);
          const isSelected = selectedDay === dayNum;

          return (
            <TouchableOpacity
              key={dayNum}
              onPress={() => handleDayPress(dayNum)}
              disabled={isBooked}
              activeOpacity={0.7}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDayCell,
                isBooked && styles.bookedDayCell
              ]}
            >
              <Text style={[
                styles.dayNumText,
                isSelected && styles.selectedDayText,
                isBooked && styles.bookedDayText
              ]}>
                {dayNum}
              </Text>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: isBooked ? COLORS.crimson : COLORS.emerald }
              ]} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Vaqt sloti (Osh / Bazm) */}
      <View style={styles.slotContainer}>
        <Text style={styles.slotLabel}>Tadbir vaqti:</Text>
        <View style={styles.slotToggleRow}>
          <TouchableOpacity
            onPress={() => setTimeSlot('day_osh')}
            style={[styles.slotButton, timeSlot === 'day_osh' && styles.slotButtonActive]}
          >
            <Text style={[styles.slotButtonText, timeSlot === 'day_osh' && styles.slotButtonTextActive]}>
              ☀️ Osh vaqti (11:00)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeSlot('evening_party')}
            style={[styles.slotButton, timeSlot === 'evening_party' && styles.slotButtonActive]}
          >
            <Text style={[styles.slotButtonText, timeSlot === 'evening_party' && styles.slotButtonTextActive]}>
              🌙 Bazm vaqti (18:00)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tanlangan sana va Bron tugmasi */}
      {selectedDay && (
        <View style={styles.bookingFooter}>
          <View>
            <Text style={styles.selectedDateSummary}>
              {selectedDay}-Oktabr, 2026 ({timeSlot === 'day_osh' ? 'Osh' : 'Bazm'})
            </Text>
            <Text style={styles.depositSummary}>
              Avans depoziti (10%): {depositAmount.toLocaleString()} so'm
            </Text>
          </View>
          <GoldButton
            title="Bron qilish"
            onPress={() => setModalVisible(true)}
            style={styles.bookBtn}
          />
        </View>
      )}

      {/* Bron tasdiqlash modali */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Bron So'rovi</Text>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>{serviceTitle}</Text> xizmatini 
              {' '}{selectedDay}-Oktabr, 2026 kuni uchun bron qilishni tasdiqlaysizmi?
            </Text>
            <Text style={styles.modalDeposit}>
              To'lanadigan avans: {depositAmount.toLocaleString()} so'm (Click / Payme orqali)
            </Text>

            <View style={styles.modalActions}>
              <GoldButton
                title="To'lovga o'tish (Click/Payme)"
                onPress={() => {
                  setModalVisible(false);
                  onBookConfirm(`2026-10-${selectedDay}`, timeSlot);
                }}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Bekor qilish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LuxuryCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedDayCell: {
    backgroundColor: COLORS.obsidian[900],
    borderColor: COLORS.gold[500],
  },
  bookedDayCell: {
    backgroundColor: '#FEE2E2',
    opacity: 0.6,
  },
  dayNumText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectedDayText: {
    color: COLORS.gold[300],
    fontWeight: '800',
  },
  bookedDayText: {
    color: '#991B1B',
    textDecorationLine: 'line-through',
  },
  statusIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  slotContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  slotLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  slotToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  slotButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  slotButtonActive: {
    backgroundColor: COLORS.gold[100],
    borderWidth: 1,
    borderColor: COLORS.gold[500],
  },
  slotButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  slotButtonTextActive: {
    color: COLORS.gold[700],
    fontWeight: '700',
  },
  bookingFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'column',
    gap: 12,
  },
  selectedDateSummary: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  depositSummary: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  bookBtn: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  modalDeposit: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D4AF37',
    marginVertical: 16,
  },
  modalActions: {
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  }
});
