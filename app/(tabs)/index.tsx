import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Alarm {
  hour: string;
  minute: string;
  onlyWeekdays: boolean;
}

export default function HomeScreen() {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [onlyWeekdays, setOnlyWeekdays] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const { themeColors } = useTheme();

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    try {
      const stored = await AsyncStorage.getItem('alarms');
      if (stored) {
        setAlarms(JSON.parse(stored));
      }
    } catch {
      Alert.alert('Erro', 'Falha ao carregar alarmes.');
    }
  };

  const handleAddAlarm = async () => {
    if (!hour || !minute) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const h = parseInt(hour);
    const m = parseInt(minute);

    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      Alert.alert('Erro', 'Hora ou minuto inválido.');
      return;
    }

    const now = new Date();
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      h,
      m
    );

    if (onlyWeekdays) {
      const day = date.getDay(); // 0 = domingo, 6 = sábado
      if (day === 0 || day === 6) {
        Alert.alert('Erro', 'O alarme não pode ser salvo para sábado ou domingo.');
        return;
      }

      const month = date.getMonth() + 1;
      const dayOfMonth = date.getDate();
      const feriadosFixos = [
        '1-1', '21-4', '1-5', '7-9',
        '12-10', '2-11', '15-11', '25-12',
      ];

      if (feriadosFixos.includes(`${dayOfMonth}-${month}`)) {
        Alert.alert('Erro', 'O alarme não pode ser salvo para um feriado nacional.');
        return;
      }
    }

    const newAlarm: Alarm = {
      hour: hour.padStart(2, '0'),
      minute: minute.padStart(2, '0'),
      onlyWeekdays,
    };

    const updatedAlarms = [...alarms, newAlarm];

    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
      setAlarms(updatedAlarms);
      setHour('');
      setMinute('');
      Alert.alert('Sucesso', `Alarme salvo para ${newAlarm.hour}:${newAlarm.minute}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o alarme.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Cadastrar Alarme</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
          keyboardType="numeric"
          placeholder="Hora"
          placeholderTextColor={themeColors.placeholder}
          value={hour}
          onChangeText={setHour}
          maxLength={2}
        />
        <Text style={[{ fontSize: 24, color: themeColors.text }]}>:</Text>
        <TextInput
          style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
          keyboardType="numeric"
          placeholder="Minuto"
          placeholderTextColor={themeColors.placeholder}
          value={minute}
          onChangeText={setMinute}
          maxLength={2}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={{ color: themeColors.text }}>Apenas dias úteis</Text>
        <Switch value={onlyWeekdays} onValueChange={setOnlyWeekdays} />
      </View>

      <Button title="Salvar Alarme" onPress={handleAddAlarm} />

      <Text style={[styles.subtitle, { color: themeColors.text }]}>Alarmes salvos:</Text>
      <FlatList
        data={alarms}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={[styles.alarmItem, { color: themeColors.text }]}>
            {item.hour}:{item.minute} {item.onlyWeekdays ? '(Dias úteis)' : ''}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    width: 60,
    textAlign: 'center',
    marginHorizontal: 8,
    borderRadius: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 24,
    fontWeight: 'bold',
  },
  alarmItem: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
