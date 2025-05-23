import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:agricare/pages/home_page.dart'; // pastikan import HomePage di sini

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({super.key});

  void _navigateToHome(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const HomePage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Gradient background
        Container(
          height: 180,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.green, Colors.greenAccent],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(13)),
          ),
        ),

        // Overlay gelap
        Container(
          height: 180,
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.15),
            borderRadius: const BorderRadius.vertical(bottom: Radius.circular(13)),
          ),
        ),

        // Konten profile
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Row(
            children: [
              // Kolom kiri
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'M.Rizal Saputra',
                      style: TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'Petani',
                      style: TextStyle(fontSize: 12, color: Colors.white),
                    ),
                    const SizedBox(height: 10),

                    InkWell(
                      onTap: () => _navigateToHome(context),
                      child: Row(
                        children: const [
                          FaIcon(FontAwesomeIcons.star, size: 14, color: Colors.white),
                          SizedBox(width: 5),
                          Text('Poin', style: TextStyle(fontSize: 14, color: Colors.white)),
                          SizedBox(width: 5),
                          Icon(Icons.chevron_right, color: Colors.white, size: 16),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: () => _navigateToHome(context),
                      child: Row(
                        children: const [
                          FaIcon(FontAwesomeIcons.userGroup, size: 14, color: Colors.white),
                          SizedBox(width: 5),
                          Text('Sahabat Tani', style: TextStyle(fontSize: 14, color: Colors.white)),
                          SizedBox(width: 5),
                          Icon(Icons.chevron_right, color: Colors.white, size: 16),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Notifikasi
              Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.notifications, color: Colors.white, size: 24),
                    onPressed: () => _navigateToHome(context),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFFF24822),
                      ),
                    ),
                  ),
                ],
              ),

              // Avatar
              GestureDetector(
                onTap: () => _navigateToHome(context),
                child: Container(
                  width: 55,
                  height: 55,
                  margin: const EdgeInsets.only(left: 8),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                    image: const DecorationImage(
                      image: AssetImage('assets/images/avatars/6s.png'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
