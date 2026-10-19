import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

interface CategoryPillBarProps {
  categories: CategoryItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CategoryPillBar: React.FC<CategoryPillBarProps> = ({
  categories,
  selectedId,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isSelected = cat.id === selectedId;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.8}
            style={[styles.pill, isSelected && styles.selectedPill]}
          >
            <Text style={styles.icon}>{cat.icon}</Text>
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedPill: {
    backgroundColor: COLORS.obsidian[900],
    borderColor: COLORS.gold[500],
  },
  icon: {
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedText: {
    color: COLORS.gold[300],
  },
});
