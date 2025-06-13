import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart'; // Untuk Firestore
import 'package:firebase_database/firebase_database.dart'; // Untuk data wilayah
import 'lokasi_lahan_detail.dart'; // Untuk kembali ke halaman detail

class EditLokasiLahanPage extends StatefulWidget {
  final String lahanId; // ID dokumen lahan yang akan diedit
  const EditLokasiLahanPage({super.key, required this.lahanId}); // Constructor baru

  @override
  State<EditLokasiLahanPage> createState() => _EditLokasiLahanPageState();
}

class _EditLokasiLahanPageState extends State<EditLokasiLahanPage> {
  final _formKey = GlobalKey<FormState>();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final DatabaseReference _dbRefWilayah = FirebaseDatabase.instance.ref("wilayah");

  String? selectedSatuan;
  String? selectedProvinsiId;
  String? selectedKotaId;
  String? selectedKecamatanId;
  String? selectedKelurahanId;

  String? initialProvinsiName; // Untuk menyimpan nama awal saat load
  String? initialKotaName;
  String? initialKecamatanName;
  String? initialKelurahanName;

  List<Map<String, String>> provinces = [];
  List<Map<String, String>> cities = [];
  List<Map<String, String>> districts = [];
  List<Map<String, String>> subdistricts = [];

  final TextEditingController namaLahanController = TextEditingController();
  final TextEditingController luasLahanController = TextEditingController();
  final TextEditingController luasHaController = TextEditingController();
  final TextEditingController alamatController = TextEditingController();

  bool _isLoading = true; // State untuk loading data awal

  @override
  void initState() {
    super.initState();
    _loadLahanData();
    // Tambahkan listener untuk perubahan luasLahanController
    luasLahanController.addListener(_calculateLuasHa);
  }

  @override
  void dispose() {
    namaLahanController.dispose();
    luasLahanController.dispose();
    luasHaController.dispose();
    alamatController.dispose();
    super.dispose();
  }

  Future<void> _loadLahanData() async {
    try {
      DocumentSnapshot doc = await _firestore.collection('lahan').doc(widget.lahanId).get();
      if (doc.exists) {
        Map<String, dynamic> data = doc.data() as Map<String, dynamic>;

        namaLahanController.text = data['namaLahan'] ?? '';
        alamatController.text = data['alamat'] ?? '';

        // Parsing luas dan satuan
        String? luasRaw = data['luas'];
        if (luasRaw != null && luasRaw.isNotEmpty) {
          List<String> parts = luasRaw.split(' ');
          if (parts.length == 2) {
            luasLahanController.text = parts[0];
            selectedSatuan = parts[1];
          } else {
            luasLahanController.text = luasRaw; // Fallback if format is not "number unit"
          }
        }
        
        // Simpan ID dan nama lokasi awal
        selectedProvinsiId = data['provinsiId'];
        selectedKotaId = data['kotaId'];
        selectedKecamatanId = data['kecamatanId'];
        selectedKelurahanId = data['kelurahanId'];

        initialProvinsiName = data['provinsiName'];
        initialKotaName = data['kotaName'];
        initialKecamatanName = data['kecamatanName'];
        initialKelurahanName = data['kelurahanName'];

        // Ambil data provinsi, kota, kecamatan, kelurahan
        await fetchProvinces(); // Ini akan mengisi `provinces`
        if (selectedProvinsiId != null) {
          await fetchCities(selectedProvinsiId!); // Ini akan mengisi `cities`
          if (selectedKotaId != null) {
            await fetchDistricts(selectedKotaId!); // Ini akan mengisi `districts`
            if (selectedKecamatanId != null) {
              await fetchSubdistricts(selectedKecamatanId!); // Ini akan mengisi `subdistricts`
            }
          }
        }
        _calculateLuasHa(); // Hitung ulang luas Ha setelah data dimuat
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Data lahan tidak ditemukan.')),
        );
        Navigator.pop(context); // Kembali jika data tidak ada
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal memuat data lahan: $e')),
      );
      print("Error loading lahan data: $e");
      Navigator.pop(context); // Kembali jika ada error
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // --- Fungsi fetch lokasi dari Firebase Realtime Database (sama seperti LahanTambahPage) ---
  Future<void> fetchProvinces() async {
    final snapshot = await _dbRefWilayah.child('provinsi').get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> provList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        provList.add({'id': val['id'], 'name': val['name']});
      });
      if (mounted) { // Pastikan widget masih mounted sebelum setState
        setState(() {
          provinces = provList;
        });
      }
    }
  }

  Future<void> fetchCities(String provinceId) async {
    final snapshot = await _dbRefWilayah
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
      if (mounted) {
        setState(() {
          cities = cityList;
        });
      }
    }
  }

  Future<void> fetchDistricts(String cityId) async {
    final snapshot = await _dbRefWilayah
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
      if (mounted) {
        setState(() {
          districts = distList;
        });
      }
    }
  }

  Future<void> fetchSubdistricts(String districtId) async {
    final snapshot = await _dbRefWilayah
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
      if (mounted) {
        setState(() {
          subdistricts = subList;
        });
      }
    }
  }
  // --- Akhir fungsi fetch wilayah ---

  void _calculateLuasHa() {
    double? luasValue = double.tryParse(luasLahanController.text);
    if (luasValue == null || selectedSatuan == null) {
      luasHaController.text = '';
      return;
    }

    double luasHa;
    switch (selectedSatuan) {
      case 'm²':
        luasHa = luasValue / 10000;
        break;
      case 'are':
        luasHa = luasValue / 100;
        break;
      case 'ha':
        luasHa = luasValue;
        break;
      default:
        luasHa = 0;
    }
    luasHaController.text = luasHa.toStringAsFixed(2); // Tampilkan 2 desimal
  }

  Future<void> _updateLahan() async {
    if (!_formKey.currentState!.validate() || 
        selectedProvinsiId == null || selectedKotaId == null ||
        selectedKecamatanId == null || selectedKelurahanId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Harap lengkapi semua field yang wajib diisi dan pilih lokasi.')),
      );
      return;
    }

    try {
      String finalProvinsiName = provinces.firstWhere((p) => p['id'] == selectedProvinsiId)['name'] ?? initialProvinsiName ?? '';
      String finalKotaName = cities.firstWhere((c) => c['id'] == selectedKotaId)['name'] ?? initialKotaName ?? '';
      String finalKecamatanName = districts.firstWhere((d) => d['id'] == selectedKecamatanId)['name'] ?? initialKecamatanName ?? '';
      String finalKelurahanName = subdistricts.firstWhere((s) => s['id'] == selectedKelurahanId)['name'] ?? initialKelurahanName ?? '';

      Map<String, dynamic> updatedData = {
        'namaLahan': namaLahanController.text.trim(),
        'luas': '${luasLahanController.text.trim()} $selectedSatuan', // Simpan luas dengan satuan
        'alamat': alamatController.text.trim(),
        'provinsiId': selectedProvinsiId,
        'provinsiName': finalProvinsiName,
        'kotaId': selectedKotaId,
        'kotaName': finalKotaName,
        'kecamatanId': selectedKecamatanId,
        'kecamatanName': finalKecamatanName,
        'kelurahanId': selectedKelurahanId,
        'kelurahanName': finalKelurahanName,
        'lokasi': '$finalKelurahanName, $finalKecamatanName, $finalKotaName, $finalProvinsiName', // Lokasi lengkap untuk tampilan
        'updatedAt': FieldValue.serverTimestamp(), // Timestamp saat data diperbarui
      };

      await _firestore.collection('lahan').doc(widget.lahanId).update(updatedData);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Data lahan berhasil diperbarui!')),
      );

      // Kembali ke halaman detail lahan setelah berhasil update
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: widget.lahanId)),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal memperbarui lahan: $e')),
      );
      print("Error updating lahan data: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Edit Lokasi Lahan', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.green,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Edit Lokasi Lahan',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: BackButton(
          color: Colors.white,
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: widget.lahanId)),
            );
          },
        ),
        backgroundColor: Colors.green,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: namaLahanController,
                decoration: const InputDecoration(
                  labelText: 'Nama Lahan',
                  hintText: 'Masukkan nama lahan',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value!.isEmpty ? 'Nama lahan wajib diisi' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedSatuan,
                decoration: const InputDecoration(labelText: 'Satuan Luas', border: OutlineInputBorder()),
                items: ['ha', 'm²', 'are'].map((String satuan) {
                  return DropdownMenuItem<String>(
                    value: satuan,
                    child: Text(satuan),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedSatuan = value;
                    _calculateLuasHa(); // Recalculate when satuan changes
                  });
                },
                validator: (value) => value == null ? 'Satuan luas wajib dipilih' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: luasLahanController,
                decoration: const InputDecoration(labelText: 'Luas Lahan', border: OutlineInputBorder()),
                keyboardType: TextInputType.number,
                validator: (value) => value!.isEmpty ? 'Luas lahan wajib diisi' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: luasHaController,
                decoration: const InputDecoration(labelText: 'Luas Lahan (Hektar)', border: OutlineInputBorder()),
                readOnly: true,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedProvinsiId,
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
                    selectedProvinsiId = val;
                    // Reset subordinate dropdowns
                    selectedKotaId = null;
                    selectedKecamatanId = null;
                    selectedKelurahanId = null;
                    cities = [];
                    districts = [];
                    subdistricts = [];
                  });
                  if (val != null) fetchCities(val);
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKotaId,
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
                    selectedKotaId = val;
                    selectedKecamatanId = null;
                    selectedKelurahanId = null;
                    districts = [];
                    subdistricts = [];
                  });
                  if (val != null) fetchDistricts(val);
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKecamatanId,
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
                    selectedKecamatanId = val;
                    selectedKelurahanId = null;
                    subdistricts = [];
                  });
                  if (val != null) fetchSubdistricts(val);
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKelurahanId,
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
                    selectedKelurahanId = val;
                  });
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: alamatController,
                decoration: const InputDecoration(labelText: 'Alamat', border: OutlineInputBorder()),
                validator: (value) => value!.isEmpty ? 'Alamat wajib diisi' : null,
              ),
              const SizedBox(height: 20),
              Container(
                height: 200,
                color: Colors.grey[300],
                alignment: Alignment.center,
                child: const Text('Peta lokasi (placeholder)'),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  minimumSize: const Size(double.infinity, 40),
                ),
                onPressed: _updateLahan, // Panggil fungsi update lahan
                child: const Text('Simpan Perubahan', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}