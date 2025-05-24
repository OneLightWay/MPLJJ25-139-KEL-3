import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';
import 'lokasi_lahan.dart';

class LahanTambahPage extends StatefulWidget {
  const LahanTambahPage({super.key});

  @override
  State<LahanTambahPage> createState() => _LahanTambahPageState();
}

class _LahanTambahPageState extends State<LahanTambahPage> {
  final DatabaseReference dbRef = FirebaseDatabase.instance.ref("wilayah");

  String? selectedProvince;
  String? selectedCity;
  String? selectedDistrict;
  String? selectedSubdistrict;

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

  void submitForm() {
    // Di sini kamu bisa menyimpan data ke database atau lakukan proses lain
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Data lahan berhasil ditambahkan")),
    );
    Navigator.pop(context); // kembali ke halaman sebelumnya
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
              value: selectedProvince,
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
                  selectedProvince = val;
                  selectedCity = null;
                  selectedDistrict = null;
                  selectedSubdistrict = null;
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
              value: selectedCity,
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
                  selectedCity = val;
                  selectedDistrict = null;
                  selectedSubdistrict = null;
                  districts = [];
                  subdistricts = [];
                });
                if (val != null) fetchDistricts(val);
              },
            ),
            const SizedBox(height: 12),

            // Dropdown Kecamatan
            DropdownButtonFormField<String>(
              value: selectedDistrict,
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
                  selectedDistrict = val;
                  selectedSubdistrict = null;
                  subdistricts = [];
                });
                if (val != null) fetchSubdistricts(val);
              },
            ),
            const SizedBox(height: 12),

            // Dropdown Kelurahan
            DropdownButtonFormField<String>(
              value: selectedSubdistrict,
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
                  selectedSubdistrict = val;
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
