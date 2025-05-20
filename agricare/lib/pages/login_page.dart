import 'package:flutter/material.dart';
import 'home_page.dart';
import 'register_page.dart';

void main() => runApp(const LoginPage());

class LoginPage extends StatelessWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFFFFFFF), // Putih (sudut kanan bawah)
              Color(0xFF2EC83D), // Hijau terang (sudut kiri atas)
            ],
            stops: [0.0, 1.0],
            transform: GradientRotation(2.93),
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center, // Center vertically
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset('assets/images/logologin.png', width: 240),
                  const SizedBox(height: 30),
                  const Text(
                    'Silahkan masuk menggunakan akun\nyang telah Anda buat',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 18, color: Color(0xFF666666)),
                  ),
                  const SizedBox(height: 40),
                  const CustomInputField(
                    icon: Icons.person,
                    hintText: 'Email',
                    obscureText: false,
                  ),
                  const SizedBox(height: 20),
                  const CustomInputField(
                    icon: Icons.lock,
                    hintText: 'Kata sandi',
                    obscureText: true,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 45,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (context) => const HomePage()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2EC83D),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Masuk',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Belum punya akun?',
                        style: TextStyle(fontSize: 16, color: Color(0xFF666666)),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (context) => const RegisterPage()),
                        );},
                        child: const Text(
                          'Daftar akun',
                          style: TextStyle(
                            fontSize: 16,
                            color: Color(0xFF2EC83D),
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}


class CustomInputField extends StatelessWidget {
  final IconData icon;
  final String hintText;
  final bool obscureText;

  const CustomInputField({
    Key? key,
    required this.icon,
    required this.hintText,
    required this.obscureText,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        obscureText: obscureText,
        decoration: InputDecoration(
          icon: Icon(icon, color: Color(0xFF8C8C91)),
          border: InputBorder.none,
          hintText: hintText,
          hintStyle: const TextStyle(fontSize: 16, color: Color(0xFF8C8C91)),
        ),
      ),
    );
  }
} 