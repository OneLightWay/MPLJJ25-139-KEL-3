import 'package:flutter/material.dart';
import '../widgets/profile_header.dart';
import '../widgets/dashboard.dart';
import '../widgets/artikel_slider.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200], // background lembut
      body: ListView(
        children: [
          Container(
            decoration: BoxDecoration(
              color: const Color.fromARGB(255, 247, 247, 247),
              borderRadius: BorderRadius.vertical(
                bottom: Radius.circular(13), 
              ),
            ),
            padding: const EdgeInsets.all(0),
            margin: const EdgeInsets.only(bottom: 13),
            child: const ProfileHeader(),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(13),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12, // warna bayangan
                  blurRadius: 10,        // seberapa blur
                  offset: Offset(0, 4),  // posisi bayangan (x, y) 
                )
              ],
            ),
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.only(bottom: 16),
            child: const ArtikelSlider(),
          ),
          // ProfileHeader(),
          // ArtikelSlider(),
          // // Expanded(child: DashboardMenu()),
          DashboardMenu(),
        ],
      ),
    );
  }
}
