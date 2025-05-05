import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    try {
      const stored = await AsyncStorage.getItem('alarms');
      if (stored) {
        setAlarms(JSON.parse(stored));
      }
    } catch (e) {
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
        '1-1',   // Ano novo
        '21-4',  // Tiradentes
        '1-5',   // Dia do trabalho
        '7-9',   // Independência
        '12-10', // N. Sra Aparecida
        '2-11',  // Finados
        '15-11', // Proclamação da República
        '25-12', // Natal
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
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o alarme.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Alarme</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Hora"
          value={hour}
          onChangeText={setHour}
          maxLength={2}
        />
        <Text style={{ fontSize: 24 }}>:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Minuto"
          value={minute}
          onChangeText={setMinute}
          maxLength={2}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Apenas dias úteis</Text>
        <Switch value={onlyWeekdays} onValueChange={setOnlyWeekdays} />
      </View>

      <Button title="Salvar Alarme" onPress={handleAddAlarm} />

      <Text style={styles.subtitle}>Alarmes salvos:</Text>
      <FlatList
        data={alarms}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.alarmItem}>
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
    backgroundColor: '#fff',
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
    borderColor: '#ccc',
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
