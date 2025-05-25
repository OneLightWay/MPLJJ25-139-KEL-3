import 'package:flutter/material.dart';
import 'pages/splash_screen.dart';
import 'pages/home_page.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:firebase_core/firebase_core.dart';
// import 'package:firebase_auth/firebase_auth.dart' as auth;
// import 'package:firebase_ui_auth/firebase_ui_auth.dart';
// import 'firebase_options.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:agricare/pages/login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('id_ID', null);
  await Firebase.initializeApp(
    options: FirebaseOptions(
      apiKey: "AIzaSyDn5VwzZcxd4d6wDtLhT5C-R7e-fF1q2C0",
      appId: "1:56206815851:android:18f73066b0103e5449b72e",
      messagingSenderId: "1234567890",
      projectId: "agricare-94b91",
      databaseURL: "https://agricare-94b91-default-rtdb.asia-southeast1.firebasedatabase.app/",
    ),
  );
  // await Firebase.initializeApp(
  //   options: DefaultFirebaseOptions.currentPlatform,
  // );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Agricare',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
        textTheme: GoogleFonts.mulishTextTheme(),
      ),
      initialRoute:
      '/splash',
          // auth.FirebaseAuth.instance.currentUser == null ? '/login' : '/home',
      routes: {
        '/login': (context) => LoginPage(),
        '/home': (context) => const HomePage(),
        '/splash': (context) => const SplashScreen(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}
