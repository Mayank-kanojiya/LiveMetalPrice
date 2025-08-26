import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import MetalPriceTile from '../../components/MetalTilePrice';

const METALS_TO_DISPLAY = ['Gold', 'Silver', 'Platinum', 'Palladium'];

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Live Metal Prices</Text>
        </View>
        
        {/* We map over our array to create a tile for each metal */}
        {METALS_TO_DISPLAY.map((metal) => (
          <MetalPriceTile key={metal} metalName={metal} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#161613ff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',   // Add this line to center horizontally
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',    // Add this line to center the text
  },
});


export default HomeScreen;