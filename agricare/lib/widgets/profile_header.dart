import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Gradient background
        Container(
          height: 180,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color.fromARGB(255, 46, 200, 61), Color.fromARGB(255, 255, 255, 255)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(13)),
          ),
        ),

        // Overlay gelap
        Container(
          height: 180,
          decoration: BoxDecoration(
            color: Colors.grey.withOpacity(0.3),
            borderRadius: const BorderRadius.vertical(bottom: Radius.circular(13)),
          ),
        ),

        //Konten profile
        Container(
          padding: const EdgeInsets.only(top: 20, bottom: 20),
          // color: const Color.fromARGB(255, 50, 178, 103),
          child: Row(
            children: [
              const SizedBox(width: 10),
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
                      style: TextStyle(
                        fontSize: 12,
                        height: 1.1,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 5),
                    GestureDetector(
                      onTap: () {
                        // Navigasi ke halaman voucher
                      },
                      child: Row(
                        children: const [
                          FaIcon(FontAwesomeIcons.star, size: 14, color: Colors.white),
                          SizedBox(width: 5),
                          Text(
                            'Poin',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(width: 5),
                          Icon(Icons.chevron_right, color: Colors.white, size: 16),
                        ],
                      ),
                    ),
                    const SizedBox(height: 5),
                    GestureDetector(
                      onTap: () {
                        // Panggil UserisPromote
                      },
                      child: Row(
                        children: const [
                          FaIcon(FontAwesomeIcons.star, size: 14, color: Colors.white),
                          SizedBox(width: 5),
                          Text(
                            'Sahabat Tani',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(width: 5),
                          Icon(Icons.chevron_right, color: Colors.white, size: 16),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                margin: const EdgeInsets.only(right: 15),
                child: Stack(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.notifications, color: Colors.white, size: 24),
                      onPressed: () {
                        // Navigasi ke halaman notifikasi
                      },
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
              ),
              // const SizedBox(height: 5),
              GestureDetector(
                onTap: () {
                  // Navigasi ke halaman akun
                },
                child: Container(
                  width: 55,
                  height: 55,
                  margin: const EdgeInsets.only(right: 15),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white, width: 2),
                    shape: BoxShape.circle,
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