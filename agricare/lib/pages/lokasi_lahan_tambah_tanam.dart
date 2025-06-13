import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart'; // Tetap butuh LatLng

import 'lokasi_lahan.dart'; // Untuk navigasi kembali
import 'lokasi_lahan_detail.dart'; // Untuk navigasi ke detail lahan setelah submit

class TambahJadwalTanamPage extends StatefulWidget {
  final String lahanId; // ID lahan yang akan diisi jadwal tanamnya
  final String userId; // ID user yang sedang login

  const TambahJadwalTanamPage({
    super.key,
    required this.lahanId,
    required this.userId,
  });

  @override
  State<TambahJadwalTanamPage> createState() => _TambahJadwalTanamPageState();
}

class _TambahJadwalTanamPageState extends State<TambahJadwalTanamPage> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  // State untuk data form jadwal tanam
  String? _selectedVarietasId;
  String? _selectedVarietasName;
  DateTime _selectedTanamDate = DateTime.now();

  // State untuk data lahan yang akan diambil dari Firestore
  Map<String, dynamic>? _lahanData; 
  LatLng? _lahanLocation; // Koordinat lahan yang diambil dari Firestore
  String _lahanAddressText = "Memuat lokasi lahan..."; // Alamat lahan yang diambil dari Firestore

  List<Map<String, dynamic>> _varietasList = [];
  bool _isLoading = true; // State loading untuk seluruh halaman
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchPageInitialData(); // Memuat varietas dan data lahan
  }

  // Fungsi untuk memuat data awal halaman (varietas dan data lahan)
  Future<void> _fetchPageInitialData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      // 1. Ambil daftar varietas
      QuerySnapshot varietasSnapshot = await _firestore.collection('varietas').get();
      _varietasList = varietasSnapshot.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return {'id': doc.id, 'name': data['varietas_name'] as String? ?? 'Nama Varietas Tidak Tersedia'};
      }).toList();

      // 2. Ambil data lahan saat ini (untuk mendapatkan koordinatnya)
      DocumentSnapshot lahanDoc = await _firestore.collection('lahan').doc(widget.lahanId).get();
      if (lahanDoc.exists) {
        _lahanData = lahanDoc.data() as Map<String, dynamic>;
        // Set lokasi lahan dari data lahan
        if (_lahanData!['latitude'] != null && _lahanData!['longitude'] != null) {
          _lahanLocation = LatLng(
            (_lahanData!['latitude'] as num).toDouble(),
            (_lahanData!['longitude'] as num).toDouble(),
          );
          _lahanAddressText = _lahanData!['lokasi_peta_text'] ?? 'Lokasi lahan terdaftar.';
        } else {
          _errorMessage = "Data koordinat lahan tidak ditemukan.";
        }
      } else {
        _errorMessage = "Data lahan induk tidak ditemukan.";
      }
    } catch (e) {
      _errorMessage = "Gagal memuat data awal: $e";
      print("Error fetching initial data for TambahJadwalTanamPage: $e");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Fungsi untuk menghasilkan fase default berdasarkan varietas
  Future<List<Map<String, dynamic>>> _generateDefaultFases(String varietasId, DateTime tanamDate) async {
    List<Map<String, dynamic>> fases = [];
    DocumentSnapshot varietasDoc = await _firestore.collection('varietas').doc(varietasId).get();
    
    List<dynamic>? defaultFaseTemplate = (varietasDoc.data() as Map<String, dynamic>?)?['default_fase'];

    if (defaultFaseTemplate != null && defaultFaseTemplate.isNotEmpty) {
      DateTime currentFaseDate = tanamDate;
      for (var faseTemplate in defaultFaseTemplate) {
        int durasiHari = (faseTemplate['durasi_hari'] as num?)?.toInt() ?? 0;
        
        DateTime faseEndDate = currentFaseDate.add(Duration(days: durasiHari));

        fases.add({
          'fase_detail_type': faseTemplate['fase_detail_type'] ?? 0,
          'fase_detail_nama': faseTemplate['fase_detail_nama'] ?? 'Fase Tak Dikenal',
          'pt_detail_date_from': Timestamp.fromDate(currentFaseDate),
          'pt_detail_date_to': Timestamp.fromDate(faseEndDate),
          'pt_detail_is_open': 1, // Default terbuka/belum selesai
          'pt_detail_data_pupuk': faseTemplate['pupuk_rekomendasi'] ?? {}, // Jika ada rekomendasi pupuk di template
        });
        currentFaseDate = faseEndDate.add(const Duration(days: 1)); // Fase berikutnya dimulai sehari setelah fase sebelumnya berakhir
      }
    } else {
      // Jika tidak ada template fase di varietas, gunakan fase generik
      fases = _generateGenericFases(tanamDate);
    }
    return fases;
  }

  // Fungsi fallback jika tidak ada template fase spesifik per varietas
  List<Map<String, dynamic>> _generateGenericFases(DateTime tanamDate) {
    List<Map<String, dynamic>> genericFases = [];
    genericFases.add({
      'fase_detail_type': 0,
      'fase_detail_nama': "Tanam + Pupuk Dasar + Perlakuan Benih",
      'pt_detail_date_from': Timestamp.fromDate(tanamDate),
      'pt_detail_date_to': Timestamp.fromDate(tanamDate.add(const Duration(days: 9))),
      'pt_detail_is_open': 1,
    });
    genericFases.add({
      'fase_detail_type': 2,
      'fase_detail_nama': "Pengendalian Gulma Awal",
      'pt_detail_date_from': Timestamp.fromDate(tanamDate.add(const Duration(days: 10))),
      'pt_detail_date_to': Timestamp.fromDate(tanamDate.add(const Duration(days: 14))),
      'pt_detail_is_open': 1,
    });
    genericFases.add({
      'fase_detail_type': 1,
      'fase_detail_nama': "Pemupukan Pertama",
      'pt_detail_date_from': Timestamp.fromDate(tanamDate.add(const Duration(days: 15))),
      'pt_detail_date_to': Timestamp.fromDate(tanamDate.add(const Duration(days: 20))),
      'pt_detail_is_open': 1,
      'pt_detail_data_pupuk': {"Urea": 100, "NPK": 50},
    });
    return genericFases;
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap lengkapi semua field yang wajib diisi.")),
      );
      return;
    }

    if (_selectedVarietasId == null || _selectedVarietasName == null) {
       ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap pilih varietas.")),
      );
      return;
    }
    
    // Pastikan _lahanLocation sudah terisi dari data lahan
    if (_lahanLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Lokasi lahan tidak tersedia untuk jadwal tanam ini.")),
      );
      return;
    }

    setState(() {
      _isLoading = true; // Set loading saat submit
    });

    try {
      List<Map<String, dynamic>> defaultFases = await _generateDefaultFases(_selectedVarietasId!, _selectedTanamDate);

      Map<String, dynamic> jadwalTanamData = {
        'lahanId': widget.lahanId,
        'lahanName': _lahanData!['namaLahan'], // Ambil nama lahan dari _lahanData
        'userId': widget.userId,
        'petani_tanam_date': Timestamp.fromDate(_selectedTanamDate),
        'varietas_id': _selectedVarietasId,
        'varietas_name': _selectedVarietasName,
        'petani_tanam_panen_date': null, // Awalnya null
        'petani_tanam_panen_qty': null,  // Awalnya null
        'petani_tanam_is_panen': 0, // 0 = Belum panen
        'fase': defaultFases,
        'latitude': _lahanLocation!.latitude, // Gunakan latitude lahan
        'longitude': _lahanLocation!.longitude, // Gunakan longitude lahan
        'lokasi_peta_text': _lahanAddressText, // Gunakan alamat lahan
        'createdAt': FieldValue.serverTimestamp(),
      };

      await _firestore.collection('jadwal_tanam').add(jadwalTanamData);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Jadwal tanam berhasil ditambahkan!")),
      );

      // Kembali ke LahanDetailPage untuk lahan yang sama
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: widget.lahanId)),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Gagal menambahkan jadwal tanam: $e")),
      );
      print("Error adding jadwal tanam: $e");
    } finally {
      setState(() {
        _isLoading = false; // Akhiri loading
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tambah Jadwal Tanam'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
        leading: BackButton(
          color: Colors.white,
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: widget.lahanId)), // Kembali ke detail lahan
            );
          },
        ),
      ),
      body: _isLoading // Tampilkan loading untuk seluruh halaman
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center( // Tampilkan error jika ada
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      _errorMessage!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.red),
                    ),
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Tampilkan nama lahan yang terkait
                        Text(
                          'Untuk Lahan: ${_lahanData?['namaLahan'] ?? 'Memuat...'}',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.grey),
                        ),
                        Text(
                          _lahanAddressText, // Alamat lahan yang diambil
                          style: const TextStyle(fontSize: 14, color: Colors.grey),
                        ),
                        const SizedBox(height: 20),

                        DropdownButtonFormField<String>(
                          value: _selectedVarietasId,
                          hint: const Text("Pilih Varietas"),
                          decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Varietas Tanaman'),
                          validator: (value) => value == null ? 'Varietas wajib dipilih' : null,
                          items: _varietasList.map((varietas) {
                            return DropdownMenuItem<String>(
                              value: varietas['id'],
                              child: Text(varietas['name']!),
                            );
                          }).toList(),
                          onChanged: (val) {
                            setState(() {
                              _selectedVarietasId = val;
                              _selectedVarietasName = _varietasList.firstWhere((v) => v['id'] == val)['name'];
                            });
                          },
                        ),
                        const SizedBox(height: 16),

                        TextFormField(
                          readOnly: true,
                          controller: TextEditingController(text: DateFormat('dd MMMM yyyy', 'id_ID').format(_selectedTanamDate)), // PERBAIKAN FORMAT TANGGAL
                          decoration: const InputDecoration(
                            labelText: 'Tanggal Tanam',
                            border: OutlineInputBorder(),
                            suffixIcon: Icon(Icons.calendar_today),
                          ),
                          onTap: () async {
                            DateTime? pickedDate = await showDatePicker(
                              context: context,
                              initialDate: _selectedTanamDate,
                              firstDate: DateTime(2000),
                              lastDate: DateTime.now(),
                            );
                            if (pickedDate != null && pickedDate != _selectedTanamDate) {
                              setState(() {
                                _selectedTanamDate = pickedDate;
                              });
                            }
                          },
                          validator: (value) => value!.isEmpty ? 'Tanggal tanam wajib diisi' : null,
                        ),
                        const SizedBox(height: 20),

                        SizedBox(
                          width: double.infinity,
                          height: 45,
                          child: ElevatedButton(
                            onPressed: _submitForm,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Simpan Jadwal Tanam',
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