import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(theme);

  const handleClearAlarms = async () => {
    try {
      await AsyncStorage.removeItem('alarms');
      Alert.alert('Sucesso', 'Todos os alarmes foram apagados.');
    } catch {
      Alert.alert('Erro', 'Não foi possível apagar os alarmes.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Button title="Alternar Tema" onPress={toggleTheme} />
      <View style={{ marginVertical: 12 }} />
      <Button title="Limpar todos os alarmes" onPress={handleClearAlarms} />
    </View>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme === 'dark' ? '#fff' : '#000',
    },
  });
