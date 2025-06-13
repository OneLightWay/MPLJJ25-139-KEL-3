import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geocoding/geocoding.dart';

import 'lokasi_lahan.dart';
import 'lokasi_lahan_detail.dart';
import 'pilih_lokasi_peta.dart';

class LahanTambahPage extends StatefulWidget {
  final String userId;
  const LahanTambahPage({super.key, required this.userId});

  @override
  State<LahanTambahPage> createState() => _LahanTambahPageState();
}

class _LahanTambahPageState extends State<LahanTambahPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>(); // Pastikan ini dideklarasikan dengan benar
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

  LatLng? _selectedMapLocation;
  String _selectedMapAddress = "Ketuk untuk pilih lokasi di peta";

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
    // Pastikan controller di-dispose untuk mencegah memory leak
    namaLahanController.dispose();
    luasLahanController.dispose();
    super.dispose();
  }

  Future<void> fetchProvinces() async {
    final snapshot = await dbRef.child('provinsi').get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, dynamic>> provList = [];
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
      final List<Map<String, dynamic>> cityList = [];
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
      final List<Map<String, dynamic>> distList = [];
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
      final List<Map<String, dynamic>> subList = [];
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

  // <<< PERBAIKAN DI SINI: FUNGSI submitForm() >>>
  Future<void> submitForm() async {
    if (!_formKey.currentState!.validate()) { // Pastikan _formKey dideklarasikan dan digunakan
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
    
    if (_selectedMapLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap pilih lokasi lahan di peta.")),
      );
      return;
    }

    // Tampilkan loading indicator saat proses submit
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Menyimpan data lahan...")),
    );

    try {
      Map<String, dynamic> lahanData = {
        'userId': widget.userId,
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
        'lokasi': '${selectedSubdistrictName}, ${selectedDistrictName}, ${selectedCityName}, ${selectedProvinceName}',
        'latitude': _selectedMapLocation!.latitude,
        'longitude': _selectedMapLocation!.longitude,
        'lokasi_peta_text': _selectedMapAddress,
        'createdAt': FieldValue.serverTimestamp(),
      };

      // Tambahkan data ke Firestore dan dapatkan DocumentReference
      DocumentReference newDocRef = await _firestore.collection('lahan').add(lahanData);
      String newLahanId = newDocRef.id; // Dapatkan ID lahan yang baru dibuat

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Data lahan berhasil ditambahkan!")),
      );

      // Navigasi ke LahanDetailPage untuk lahan yang baru dibuat
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: newLahanId)), // <<< PERBAIKAN NAVIGASI
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Gagal menambahkan lahan: $e")),
      );
      print("Error adding lahan to Firestore: $e");
    }
  }
  // <<< AKHIR PERBAIKAN submitForm() >>>

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
            // Ketika menekan tombol kembali, cukup kembali ke LahanPage (daftar lahan)
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const LahanPage()),
            );
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form( // Pastikan ini membungkus semua input form
          key: _formKey, // Menggunakan GlobalKey yang dideklarasikan
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
                  return DropdownMenuItem<String>(
                    value: prov['id'] as String,
                    child: Text(prov['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedProvinceId = val;
                    selectedProvinceName = provinces.firstWhere((p) => p['id'] == val)['name'];
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
                  return DropdownMenuItem<String>(
                    value: city['id'] as String,
                    child: Text(city['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedCityId = val;
                    selectedCityName = cities.firstWhere((c) => c['id'] == val)['name'];
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
                  return DropdownMenuItem<String>(
                    value: dist['id'] as String,
                    child: Text(dist['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedDistrictId = val;
                    selectedDistrictName = districts.firstWhere((d) => d['id'] == val)['name'];
                    selectedSubdistrictId = null;
                    selectedSubdistrictName = null;
                    subdistricts = [];
                  });
                  if (val != null) fetchSubdistricts(val);
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
                  return DropdownMenuItem<String>(
                    value: sub['id'],
                    child: Text(sub['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedSubdistrictId = val;
                    selectedSubdistrictName = subdistricts.firstWhere((s) => s['id'] == val)['name'];
                  });
                },
                validator: (value) => value == null ? 'Kelurahan wajib dipilih' : null,
              ),
              const SizedBox(height: 20),

              // Widget Pemilihan Lokasi Peta
              GestureDetector(
                onTap: () async {
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
                    _getAddressFromLatLng(_selectedMapLocation!);
                  }
                },
                child: Container(
                  height: 200,
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
                          ],
                        )
                      : GoogleMap(
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
                ),
              ),
              const SizedBox(height: 5),
              Text(
                _selectedMapAddress,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),

              // Tombol Simpan
              SizedBox(
                width: double.infinity,
                height: 45,
                child: ElevatedButton(
                  onPressed: submitForm, // Memanggil fungsi submitForm
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