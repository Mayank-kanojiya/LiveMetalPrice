import { FontAwesome } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchMetalDetails, MetalDetails } from '../api/metalService_temp';
import { useTimer } from '../contexts/TimerContext';

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const currencies = ['USD', 'EUR', 'INR', 'GBP', 'JPY'];
const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£',
  JPY: '¥',
};

// Example static conversion rates relative to USD
const conversionRates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.92,
  INR: 82,
  GBP: 0.81,
  JPY: 145,
};

const DetailsScreen = () => {
  const { metalName } = useLocalSearchParams<{ metalName: string }>();

  const [details, setDetails] = useState<MetalDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { countdown, lastUpdated } = useTimer();

  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await fetchMetalDetails(metalName);
        setDetails(data);
      } catch (err) {
        setError('Failed to fetch details.');
      } finally {
        if (isLoading) {
          setIsLoading(false);
        }
      }
    };
    if (lastUpdated) {
      loadDetails();
    }
  }, [metalName, lastUpdated]);

  const convertPrice = (priceInUSD: number) => {
    const rate = conversionRates[currency] || 1;
    return priceInUSD * rate;
  };

  const renderContent = () => {
    if (isLoading) {
      return <View style={styles.centered}><ActivityIndicator size="large" color="#FFD700" /></View>;
    }

    if (error) {
      return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
    }

    if (details) {
      const isPositiveChange = details.change >= 0;
      const changeColor = isPositiveChange ? '#4CAF50' : '#F44336';
      const changeSign = isPositiveChange ? '+' : '';
      const iconName = isPositiveChange ? 'caret-up' : 'caret-down';

      return (
        <View style={styles.contentContainer}>
          {/* Currency Selector */}
          <View style={styles.currencySelector}>
            {currencies.map(curr => (
              <TouchableOpacity
                key={curr}
                style={[
                  styles.currencyButton,
                  currency === curr && styles.currencyButtonSelected,
                ]}
                onPress={() => setCurrency(curr)}
              >
                <Text style={styles.currencyText}>{curr}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Header */}
          <View style={styles.priceHeader}>
            <Text style={styles.price}>
              {currencySymbols[currency]}{convertPrice(details.price).toFixed(2)}
            </Text>
            <View style={styles.changeContainer}>
              <FontAwesome name={iconName} size={20} color={changeColor} style={styles.icon} />
              <Text style={[styles.change, { color: changeColor }]}>
                {changeSign}{convertPrice(details.change).toFixed(2)} ({changeSign}{details.changePercentage.toFixed(2)}%)
              </Text>
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>Next update in {countdown}s</Text>
            </View>
          </View>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <DetailRow label="📈 Previous Close" value={`${currencySymbols[currency]}${convertPrice(details.previousClose).toFixed(2)}`} />
            <DetailRow label="🔓 Open" value={`${currencySymbols[currency]}${convertPrice(details.open).toFixed(2)}`} />
            <DetailRow label="⬆️ Day High" value={`${currencySymbols[currency]}${convertPrice(details.dayHigh).toFixed(2)}`} />
            <DetailRow label="⬇️ Day Low" value={`${currencySymbols[currency]}${convertPrice(details.dayLow).toFixed(2)}`} />
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Stack.Screen 
  options={{ 
    headerTitle: `${metalName} Details`,
    headerTitleAlign: 'center', // <-- This centers the title
  }} 
/>

      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#121212' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentContainer: { padding: 16 },
  priceHeader: { alignItems: 'center', marginBottom: 24, paddingVertical: 16 },
  price: { fontSize: 48, fontWeight: 'bold', color: '#FFFFFF' },
  changeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  icon: { marginRight: 6 },
  change: { fontSize: 18, fontWeight: '600' },
  detailsCard: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#333' },
  label: { fontSize: 16, color: '#A0A0A0' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  errorText: { color: '#FF6B6B', fontSize: 18 },
  timerContainer: {
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
  },
  timerText: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: '500',
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  currencyButton: {
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#888',
  },
  currencyButtonSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default DetailsScreen;
