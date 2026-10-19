import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { ServiceDetailScreen } from './src/screens/ServiceDetailScreen';
import { BudgetCalculatorScreen } from './src/screens/BudgetCalculatorScreen';
import { DigitalInvitationScreen } from './src/screens/DigitalInvitationScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'budget' | 'invites'>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const renderScreen = () => {
    if (selectedServiceId !== null) {
      return (
        <ServiceDetailScreen
          serviceId={selectedServiceId}
          onBack={() => setSelectedServiceId(null)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onSelectService={(id) => setSelectedServiceId(id)}
            onOpenBudget={() => setActiveTab('budget')}
          />
        );
      case 'budget':
        return <BudgetCalculatorScreen />;
      case 'invites':
        return <DigitalInvitationScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Screen Body */}
      <View style={styles.body}>
        {renderScreen()}
      </View>

      {/* Luxury Bottom Navigation Bar */}
      {selectedServiceId === null && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('home')}
          >
            <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabIconActive]}>🏰</Text>
            <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>Xizmatlar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('budget')}
          >
            <Text style={[styles.tabIcon, activeTab === 'budget' && styles.tabIconActive]}>💍</Text>
            <Text style={[styles.tabLabel, activeTab === 'budget' && styles.tabLabelActive]}>Byudjet AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('invites')}
          >
            <Text style={[styles.tabIcon, activeTab === 'invites' && styles.tabIconActive]}>💌</Text>
            <Text style={[styles.tabLabel, activeTab === 'invites' && styles.tabLabelActive]}>Taklifnoma</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  body: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 10,
    paddingBottom: 20,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.gold[700],
    fontWeight: '700',
  }
});
