import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const cards = [
  { id: "1", cardname: "Dark Magician", effect: "The ultimate wizard in terms of attack and defense." },
  { id: "2", cardname: "Blue-Eyes White Dragon", effect: "This legendary dragon is a powerful engine of destruction." },
  { id: "3", cardname: "Red-Eyes Black Dragon", effect: "A ferocious dragon with a deadly attack." },
  { id: "4", cardname: "Exodia the Forbidden One", effect: "If you have all five pieces of Exodia, you win the duel." },
  { id: "5", cardname: "Summoned Skull", effect: "A fiend with dark powers for confusing the enemy." },
  { id: "6", cardname: "Dark Magician Girl", effect: "Gains 300 ATK for each 'Dark Magician' in either player's graveyard." },
  { id: "7", cardname: "Jinzo", effect: "Trap Cards cannot be activated. Negate all Trap effects on the field." },
  { id: "8", cardname: "Slifer the Sky Dragon", effect: "Gains 1000 ATK/DEF for each card in your hand." },
  { id: "9", cardname: "Obelisk the Tormentor", effect: "Cannot be targeted by card effects. Can destroy all monsters your opponent controls." },
  { id: "10", cardname: "The Winged Dragon of Ra", effect: "Pay LP to increase ATK/DEF. Can be special summoned with unique effects." }
];

const router = useRouter();

const handleDismiss = () => {
  router.dismiss();
}


const CardName = () => {
  const params = useLocalSearchParams();
  const card = cards.find(c => c.id === params.id);

  if (!card) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Card not found</Text>
        <Button title="Go Back" onPress={handleDismiss} />

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Card Name: {card.cardname}</Text>
      <Text style={styles.effect}>Effect: {card.effect}</Text>
      <Button title="Go Back" onPress={handleDismiss} />
    </View>
  );
};

export default CardName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  effect: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
