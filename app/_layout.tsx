// app/_layout.tsx
import { Slot } from 'expo-router';
import { ThemeProvider } from '../app/context/ThemeContext'; // ajuste o caminho se necessário

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
