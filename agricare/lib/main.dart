import 'package:flutter/material.dart';
// import 'pages/home_page.dart'; // Pastikan file ini ada dan benar
import 'pages/splash_screen.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Agricare',
      theme: ThemeData(
        // primarySwatch: Colors.green,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
        textTheme: GoogleFonts.mulishTextTheme(),
      ),
      home: const SplashScreen(), // pastikan HomePage() ada
      debugShowCheckedModeBanner: false,
    );
  }
}
