import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart'; // Tetap untuk data wilayah
import 'package:cloud_firestore/cloud_firestore.dart'; // Untuk menyimpan data lahan ke Firestore
import 'lokasi_lahan.dart'; // Untuk kembali ke halaman LahanPage

// Tambahkan userId ke constructor LahanTambahPage
class LahanTambahPage extends StatefulWidget {
  final String userId; // Tambahkan ini
  const LahanTambahPage({super.key, required this.userId}); // Perbarui constructor

  @override
  State<LahanTambahPage> createState() => _LahanTambahPageState();
}

class _LahanTambahPageState extends State<LahanTambahPage> {
  final DatabaseReference dbRef = FirebaseDatabase.instance.ref("wilayah"); // Untuk data wilayah (Realtime DB)
  final FirebaseFirestore _firestore = FirebaseFirestore.instance; // Untuk menyimpan lahan (Firestore)

  String? selectedProvinceId;
  String? selectedCityId;
  String? selectedDistrictId;
  String? selectedSubdistrictId;

  String? selectedProvinceName; // Untuk menyimpan nama
  String? selectedCityName;
  String? selectedDistrictName;
  String? selectedSubdistrictName;

  List<Map<String, String>> provinces = [];
  List<Map<String, String>> cities = [];
  List<Map<String, String>> districts = [];
  List<Map<String, String>> subdistricts = [];

  final TextEditingController namaLahanController = TextEditingController();
  final TextEditingController luasLahanController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchProvinces();
  }

  // --- Fungsi fetch tetap menggunakan Firebase Realtime Database ---
  Future<void> fetchProvinces() async {
    final snapshot = await dbRef.child('provinsi').get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> provList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        provList.add({'id': val['id'], 'name': val['name']});
      });
      setState(() {
        provinces = provList;
      });
    }
  }

  Future<void> fetchCities(String provinceId) async {
    final snapshot = await dbRef
        .child('kabupaten_kota')
        .orderByChild('id_provinsi')
        .equalTo(provinceId)
        .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> cityList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        cityList.add({'id': val['id'], 'name': val['name']});
      });
      setState(() {
        cities = cityList;
      });
    }
  }

  Future<void> fetchDistricts(String cityId) async {
    final snapshot = await dbRef
        .child('kecamatan')
        .orderByChild('id_kabupaten_kota')
        .equalTo(cityId)
        .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> distList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        distList.add({'id': val['id'], 'name': val['name']});
      });
      setState(() {
        districts = distList;
      });
    }
  }

  Future<void> fetchSubdistricts(String districtId) async {
    final snapshot = await dbRef
        .child('desa_kelurahan')
        .orderByChild('id_kecamatan')
        .equalTo(districtId)
        .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> subList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        subList.add({'id': val['id'], 'name': val['name']});
      });
      setState(() {
        subdistricts = subList;
      });
    }
  }
  // --- Akhir fungsi fetch Realtime Database ---


  // Fungsi untuk menyimpan data lahan ke Firestore
  void submitForm() async {
    if (namaLahanController.text.isEmpty ||
        luasLahanController.text.isEmpty ||
        selectedProvinceId == null ||
        selectedCityId == null ||
        selectedDistrictId == null ||
        selectedSubdistrictId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap lengkapi semua data lahan dan lokasi.")),
      );
      return;
    }

    try {
      // Buat peta data untuk disimpan ke Firestore
      Map<String, dynamic> lahanData = {
        'userId': widget.userId, // Menggunakan userId yang diterima
        'namaLahan': namaLahanController.text.trim(),
        'luas': luasLahanController.text.trim(),
        'provinsiId': selectedProvinceId,
        'provinsiName': selectedProvinceName,
        'kotaId': selectedCityId,
        'kotaName': selectedCityName,
        'kecamatanId': selectedDistrictId,
        'kecamatanName': selectedDistrictName,
        'kelurahanId': selectedSubdistrictId,
        'kelurahanName': selectedSubdistrictName,
        'lokasi': '${selectedSubdistrictName}, ${selectedDistrictName}, ${selectedCityName}, ${selectedProvinceName}', // Lokasi lengkap untuk tampilan
        'createdAt': FieldValue.serverTimestamp(), // Timestamp saat data dibuat
      };

      // Tambahkan data ke koleksi 'lahan' di Firestore
      await _firestore.collection('lahan').add(lahanData);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Data lahan berhasil ditambahkan!")),
      );

      // Kembali ke halaman LahanPage setelah berhasil menyimpan
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LahanPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Gagal menambahkan lahan: $e")),
      );
      print("Error adding lahan to Firestore: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tambah Lokasi Lahan'),
        backgroundColor: const Color(0xFF2EC83D),
        foregroundColor: Colors.white,
        leading: BackButton(
          color: Colors.white,
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const LahanPage()),
            );
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: namaLahanController,
              decoration: const InputDecoration(
                labelText: "Nama Lahan",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: luasLahanController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: "Luas Lahan (m²)",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),

            // Dropdown Provinsi
            DropdownButtonFormField<String>(
              value: selectedProvinceId,
              hint: const Text("Pilih Provinsi"),
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: provinces.map((prov) {
                return DropdownMenuItem(
                  value: prov['id'],
                  child: Text(prov['name']!),
                );
              }).toList(),
              onChanged: (val) {
                setState(() {
                  selectedProvinceId = val;
                  selectedProvinceName = provinces.firstWhere((p) => p['id'] == val)['name']; // Simpan nama
                  selectedCityId = null;
                  selectedCityName = null;
                  selectedDistrictId = null;
                  selectedDistrictName = null;
                  selectedSubdistrictId = null;
                  selectedSubdistrictName = null;
                  cities = [];
                  districts = [];
                  subdistricts = [];
                });
                if (val != null) fetchCities(val);
              },
            ),
            const SizedBox(height: 12),

            // Dropdown Kota/Kabupaten
            DropdownButtonFormField<String>(
              value: selectedCityId,
              hint: const Text("Pilih Kab./Kota"),
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: cities.map((city) {
                return DropdownMenuItem(
                  value: city['id'],
                  child: Text(city['name']!),
                );
              }).toList(),
              onChanged: (val) {
                setState(() {
                  selectedCityId = val;
                  selectedCityName = cities.firstWhere((c) => c['id'] == val)['name']; // Simpan nama
                  selectedDistrictId = null;
                  selectedDistrictName = null;
                  selectedSubdistrictId = null;
                  selectedSubdistrictName = null;
                  districts = [];
                  subdistricts = [];
                });
                if (val != null) fetchDistricts(val);
              },
            ),
            const SizedBox(height: 12),

            // Dropdown Kecamatan
            DropdownButtonFormField<String>(
              value: selectedDistrictId,
              hint: const Text("Pilih Kecamatan"),
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: districts.map((dist) {
                return DropdownMenuItem(
                  value: dist['id'],
                  child: Text(dist['name']!),
                );
              }).toList(),
              onChanged: (val) {
                setState(() {
                  selectedDistrictId = val;
                  selectedDistrictName = districts.firstWhere((d) => d['id'] == val)['name']; // Simpan nama
                  selectedSubdistrictId = null;
                  selectedSubdistrictName = null;
                  subdistricts = [];
                });
                if (val != null) fetchSubdistricts(val);
              },
            ),
            const SizedBox(height: 12),

            // Dropdown Kelurahan
            DropdownButtonFormField<String>(
              value: selectedSubdistrictId,
              hint: const Text("Pilih Kelurahan"),
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: subdistricts.map((sub) {
                return DropdownMenuItem(
                  value: sub['id'],
                  child: Text(sub['name']!),
                );
              }).toList(),
              onChanged: (val) {
                setState(() {
                  selectedSubdistrictId = val;
                  selectedSubdistrictName = subdistricts.firstWhere((s) => s['id'] == val)['name']; // Simpan nama
                });
              },
            ),
            const SizedBox(height: 20),

            // Tombol Simpan
            SizedBox(
              width: double.infinity,
              height: 45,
              child: ElevatedButton(
                onPressed: submitForm,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2EC83D),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Simpan Lokasi',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}