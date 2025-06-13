import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:agricare/pages/home_page.dart';
import 'lokasi_lahan_detail.dart';
import 'lokasi_lahan_tambah.dart';

class LahanPage extends StatefulWidget {
  const LahanPage({super.key});

  @override
  State<LahanPage> createState() => _LahanPageState();
}

class _LahanPageState extends State<LahanPage> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;
  late User? _user;
  late String _userId;
  late Stream<QuerySnapshot> _lahanStream;

  @override
  void initState() {
    super.initState();
    _user = _auth.currentUser;
    if (_user == null) {
      // Handle the case where the user is not logged in, e.g., navigate to login page
      print('User not logged in');
      // For now, let's just use a default user ID for demonstration
      _userId = 'defaultUserId'; // Replace with actual logic to handle unauthenticated users
    } else {
      _userId = _user!.uid;
    }
    _lahanStream = _firestore
        .collection('lahan')
        .where('userId', isEqualTo: _userId)
        .snapshots();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Lahan', style: TextStyle(color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const HomePage()),
            );
          },
        ),
        backgroundColor: Colors.green,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Image.asset(
              'assets/images/icons/icon_agricare.png',
              height: 30,
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              child: StreamBuilder<QuerySnapshot>(
                stream: _lahanStream,
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (snapshot.connectionState ==
                      ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.data == null ||
                      snapshot.data!.docs.isEmpty) {
                    return const Center(child: Text('Tidak ada lahan ditemukan.'));
                  } else {
                    return ListView(
                      children: snapshot.data!.docs.map((doc) {
                        final data = doc.data() as Map<String, dynamic>;
                        final namaLahan = data['namaLahan'] as String? ?? 'Nama Lahan Tidak Tersedia';
                        final luas = data['luas'] as String? ?? 'Luas Tidak Tersedia';
                        final lokasi = data['lokasi'] as String? ?? 'Lokasi Tidak Tersedia';
                        return Card(
                          color: const Color(0xFFF8FFF8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 3,
                          child: ListTile(
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
                            title: Text(
                              namaLahan,
                              style: const TextStyle(fontWeight: FontWeight.w600),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 6),
                                Row(
                                  children: const [
                                    Icon(Icons.crop, size: 16, color: Colors.green),
                                    SizedBox(width: 4),
                                  ],
                                ),
                                Text(luas),
                                const SizedBox(height: 4),
                                Row(
                                  children: const [
                                    Icon(Icons.location_on, size: 16, color: Colors.green),
                                    SizedBox(width: 4),
                                  ],
                                ),
                                Text(lokasi),
                              ],
                            ),
                            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                            onTap: () {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => LahanDetailPage(
                                    lahanId: doc.id,
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      }).toList(),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 12, right: 12),
        child: ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.green,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          ),
          icon: const Icon(Icons.add, color: Colors.white),
          label: const Text(
            "Tambah Lahan",
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => LahanTambahPage(userId: _userId), // Pass the userId
              ),
            );
          },
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}