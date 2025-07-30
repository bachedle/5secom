import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const RandomPage = () => {
  const router = useRouter();
  const [cardId, setCardId] = useState('');

  const handlePush = () => {
    router.push({
      pathname: 'randomPage/page1',
      params: { name: "bached" },
    });
  };

  const gotoCard = () => {
    if (!cardId.trim()) {
      alert("Please enter a card ID");
      return;
    }

    router.push({
      pathname: `randomPage/cardname/${cardId}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Random page</Text>

      <Button title="Go to Page 1" onPress={handlePush} />

      <View style={{ marginVertical: 30 }}>
        <Text style={styles.label}>Enter Card ID:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 1"
          value={cardId}
          onChangeText={setCardId}
          keyboardType="numeric"
        />
        <Button title="Go to Card Details" onPress={gotoCard} />
      </View>
    </View>
  );
};

export default RandomPage;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
});
