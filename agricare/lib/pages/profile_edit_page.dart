import 'package:flutter/material.dart';
// import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
// import 'package:font_awesome_flutter/font_awesome_flutter.dart';
// import 'package:intl/intl.dart';

import 'profile_page.dart';

class EditProfilePage extends StatefulWidget {
  final String userId;
  final Map<String, dynamic> initialUserData;

  const EditProfilePage({
    super.key,
    required this.userId,
    required this.initialUserData,
  });

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final DatabaseReference _dbRefUsers = FirebaseDatabase.instance.ref('users');
  final DatabaseReference _dbRefWilayah = FirebaseDatabase.instance.ref("wilayah");

  final TextEditingController _namaController = TextEditingController();
  final TextEditingController _teleponController = TextEditingController();
  final TextEditingController _alamatController = TextEditingController();

  String? _selectedProvinsiId;
  String? _selectedKotaId;
  String? _selectedKecamatanId;
  String? _selectedKelurahanId;

  List<Map<String, dynamic>> _provinces = [];
  List<Map<String, dynamic>> _cities = [];
  List<Map<String, dynamic>> _districts = [];
  List<Map<String, dynamic>> _subdistricts = [];

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
    _fetchWilayahData();
  }

  void _loadInitialData() {
    _namaController.text = widget.initialUserData['nama'] ?? '';
    _teleponController.text = widget.initialUserData['telepon'] ?? '';
    _alamatController.text = widget.initialUserData['alamat'] ?? '';

    _selectedProvinsiId = widget.initialUserData['provinsi_id'];
    _selectedKotaId = widget.initialUserData['kabupaten_id'];
    _selectedKecamatanId = widget.initialUserData['kecamatan_id'];
    _selectedKelurahanId = widget.initialUserData['kelurahan_id'];
  }

  Future<void> _fetchWilayahData() async {
    try {
      final provSnapshot = await _dbRefWilayah.child('provinsi').get();
      if (provSnapshot.exists) {
        final data = Map<String, dynamic>.from(provSnapshot.value as Map);
        _provinces = data.entries.map((e) => {
          'id': e.value['id'] as String,
          'name': e.value['name'] as String,
        }).toList();
      }

      if (_selectedProvinsiId != null) {
        await _fetchCities(_selectedProvinsiId!);
        if (_selectedKotaId != null) {
          await _fetchDistricts(_selectedKotaId!);
          if (_selectedKecamatanId != null) {
            await _fetchSubdistricts(_selectedKecamatanId!);
          }
        }
      }
    } catch (e) {
      print("Error fetching wilayah data: $e");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchCities(String provinceId) async {
    final snapshot = await _dbRefWilayah
        .child('kabupaten_kota')
        .orderByChild('id_provinsi')
        .equalTo(provinceId)
        .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      _cities = data.entries.map((e) => {
        'id': e.value['id'] as String,
        'name': e.value['name'] as String,
      }).toList();
    }
    if (mounted) setState(() {});
  }

  Future<void> _fetchDistricts(String cityId) async {
    final snapshot = await _dbRefWilayah
        .child('kecamatan')
        .orderByChild('id_kabupaten_kota')
        .equalTo(cityId)
        .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      _districts = data.entries.map((e) => {
        'id': e.value['id'] as String,
        'name': e.value['name'] as String,
      }).toList();
    }
    if (mounted) setState(() {});
  }

  Future<void> _fetchSubdistricts(String districtId) async {
    final snapshot = await _dbRefWilayah
        .child('desa_kelurahan')
        .orderByChild('id_kecamatan')
        .equalTo(districtId)
        .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      _subdistricts = data.entries.map((e) => {
        'id': e.value['id'] as String,
        'name': e.value['name'] as String,
      }).toList();
    }
    if (mounted) setState(() {});
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    // PERBAIKAN: Gunakan variabel dengan underscore
    if (_selectedProvinsiId == null || _selectedKotaId == null ||
        _selectedKecamatanId == null || _selectedKelurahanId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap pilih lokasi lengkap (Provinsi, Kab/Kota, Kecamatan, Kelurahan).")),
      );
      return;
    }

    String provinsiName = _provinces.firstWhere((p) => p['id'] == _selectedProvinsiId)['name']!;
    String kotaName = _cities.firstWhere((c) => c['id'] == _selectedKotaId)['name']!;
    String kecamatanName = _districts.firstWhere((d) => d['id'] == _selectedKecamatanId)['name']!;
    String kelurahanName = _subdistricts.firstWhere((s) => s['id'] == _selectedKelurahanId)['name']!;

    try {
      await _dbRefUsers.child(widget.userId).update({
        'nama': _namaController.text.trim(),
        'telepon': _teleponController.text.trim(),
        'alamat': _alamatController.text.trim(),
        'provinsi_id': _selectedProvinsiId,
        'provinsi': provinsiName,
        'kabupaten_id': _selectedKotaId,
        'kabupaten': kotaName,
        'kecamatan_id': _selectedKecamatanId, // PERBAIKAN: Gunakan variabel dengan underscore
        'kecamatan': kecamatanName,
        'kelurahan_id': _selectedKelurahanId, // PERBAIKAN: Gunakan variabel dengan underscore
        'kelurahan': kelurahanName,
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Profil berhasil diperbarui!")),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const ProfilePage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Gagal memperbarui profil: $e")),
      );
      print("Error updating profile: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Edit Profil', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.green,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Edit Profil',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.green,
        leading: BackButton(
          color: Colors.white,
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const ProfilePage()),
            );
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _namaController,
                decoration: const InputDecoration(
                  labelText: 'Nama Lengkap',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value!.isEmpty ? 'Nama tidak boleh kosong' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _teleponController,
                decoration: const InputDecoration(
                  labelText: 'Nomor Telepon',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) => value!.isEmpty ? 'Nomor telepon tidak boleh kosong' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _alamatController,
                decoration: const InputDecoration(
                  labelText: 'Alamat Lengkap',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
                validator: (value) => value!.isEmpty ? 'Alamat tidak boleh kosong' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedProvinsiId,
                hint: const Text("Pilih Provinsi"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: _provinces.map((prov) {
                  return DropdownMenuItem(
                    value: prov['id'] as String,
                    child: Text(prov['name'] as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    _selectedProvinsiId = val;
                    // PERBAIKAN: Gunakan variabel dengan underscore
                    _selectedKotaId = null;
                    _selectedKecamatanId = null;
                    _selectedKelurahanId = null;
                    _cities = [];
                    _districts = [];
                    _subdistricts = [];
                  });
                  if (val != null) _fetchCities(val);
                },
                validator: (value) => value == null ? 'Provinsi wajib dipilih' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedKotaId,
                hint: const Text("Pilih Kabupaten/Kota"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: _cities.map((city) {
                  return DropdownMenuItem(
                    value: city['id'] as String,
                    child: Text(city['name'] as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    _selectedKotaId = val;
                    // PERBAIKAN: Gunakan variabel dengan underscore
                    _selectedKecamatanId = null;
                    _selectedKelurahanId = null;
                    _districts = [];
                    _subdistricts = [];
                  });
                  if (val != null) _fetchDistricts(val);
                },
                validator: (value) => value == null ? 'Kabupaten/Kota wajib dipilih' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedKecamatanId,
                hint: const Text("Pilih Kecamatan"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: _districts.map((dist) {
                  return DropdownMenuItem(
                    value: dist['id'] as String,
                    child: Text(dist['name'] as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    _selectedKecamatanId = val;
                    // PERBAIKAN: Gunakan variabel dengan underscore
                    _selectedKelurahanId = null;
                    _subdistricts = [];
                  });
                  if (val != null) _fetchSubdistricts(val);
                },
                validator: (value) => value == null ? 'Kecamatan wajib dipilih' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedKelurahanId,
                hint: const Text("Pilih Kelurahan"),
                decoration: const InputDecoration(border: OutlineInputBorder()),
                items: _subdistricts.map((sub) {
                  return DropdownMenuItem(
                    value: sub['id'] as String,
                    child: Text(sub['name']! as String),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    _selectedKelurahanId = val;
                  });
                },
                validator: (value) => value == null ? 'Kelurahan wajib dipilih' : null,
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _updateProfile,
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