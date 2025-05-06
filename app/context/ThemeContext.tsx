import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

// Paleta de cores para temas claro e escuro
const lightTheme = {
  background: '#fff',
  text: '#000',
  border: '#ccc',
  placeholder: '#666',
};

const darkTheme = {
  background: '#121212',
  text: '#fff',
  border: '#666',
  placeholder: '#aaa',
};

// Tipo das cores do tema
type ThemeColors = typeof lightTheme;

// Tipo do contexto
interface ThemeContextType {
  theme: ColorSchemeName;
  themeColors: ThemeColors;
}

// Criação do contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personalizado para acessar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};

// Provider do contexto
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = Appearance.getColorScheme(); // "light" ou "dark"
  const [theme, setTheme] = useState<ColorSchemeName>(colorScheme);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const themeColors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
