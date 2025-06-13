import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart'; // Tetap untuk data wilayah
import 'package:cloud_firestore/cloud_firestore.dart'; // Untuk menyimpan data lahan ke Firestore
import 'package:intl/intl.dart'; // Untuk format tanggal (jika ada)
import 'package:google_maps_flutter/google_maps_flutter.dart'; // Pastikan ini ada
import 'package:geocoding/geocoding.dart'; // Pastikan ini ada

import 'lokasi_lahan.dart'; // Untuk kembali ke halaman LahanPage
import 'lokasi_lahan_detail.dart'; // Ini dibutuhkan untuk navigasi ke detail lahan yang baru ditambahkan
import 'pilih_lokasi_peta.dart'; // Import halaman pemilihan peta

class LahanTambahPage extends StatefulWidget {
  final String userId;
  const LahanTambahPage({super.key, required this.userId});

  @override
  State<LahanTambahPage> createState() => _LahanTambahPageState();
}

class _LahanTambahPageState extends State<LahanTambahPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final DatabaseReference dbRef = FirebaseDatabase.instance.ref("wilayah");
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  String? selectedProvinceId;
  String? selectedCityId;
  String? selectedDistrictId;
  String? selectedSubdistrictId;

  String? selectedProvinceName;
  String? selectedCityName;
  String? selectedDistrictName;
  String? selectedSubdistrictName;

  LatLng? _selectedMapLocation; // Koordinat yang dipilih dari peta
  String _selectedMapAddress = "Ketuk untuk pilih lokasi di peta"; // Alamat dari geocoding

  // PERBAIKAN TIPE: Menggunakan List<Map<String, dynamic>>
  List<Map<String, dynamic>> provinces = [];
  List<Map<String, dynamic>> cities = [];
  List<Map<String, dynamic>> districts = [];
  List<Map<String, dynamic>> subdistricts = [];

  final TextEditingController namaLahanController = TextEditingController();
  final TextEditingController luasLahanController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchProvinces();
  }

  @override
  void dispose() {
    namaLahanController.dispose();
    luasLahanController.dispose();
    super.dispose();
  }

  // --- Fungsi fetch tetap menggunakan Firebase Realtime Database ---
  Future<void> fetchProvinces() async {
    final snapshot = await dbRef.child('provinsi').get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, dynamic>> provList = []; // PERBAIKAN TIPE
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        provList.add({'id': val['id'] as String, 'name': val['name'] as String});
      });
      if (mounted) {
        setState(() {
          provinces = provList;
        });
      }
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
      final List<Map<String, dynamic>> cityList = []; // PERBAIKAN TIPE
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        cityList.add({'id': val['id'] as String, 'name': val['name'] as String});
      });
      if (mounted) {
        setState(() {
          cities = cityList;
        });
      }
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
      final List<Map<String, dynamic>> distList = []; // PERBAIKAN TIPE
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        distList.add({'id': val['id'] as String, 'name': val['name'] as String});
      });
      if (mounted) {
        setState(() {
          districts = distList;
        });
      }
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
      final List<Map<String, dynamic>> subList = []; // PERBAIKAN TIPE
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        subList.add({'id': val['id'] as String, 'name': val['name'] as String});
      });
      if (mounted) {
        setState(() {
          subdistricts = subList;
        });
      }
    }
  }
  // --- Akhir fungsi fetch Realtime Database ---

  // FUNGSI _getAddressFromLatLng
  Future<void> _getAddressFromLatLng(LatLng latLng) async {
    try {
      List<Placemark> placemarks = await placemarkFromCoordinates(latLng.latitude, latLng.longitude);
      if (placemarks.isNotEmpty) {
        Placemark place = placemarks.first;
        setState(() {
          _selectedMapAddress = '${place.street ?? ''}, ${place.subLocality ?? ''}, ${place.locality ?? ''}, ${place.administrativeArea ?? ''}, ${place.country ?? ''}';
        });
      } else {
        setState(() {
          _selectedMapAddress = 'Alamat tidak ditemukan';
        });
      }
    } catch (e) {
      setState(() {
        _selectedMapAddress = 'Gagal mengambil alamat: $e';
      });
      print("Error getting address in TambahLokasiLahanPage: $e");
    }
  }


  Future<void> submitForm() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap lengkapi semua field yang wajib diisi.")),
      );
      return;
    }

    if (selectedProvinceId == null || selectedCityId == null ||
        selectedDistrictId == null || selectedSubdistrictId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap lengkapi semua data lahan dan lokasi administratif.")),
      );
      return;
    }
    
    // Validasi lokasi peta
    if (_selectedMapLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap pilih lokasi lahan di peta.")),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Menyimpan data lahan...")),
    );

    try {
      // Ambil nama lengkap dari ID yang terpilih
      String finalProvinsiName = provinces.firstWhere((p) => p['id'] == selectedProvinceId)['name']! as String;
      String finalKotaName = cities.firstWhere((c) => c['id'] == selectedCityId)['name']! as String;
      String finalKecamatanName = districts.firstWhere((d) => d['id'] == selectedDistrictId)['name']! as String;
      String finalKelurahanName = subdistricts.firstWhere((s) => s['id'] == selectedSubdistrictId)['name']! as String;


      Map<String, dynamic> lahanData = {
        'userId': widget.userId,
        'namaLahan': namaLahanController.text.trim(),
        'luas': luasLahanController.text.trim(),
        'provinsiId': selectedProvinceId,
        'provinsiName': finalProvinsiName,
        'kotaId': selectedCityId,
        'kotaName': finalKotaName,
        'kecamatanId': selectedDistrictId,
        'kecamatanName': finalKecamatanName,
        'kelurahanId': selectedSubdistrictId,
        'kelurahanName': finalKelurahanName,
        'lokasi': '$finalKelurahanName, $finalKecamatanName, $finalKotaName, $finalProvinsiName',
        'latitude': _selectedMapLocation!.latitude, // SIMPAN LATITUDE
        'longitude': _selectedMapLocation!.longitude, // SIMPAN LONGITUDE
        'lokasi_peta_text': _selectedMapAddress, // SIMPAN ALAMAT DARI PETA
        'createdAt': FieldValue.serverTimestamp(),
      };

      DocumentReference newDocRef = await _firestore.collection('lahan').add(lahanData);
      String newLahanId = newDocRef.id;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Data lahan berhasil ditambahkan!")),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: newLahanId)),
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
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: namaLahanController,
                decoration: const InputDecoration(
                  labelText: "Nama Lahan",
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Nama lahan wajib diisi';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: luasLahanController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: "Luas Lahan (m²)",
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Luas lahan wajib diisi';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Masukkan angka yang valid';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),

              // Dropdown Provinsi
              DropdownButtonFormField<String>(
                value: selectedProvinceId,
                hint: const Text("Pilih Provinsi"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: provinces.map((prov) {
                  return DropdownMenuItem<String>( // PERBAIKAN TIPE
                    value: prov['id'] as String,
                    child: Text(prov['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedProvinceId = val;
                    selectedProvinceName = provinces.firstWhere((p) => p['id'] == val)['name'] as String;
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
                validator: (value) => value == null ? 'Provinsi wajib dipilih' : null,
              ),
              const SizedBox(height: 12),

              // Dropdown Kota/Kabupaten
              DropdownButtonFormField<String>(
                value: selectedCityId,
                hint: const Text("Pilih Kab./Kota"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: cities.map((city) {
                  return DropdownMenuItem<String>( // PERBAIKAN TIPE
                    value: city['id'] as String,
                    child: Text(city['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedCityId = val;
                    selectedCityName = cities.firstWhere((c) => c['id'] == val)['name'] as String;
                    selectedDistrictId = null;
                    selectedDistrictName = null;
                    selectedSubdistrictId = null;
                    selectedSubdistrictName = null;
                    districts = [];
                    subdistricts = [];
                  });
                  if (val != null) fetchDistricts(val);
                },
                validator: (value) => value == null ? 'Kabupaten/Kota wajib dipilih' : null,
              ),
              const SizedBox(height: 12),

              // Dropdown Kecamatan
              DropdownButtonFormField<String>(
                value: selectedDistrictId,
                hint: const Text("Pilih Kecamatan"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: districts.map((dist) {
                  return DropdownMenuItem<String>( // PERBAIKAN TIPE
                    value: dist['id'] as String,
                    child: Text(dist['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedDistrictId = val;
                    selectedDistrictName = districts.firstWhere((d) => d['id'] == val)['name'] as String;
                    selectedSubdistrictId = null;
                    selectedSubdistrictName = null;
                    subdistricts = [];
                  });
                  if (val != null) fetchDistricts(val);
                },
                validator: (value) => value == null ? 'Kecamatan wajib dipilih' : null,
              ),
              const SizedBox(height: 12),

              // Dropdown Kelurahan
              DropdownButtonFormField<String>(
                value: selectedSubdistrictId,
                hint: const Text("Pilih Kelurahan"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: subdistricts.map((sub) {
                  return DropdownMenuItem<String>( // PERBAIKAN TIPE
                    value: sub['id'] as String,
                    child: Text(sub['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedSubdistrictId = val;
                    selectedSubdistrictName = subdistricts.firstWhere((s) => s['id'] == val)['name'] as String;
                  });
                },
                validator: (value) => value == null ? 'Kelurahan wajib dipilih' : null,
              ),
              const SizedBox(height: 20),

              // Bagian Peta Interaktif
              GestureDetector(
                onTap: () async {
                  final LatLng? pickedLocation = await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => MapSelectionPage(
                        initialLocation: _selectedMapLocation, // Teruskan lokasi awal jika ada
                      ),
                    ),
                  );
                  if (pickedLocation != null) {
                    setState(() {
                      _selectedMapLocation = pickedLocation;
                    });
                    await _getAddressFromLatLng(_selectedMapLocation!); // Dapatkan alamat
                  }
                },
                child: Container(
                  height: 200, // Tinggi untuk tampilan peta mini
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  alignment: Alignment.center,
                  child: _selectedMapLocation == null
                      ? Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.map, size: 50, color: Colors.grey),
                            Text(_selectedMapAddress, textAlign: TextAlign.center),
                            const SizedBox(height: 10),
                            ElevatedButton(
                              onPressed: () async {
                                final LatLng? pickedLocation = await Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => MapSelectionPage(
                                      initialLocation: _selectedMapLocation,
                                    ),
                                  ),
                                );
                                if (pickedLocation != null) {
                                  setState(() {
                                    _selectedMapLocation = pickedLocation;
                                  });
                                  await _getAddressFromLatLng(_selectedMapLocation!);
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
                                foregroundColor: Colors.white,
                              ),
                              child: const Text('Pilih Lokasi di Peta'),
                            ),
                          ],
                        )
                      : Stack( // Gunakan Stack untuk menempatkan tombol di atas peta
                          alignment: Alignment.center,
                          children: [
                            GoogleMap(
                              initialCameraPosition: CameraPosition(
                                target: _selectedMapLocation!,
                                zoom: 15,
                              ),
                              markers: {
                                Marker(
                                  markerId: const MarkerId('selected_pin'),
                                  position: _selectedMapLocation!,
                                ),
                              },
                              zoomControlsEnabled: false,
                              zoomGesturesEnabled: false,
                              scrollGesturesEnabled: false,
                              rotateGesturesEnabled: false,
                              tiltGesturesEnabled: false,
                              myLocationButtonEnabled: false,
                              compassEnabled: false,
                            ),
                            // Overlay tombol "Edit Lokasi" di atas peta
                            Positioned(
                              bottom: 10,
                              child: ElevatedButton.icon(
                                icon: const Icon(Icons.edit_location_alt, size: 20),
                                label: const Text('Edit Lokasi'),
                                onPressed: () async {
                                  final LatLng? pickedLocation = await Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => MapSelectionPage(
                                        initialLocation: _selectedMapLocation,
                                      ),
                                    ),
                                  );
                                  if (pickedLocation != null) {
                                    setState(() {
                                      _selectedMapLocation = pickedLocation;
                                    });
                                    await _getAddressFromLatLng(_selectedMapLocation!);
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 5),
              Text(
                _selectedMapAddress,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),

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
      ),
    );
  }
}