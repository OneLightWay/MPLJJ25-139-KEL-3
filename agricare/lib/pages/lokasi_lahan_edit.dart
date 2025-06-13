import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart'; // Untuk Firestore
import 'package:firebase_database/firebase_database.dart'; // Untuk data wilayah
import 'package:google_maps_flutter/google_maps_flutter.dart'; // Pastikan ini ada
import 'package:geocoding/geocoding.dart'; // Pastikan ini ada

import 'lokasi_lahan_detail.dart'; // Untuk kembali ke halaman detail
import 'pilih_lokasi_peta.dart'; // Halaman pemilihan peta

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

  LatLng? _selectedMapLocation; // Koordinat peta yang dipilih/dimuat
  String _selectedMapAddress = "Ketuk untuk pilih lokasi di peta"; // Alamat dari koordinat peta

  // PERBAIKAN TIPE: Menggunakan List<Map<String, dynamic>>
  List<Map<String, dynamic>> provinces = [];
  List<Map<String, dynamic>> cities = [];
  List<Map<String, dynamic>> districts = [];
  List<Map<String, dynamic>> subdistricts = [];

  final TextEditingController namaLahanController = TextEditingController();
  final TextEditingController luasLahanController = TextEditingController();
  final TextEditingController luasHaController = TextEditingController();
  final TextEditingController alamatController = TextEditingController();

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    luasLahanController.addListener(_calculateLuasHa);
    _loadLahanData(); // Memuat data lahan dan kemudian data wilayah
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

        String? luasRaw = data['luas'];
        if (luasRaw != null && luasRaw.isNotEmpty) {
          List<String> parts = luasRaw.split(' ');
          if (parts.length == 2) {
            luasLahanController.text = parts[0];
            selectedSatuan = parts[1];
          } else {
            luasLahanController.text = luasRaw;
          }
        }
        
        // Ambil dan set koordinat peta awal
        if (data['latitude'] != null && data['longitude'] != null) {
          _selectedMapLocation = LatLng(
            (data['latitude'] as num).toDouble(),
            (data['longitude'] as num).toDouble(),
          );
          _selectedMapAddress = data['lokasi_peta_text'] ?? 'Lokasi dipilih di peta';
        } else {
          // Jika data lahan tidak memiliki koordinat, coba geocoding dari alamat yang ada
          if (alamatController.text.isNotEmpty || data['lokasi'] != null) {
            await _getAddressFromText(alamatController.text.isNotEmpty ? alamatController.text : data['lokasi']);
          } else {
            _selectedMapAddress = 'Belum ada lokasi peta. Ketuk untuk pilih.'; // Pesan default jika tidak ada data peta
          }
        }

        selectedProvinsiId = data['provinsiId'];
        selectedKotaId = data['kotaId'];
        selectedKecamatanId = data['kecamatanId'];
        selectedKelurahanId = data['kelurahanId'];

        initialProvinsiName = data['provinsiName'];
        initialKotaName = data['kotaName'];
        initialKecamatanName = data['kecamatanName'];
        initialKelurahanName = data['kelurahanName'];

        // Memuat data wilayah setelah data lahan dimuat
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
        _calculateLuasHa();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Data lahan tidak ditemukan.')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal memuat data lahan: $e')),
      );
      print("Error loading lahan data: $e");
      Navigator.pop(context);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // --- Fungsi fetch lokasi dari Firebase Realtime Database ---
  Future<void> fetchProvinces() async {
    final snapshot = await _dbRefWilayah.child('provinsi').get();
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
    final snapshot = await _dbRefWilayah
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
    final snapshot = await _dbRefWilayah
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
    final snapshot = await _dbRefWilayah
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
    luasHaController.text = luasHa.toStringAsFixed(2);
  }

  // FUNGSI BARU: Mendapatkan alamat dari koordinat LatLng
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
      print("Error getting address in EditLokasiLahanPage: $e");
    }
  }

  // FUNGSI BARU: Mendapatkan koordinat dari alamat teks (digunakan jika lahan tidak memiliki koordinat awal)
  Future<void> _getAddressFromText(String addressText) async {
    try {
      List<Location> locations = await locationFromAddress(addressText);
      if (locations.isNotEmpty) {
        LatLng latLng = LatLng(locations.first.latitude, locations.first.longitude);
        setState(() {
          _selectedMapLocation = latLng;
          _selectedMapAddress = addressText;
        });
      } else {
        setState(() {
          _selectedMapAddress = 'Koordinat tidak ditemukan untuk alamat ini.';
        });
      }
    } catch (e) {
      setState(() {
        _selectedMapAddress = 'Gagal meng-geocode alamat: $e';
      });
      print("Error geocoding address in EditLokasiLahanPage: $e");
    }
  }

  Future<void> _updateLahan() async {
    if (!_formKey.currentState!.validate() || 
        selectedProvinsiId == null || selectedKotaId == null ||
        selectedKecamatanId == null || selectedKelurahanId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Harap lengkapi semua field yang wajib diisi dan pilih lokasi administratif.')),
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


    String finalProvinsiName = provinces.firstWhere((p) => p['id'] == selectedProvinsiId)['name']! as String;
    String finalKotaName = cities.firstWhere((c) => c['id'] == selectedKotaId)['name']! as String;
    String finalKecamatanName = districts.firstWhere((d) => d['id'] == selectedKecamatanId)['name']! as String;
    String finalKelurahanName = subdistricts.firstWhere((s) => s['id'] == selectedKelurahanId)['name']! as String;

    try {
      Map<String, dynamic> updatedData = {
        'namaLahan': namaLahanController.text.trim(),
        'luas': '${luasLahanController.text.trim()} $selectedSatuan',
        'alamat': alamatController.text.trim(),
        'provinsiId': selectedProvinsiId,
        'provinsiName': finalProvinsiName,
        'kotaId': selectedKotaId,
        'kotaName': finalKotaName,
        'kecamatanId': selectedKecamatanId,
        'kecamatanName': finalKecamatanName,
        'kelurahanId': selectedKelurahanId,
        'kelurahanName': finalKelurahanName,
        'lokasi': '$finalKelurahanName, $finalKecamatanName, $finalKotaName, $finalProvinsiName',
        'latitude': _selectedMapLocation!.latitude, // SIMPAN LATITUDE
        'longitude': _selectedMapLocation!.longitude, // SIMPAN LONGITUDE
        'lokasi_peta_text': _selectedMapAddress, // SIMPAN ALAMAT DARI PETA
        'updatedAt': FieldValue.serverTimestamp(),
      };

      await _firestore.collection('lahan').doc(widget.lahanId).update(updatedData);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Data lahan berhasil diperbarui!')),
      );

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
                    _calculateLuasHa();
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
                  return DropdownMenuItem<String>(
                    value: prov['id'] as String,
                    child: Text(prov['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedProvinsiId = val;
                    selectedKotaId = null;
                    selectedKecamatanId = null;
                    selectedKelurahanId = null;
                    cities = [];
                    districts = [];
                    subdistricts = [];
                  });
                  if (val != null) fetchCities(val);
                },
                validator: (value) => value == null ? 'Provinsi wajib dipilih' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKotaId,
                hint: const Text("Pilih Kabupaten/Kota"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: cities.map((city) {
                  return DropdownMenuItem<String>(
                    value: city['id'] as String,
                    child: Text(city['name']! as String),
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
                validator: (value) => value == null ? 'Kabupaten/Kota wajib dipilih' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKecamatanId,
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
                    selectedKecamatanId = val;
                    selectedKelurahanId = null;
                    subdistricts = [];
                  });
                  if (val != null) fetchDistricts(val);
                },
                validator: (value) => value == null ? 'Kecamatan wajib dipilih' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKelurahanId,
                hint: const Text("Pilih Kelurahan"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: subdistricts.map((sub) {
                  return DropdownMenuItem<String>(
                    value: sub['id'] as String,
                    child: Text(sub['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    selectedKelurahanId = val;
                  });
                },
                validator: (value) => value == null ? 'Kelurahan wajib dipilih' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: alamatController,
                decoration: const InputDecoration(labelText: 'Alamat', border: OutlineInputBorder()),
                validator: (value) => value!.isEmpty ? 'Alamat wajib diisi' : null,
              ),
              const SizedBox(height: 20),

              // <<< BAGIAN PETA INTERAKTIF DI SINI >>>
              // Widget Pemilihan Lokasi Peta
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
                    await _getAddressFromLatLng(_selectedMapLocation!); // Dapatkan alamat dari koordinat baru
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
                            // Tombol "Edit Lokasi" (jika peta belum ada atau ingin memilih ulang)
                            ElevatedButton(
                              onPressed: () async {
                                // Aksi yang sama dengan onTap di GestureDetector
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
              // Tampilkan alamat yang didapatkan dari koordinat peta
              Text(
                _selectedMapAddress,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              // <<< AKHIR BAGIAN PETA >>>

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _updateLahan,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Simpan Perubahan',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
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