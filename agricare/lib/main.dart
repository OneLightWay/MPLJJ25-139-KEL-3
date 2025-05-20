import 'package:agricare/pages/register_page.dart';
import 'package:flutter/material.dart';
import 'pages/splash_screen.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    // options: DefaultFirebaseOptions.currentPlatform,
    options: FirebaseOptions(
      apiKey: "dummyapikey", // tidak diperlukan untuk database publik
      appId: "1:1234567890:web:dummyappid",
      messagingSenderId: "1234567890",
      projectId: "api-wilayah-indonesia-firebase",
      databaseURL: "https://api-wilayah-indonesia-firebase.firebaseio.com",
    ),
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
      home: const RegisterPage(), // pastikan HomePage() ada
      debugShowCheckedModeBanner: false,
    );
  }
}
