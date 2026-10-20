import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { ServiceDetailScreen } from './src/screens/ServiceDetailScreen';
import { BudgetCalculatorScreen } from './src/screens/BudgetCalculatorScreen';
import { DigitalInvitationScreen } from './src/screens/DigitalInvitationScreen';
import { ChatScreen } from './src/screens/ChatScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'budget' | 'invites' | 'chat'>('home');
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
      case 'chat':
        return <ChatScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      
      {/* Screen Body */}
      <View style={styles.body}>
        {renderScreen()}
      </View>

      {/* 🏛️ Floating Palace Gold Bottom Navigation Bar */}
      {selectedServiceId === null && (
        <View style={styles.tabBarWrapper}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'home' && styles.tabItemActive]}
              onPress={() => setActiveTab('home')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>🏰</Text>
              <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>Xizmatlar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'budget' && styles.tabItemActive]}
              onPress={() => setActiveTab('budget')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>🧮</Text>
              <Text style={[styles.tabLabel, activeTab === 'budget' && styles.tabLabelActive]}>Byudjet AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'invites' && styles.tabItemActive]}
              onPress={() => setActiveTab('invites')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>💌</Text>
              <Text style={[styles.tabLabel, activeTab === 'invites' && styles.tabLabelActive]}>Taklifnoma</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'chat' && styles.tabItemActive]}
              onPress={() => setActiveTab('chat')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>💬</Text>
              <Text style={[styles.tabLabel, activeTab === 'chat' && styles.tabLabelActive]}>Konsyerj</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  body: {
    flex: 1,
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 12,
    left: 16,
    right: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 169, 18, 0.45)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#8A5506',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 70,
  },
  tabItemActive: {
    backgroundColor: '#FFF9E5',
    borderWidth: 1,
    borderColor: '#E5A912',
    shadowColor: '#E5A912',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10.5,
    color: '#8E7B6B',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#4E2C00',
    fontWeight: '800',
  }
});
