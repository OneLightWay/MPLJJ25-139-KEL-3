import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:intl/intl.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart'; // <<< PASTIKAN INI ADA DAN TIDAK ADA TYPO

import 'lokasi_lahan.dart';
import 'lokasi_lahan_edit.dart';
import 'lokasi_lahan_detail_tanam.dart';
import 'lokasi_lahan_tambah_tanam.dart';

class LahanDetailPage extends StatefulWidget {
  final String lahanId;
  const LahanDetailPage({super.key, required this.lahanId});

  @override
  State<LahanDetailPage> createState() => _LahanDetailPageState();
}

class _LahanDetailPageState extends State<LahanDetailPage> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Map<String, dynamic>? _lahanData;
  Map<String, dynamic>? _currentTanamData;
  List<Map<String, dynamic>> _tanamHistoryList = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchPageData();
  }

  Future<void> _fetchPageData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      DocumentSnapshot lahanDoc = await _firestore.collection('lahan').doc(widget.lahanId).get();
      if (lahanDoc.exists) {
        _lahanData = lahanDoc.data() as Map<String, dynamic>;
      } else {
        _errorMessage = "Data lahan tidak ditemukan.";
        _isLoading = false;
        return;
      }

      QuerySnapshot currentTanamSnapshot = await _firestore
          .collection('jadwal_tanam')
          .where('lahanId', isEqualTo: widget.lahanId)
          .where('userId', isEqualTo: _auth.currentUser?.uid)
          .where('petani_tanam_is_panen', isEqualTo: 0)
          .limit(1)
          .get();

      if (currentTanamSnapshot.docs.isNotEmpty) {
        _currentTanamData = currentTanamSnapshot.docs.first.data() as Map<String, dynamic>;
        _currentTanamData!['tanamId'] = currentTanamSnapshot.docs.first.id;
      } else {
        _currentTanamData = null;
      }

      QuerySnapshot tanamHistorySnapshot = await _firestore
          .collection('jadwal_tanam')
          .where('lahanId', isEqualTo: widget.lahanId)
          .where('userId', isEqualTo: _auth.currentUser?.uid)
          .orderBy('petani_tanam_date', descending: true)
          .get();

      _tanamHistoryList = tanamHistorySnapshot.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        data['tanamId'] = doc.id;
        return data;
      }).toList();

    } catch (e) {
      _errorMessage = "Gagal memuat data: $e";
      // PERBAIKAN: Interpolasi string yang benar
      print("Error fetching all data for LahanDetailPage: $e");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _confirmDeleteLahan() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Hapus Lahan'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                // PERBAIKAN: Interpolasi string yang benar
                Text('Apakah Anda yakin ingin menghapus lahan "${_lahanData?['namaLahan'] ?? 'ini'}"?'),
                const Text('Tindakan ini tidak dapat dibatalkan.'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Batal'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Hapus'),
              onPressed: () {
                Navigator.of(context).pop();
                _deleteLahan();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _deleteLahan() async {
    try {
      await _firestore.collection('lahan').doc(widget.lahanId).delete();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lahan berhasil dihapus.')),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LahanPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal menghapus lahan: $e')),
      );
      // PERBAIKAN: Interpolasi string yang benar
      print("Error deleting lahan: $e");
    }
  }

  Future<void> _confirmDeleteJadwalTanam(String tanamId, String varietasName) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Hapus Jadwal Tanam'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Apakah Anda yakin ingin menghapus jadwal tanam varietas "${varietasName}" ini?'),
                const Text('Tindakan ini tidak dapat dibatalkan.'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Batal'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Hapus'),
              onPressed: () {
                Navigator.of(context).pop();
                _deleteJadwalTanam(tanamId);
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _deleteJadwalTanam(String tanamId) async {
    try {
      await _firestore.collection('jadwal_tanam').doc(tanamId).delete();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Jadwal tanam berhasil dihapus.')),
      );
      _fetchPageData();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal menghapus jadwal tanam: $e')),
      );
      print("Error deleting jadwal tanam: $e");
    }
  }

  double _convertLuasToHa(String luasString) {
    if (luasString.isEmpty) return 0.0;
    try {
      List<String> parts = luasString.split(' ');
      double value = double.parse(parts[0]);
      String unit = parts[1].toLowerCase();
      switch (unit) {
        case 'm²':
          return value / 10000;
        case 'are':
          return value / 100;
        case 'ha':
          return value;
        default:
          return 0.0;
      }
    } catch (e) {
      // PERBAIKAN: Hapus tag <span> dan math-inline
      print("Error parsing luas string: $e");
      return 0.0;
    }
  }

  String _getFaseImagePath(DateTime tanamDate) {
    int jadwalDay = DateTime.now().difference(tanamDate).inDays;
    String imagePath = 'assets/images/fase/';

    // PERBAIKAN: Hapus tag <span> dan math-inline pada semua return
    if (jadwalDay >= 0 && jadwalDay <= 7) {
      return '${imagePath}1.png';
    } else if (jadwalDay >= 7 && jadwalDay <= 10) {
      return '${imagePath}2.png';
    } else if (jadwalDay >= 11 && jadwalDay <= 14) {
      return '${imagePath}3.png';
    } else if (jadwalDay >= 15 && jadwalDay <= 23) {
      return '${imagePath}4.png';
    } else if (jadwalDay >= 24 && jadwalDay <= 40) {
      return '${imagePath}5.png';
    } else if (jadwalDay >= 41 && jadwalDay <= 89) {
      return '${imagePath}6.png';
    } else if (jadwalDay >= 90 && jadwalDay <= 102) {
      return '${imagePath}7.png';
    } else if (jadwalDay >= 103) {
      return '${imagePath}8.png';
    }
    return '${imagePath}placeholder.png';
  }

  String _formatToRupiah(num? value) {
    if (value == null) return '-';
    final formatter = NumberFormat.currency(locale: 'id_ID', symbol: '', decimalDigits: 0);
    return formatter.format(value);
  }


  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Detail Lahan', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.green,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const LahanPage()),
              );
            },
          ),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_errorMessage != null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Detail Lahan', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.green,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const LahanPage()),
              );
            },
          ),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, color: Colors.red, size: 50),
                const SizedBox(height: 10),
                Text(
                  _errorMessage!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.red, fontSize: 16),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _fetchPageData,
                  child: const Text('Coba Lagi'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final namaLahan = _lahanData?['namaLahan'] ?? 'Tidak Tersedia';
    final luasRawString = _lahanData?['luas'] ?? '';
    final luasInHa = _convertLuasToHa(luasRawString);
    final alamat = _lahanData?['alamat'] ?? 'Tidak Tersedia';
    final lokasiLengkap = _lahanData?['lokasi'] ?? 'Tidak Tersedia';
    final latitude = (_lahanData?['latitude'] as num?)?.toDouble();
    final longitude = (_lahanData?['longitude'] as num?)?.toDouble();


    return Scaffold(
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.only(top: 40, left: 16, right: 16),
            height: 100,
            decoration: const BoxDecoration(
              color: Colors.green,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LahanPage(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      "Detail Lahan",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Image.asset(
                  'assets/images/icons/icon_agricare.png',
                  height: 32,
                ),
              ],
            ),
          ),

          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildSectionCard(
                      context,
                      title: "Data Lahan",
                      actions: [
                        IconButton(
                          icon: const Icon(Icons.edit, color: Colors.green),
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (context) => EditLokasiLahanPage(lahanId: widget.lahanId),
                              ),
                            );
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: _confirmDeleteLahan,
                        ),
                      ],
                      children: [
                        _buildLabel("Nama lahan", namaLahan),
                        // PERBAIKAN: Interpolasi string yang benar
                        _buildLabel("Luas Lahan", "$luasRawString (${luasInHa.toStringAsFixed(2)} Ha)"),
                        _buildLabel("Alamat", alamat),
                        _buildLabel("Lokasi Lengkap", lokasiLengkap),
                        const SizedBox(height: 10),
                        Container(
                          height: 250, // Tinggi peta
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                            color: Colors.grey[300],
                          ),
                          alignment: Alignment.center,
                          child: (latitude != null && longitude != null)
                              ? GoogleMap(
                                  initialCameraPosition: CameraPosition(
                                    target: LatLng(latitude, longitude),
                                    zoom: 15,
                                  ),
                                  markers: {
                                    Marker(
                                      markerId: MarkerId(widget.lahanId),
                                      position: LatLng(latitude, longitude),
                                      infoWindow: InfoWindow(title: namaLahan),
                                    ),
                                  },
                                  zoomControlsEnabled: false,
                                  zoomGesturesEnabled: false,
                                  scrollGesturesEnabled: false,
                                  rotateGesturesEnabled: false,
                                  tiltGesturesEnabled: false,
                                  myLocationButtonEnabled: false,
                                  compassEnabled: false,
                                )
                              : const Center(
                                  child: Text("Lokasi Peta Tidak Tersedia"),
                                ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // === Data Tanam Berjalan (Ongoing Planting) ===
                    _buildSectionCard(
                      context,
                      title: "Data Tanam Berjalan",
                      actions: [
                        IconButton(
                          icon: const Icon(Icons.swap_horiz, color: Colors.grey),
                          onPressed: () {
                            print("Swap Tanam / Mulai Tanam Baru");
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.add, color: Colors.blue),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => TambahJadwalTanamPage(
                                  lahanId: widget.lahanId,
                                  userId: _auth.currentUser!.uid,
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                      children: [
                        if (_currentTanamData != null)
                          Card(
                            elevation: 2,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              children: [
                                Container(
                                  decoration: const BoxDecoration(
                                    color: Colors.green,
                                    borderRadius: BorderRadius.vertical(
                                      top: Radius.circular(12),
                                    ),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 8,
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        _currentTanamData!['varietas_name']?.toUpperCase() ?? 'Varietas Tidak Diketahui',
                                        style: const TextStyle(color: Colors.white),
                                      ),
                                      Text(
                                        'Hari ke - ${DateTime.now().difference((_currentTanamData!['petani_tanam_date'] as Timestamp).toDate()).inDays}',
                                        style: const TextStyle(color: Colors.white),
                                      ),
                                    ],
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Image.asset(
                                    _getFaseImagePath((_currentTanamData!['petani_tanam_date'] as Timestamp).toDate()),
                                    height: 120,
                                  ),
                                ),
                                const Divider(),
                                ListTile(
                                  title: const Text("Ketuk untuk detail"),
                                  trailing: const Icon(
                                    Icons.arrow_forward_ios,
                                    size: 16,
                                  ),
                                  onTap: () {
                                    if (_currentTanamData!['tanamId'] != null) {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => DetailTanamPage(tanamId: _currentTanamData!['tanamId']),
                                        ),
                                      );
                                    } else {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('ID jadwal tanam tidak ditemukan.')),
                                      );
                                    }
                                  },
                                ),
                              ],
                            ),
                          )
                        else
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.all(16.0),
                              child: Text('Tidak ada jadwal tanam berjalan.'),
                            ),
                          ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // === Riwayat Tanam (Planting History) ===
                    _buildSectionCard(
                      context,
                      title: "Riwayat Tanam",
                      children: [
                        if (_tanamHistoryList.isNotEmpty)
                          ..._tanamHistoryList.map((tanam) {
                            if (_currentTanamData != null && tanam['tanamId'] == _currentTanamData!['tanamId']) {
                              return const SizedBox.shrink();
                            }

                            DateTime tanamDate = (tanam['petani_tanam_date'] as Timestamp).toDate();
                            DateTime? panenDate = (tanam['petani_tanam_panen_date'] as Timestamp?)?.toDate();
                            String varietas = tanam['varietas_name'] ?? 'N/A';
                            num? panenQty = tanam['petani_tanam_panen_qty'];
                            String tanamId = tanam['tanamId'];

                            return Card(
                              margin: const EdgeInsets.only(bottom: 10),
                              elevation: 2,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              child: ListTile(
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                title: Text(
                                  varietas.toUpperCase(),
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const SizedBox(height: 4),
                                    Text('Tgl. Tanam: ${DateFormat('dd-MM-yyyy').format(tanamDate)}'),
                                    Text('Tgl. Panen: ${panenDate != null ? DateFormat('dd-MM-yyyy').format(panenDate) : '-'}'),
                                    Text('Jml. Panen: ${panenQty != null ? _formatToRupiah(panenQty) + ' KG' : '-'}'),
                                  ],
                                ),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.delete, size: 20, color: Colors.red),
                                      onPressed: () => _confirmDeleteJadwalTanam(tanamId, varietas),
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  if (tanamId != ' ') {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => DetailTanamPage(tanamId: tanamId),
                                        ),
                                      );
                                    } else {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('ID jadwal tanam tidak ditemukan.')),
                                      );
                                    }
                                },
                              ),
                            );
                          }).toList()
                        else
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.all(16.0),
                              child: Text('Tidak ada riwayat tanam untuk lahan ini.'),
                            ),
                          ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // === Rekomendasi Produk ===
                    _buildSectionCard(
                      context,
                      title: "Rekomendasi Produk",
                      children: [
                        const Center(
                          child: Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Text('Daftar rekomendasi produk akan tampil di sini.'),
                          ),
                        ),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _buildRekomenProdukItem("Jagung NK212", 'assets/images/avatars/produkTradder.png'),
                              _buildRekomenProdukItem("Padi Ciherang", 'assets/images/avatars/produkTradder.png'),
                              _buildRekomenProdukItem("Cabai Merah", 'assets/images/avatars/produkTradder.png'),
                            ],
                          ),
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard(
      BuildContext context, {
        required String title,
        required List<Widget> children,
        List<Widget>? actions,
      }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium!.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ),
                if (actions != null) ...actions,
              ],
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String title, String value) {
    Color labelColor = Colors.green;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: RichText(
        text: TextSpan(
          style: const TextStyle(fontSize: 14),
          children: [
            TextSpan(text: "$title\n", style: TextStyle(color: labelColor)),
            TextSpan(
              text: value,
              style: const TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRekomenProdukItem(String name, String imagePath) {
    return GestureDetector(
      onTap: () {
        print("Produk Rekomendasi dipilih: $name");
      },
      child: Container(
        width: 100,
        margin: const EdgeInsets.symmetric(horizontal: 8),
        child: Column(
          children: [
            Image.asset(imagePath, height: 80, width: 80, fit: BoxFit.contain),
            const SizedBox(height: 8),
            Text(
              name,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}