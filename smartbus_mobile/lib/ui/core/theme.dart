import 'package:flutter/material.dart';

class AppTheme {
  // Brand Color Palette extracted from design reference:
  // Emerald Green primary header & card highlight
  static const Color primaryColor = Color(0xFF22C55E); // Emerald Green
  static const Color primaryDarkColor = Color(0xFF16A34A);
  
  // Vibrant Orange for CTAs & active highlights
  static const Color orangeAccent = Color(0xFFFF5722); // Vibrant Orange
  
  // Bright Blue for transport mode pills & route badges
  static const Color blueAccent = Color(0xFF0284C7); // Sky Blue
  
  // Clean Light Neutral Background
  static const Color backgroundColor = Color(0xFFF4F6F8);
  static const Color cardColor = Colors.white;
  
  // Dark mode surfaces
  static const Color darkBackgroundColor = Color(0xFF0F172A);
  static const Color darkCardColor = Color(0xFF1E293B);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: primaryColor,
    scaffoldBackgroundColor: backgroundColor,
    cardColor: cardColor,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: Colors.white),
      titleTextStyle: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
    ),
    colorScheme: const ColorScheme.light(
      primary: primaryColor,
      secondary: orangeAccent,
      tertiary: blueAccent,
      surface: cardColor,
      background: backgroundColor,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 2,
        shadowColor: primaryColor.withOpacity(0.3),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primaryColor: primaryColor,
    scaffoldBackgroundColor: darkBackgroundColor,
    cardColor: darkCardColor,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: Colors.white),
      titleTextStyle: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
    ),
    colorScheme: const ColorScheme.dark(
      primary: primaryColor,
      secondary: orangeAccent,
      tertiary: blueAccent,
      surface: darkCardColor,
      background: darkBackgroundColor,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 2,
        shadowColor: primaryColor.withOpacity(0.4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
  );
}
