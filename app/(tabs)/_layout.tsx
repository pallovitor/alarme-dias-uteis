import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext'; // ajuste o caminho se necessário

export default function TabLayout() {
  return (
    <ThemeProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Alarmes',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="alarm-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Configurações',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
