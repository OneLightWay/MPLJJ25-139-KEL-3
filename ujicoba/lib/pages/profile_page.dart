import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Background dengan overlay
            Stack(
              children: [
                Container(
                  height: 150,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.green, Colors.greenAccent],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                ),
                Positioned(
                  top: 50,
                  left: 10,
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back, color: Colors.white),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                      ),
                      const SizedBox(width: 10),
                      const Positioned(
                        child: Text(
                          'Profile',
                          style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // Card Profil
            Card(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 15),
                child: Column(
                  children: [
                    const CircleAvatar(
                      radius: 35,
                      backgroundImage: AssetImage('assets/images/avatars/6s.png'),
                    ),
                    const SizedBox(height: 10),
                    const Text("M. Rizal Saputra", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 4),
                    const Text("Petani", style: TextStyle(color: Colors.green, fontSize: 12)),
                    const SizedBox(height: 8),
                    GestureDetector(
                      onTap: () {
                        // onVoucher()
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 15),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(5),
                          border: Border.all(color: const Color(0xFF2ABA66), width: 2),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            FaIcon(FontAwesomeIcons.star, size: 14, color: Color(0xFF2ABA66)),
                            SizedBox(width: 6),
                            Text("Poin : 0", style: TextStyle(fontSize: 12, color: Color(0xFF2ABA66))),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Menu Akun
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Akun", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 10),
                  _buildMenuItem(context, "Edit Profil", Icons.edit, onTap: () {
                    // Navigator.push...
                  }),
                  _buildMenuItem(context, "Sahabat NK", Icons.group, onTap: () {}),
                  _buildMenuItem(context, "Pilih Bahasa", Icons.language, onTap: () {}),
                  const SizedBox(height: 10),
                  const Text("Keamanan dan Data", style: TextStyle(fontWeight: FontWeight.bold)),
                  _buildMenuItem(context, "Ubah Password", Icons.lock, onTap: () {}),
                  _buildMenuItem(context, "Perbarui Data", Icons.refresh, onTap: () {}),
                  _buildMenuItem(context, "Version (v1.0.0) Check Update", Icons.system_update, onTap: () {}),
                  const SizedBox(height: 10),
                  const Text("Panduan", style: TextStyle(fontWeight: FontWeight.bold)),
                  _buildMenuItem(context, "Lihat Panduan", Icons.help, onTap: () {}),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () {
                      // onLogout()
                    },
                    child: const Center(child: Text("Logout", style: TextStyle(color: Colors.white))),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem(BuildContext context, String title, IconData icon, {void Function()? onTap}) {
    return ListTile(
      dense: true,
      contentPadding: EdgeInsets.zero,
      title: Text(title, style: const TextStyle(fontSize: 14)),
      trailing: const Icon(Icons.chevron_right),
      leading: Icon(icon, size: 18, color: Colors.green),
      onTap: onTap,
    );
  }
}
