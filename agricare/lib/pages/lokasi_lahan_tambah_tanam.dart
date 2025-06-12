import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geocoding/geocoding.dart';

import 'lokasi_lahan.dart';
import 'lokasi_lahan_detail.dart';
import 'pilih_lokasi_peta.dart';

class TambahJadwalTanamPage extends StatefulWidget {
  final String lahanId;
  final String userId;

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

  String? _selectedVarietasId;
  String? _selectedVarietasName;
  DateTime _selectedTanamDate = DateTime.now();

  LatLng? _selectedMapLocation; 
  String _selectedMapAddress = "Ketuk untuk pilih lokasi di peta"; 

  List<Map<String, String>> _varietasList = [];
  bool _isLoadingVarietas = true;
  String? _varietasError;

  @override
  void initState() {
    super.initState();
    _fetchVarietas();
  }

  Future<void> _fetchVarietas() async {
    try {
      QuerySnapshot snapshot = await _firestore.collection('varietas').get();
      _varietasList = snapshot.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return {'id': doc.id, 'name': data['varietas_name'] as String? ?? 'Nama Varietas Tidak Tersedia'};
      }).toList();
    } catch (e) {
      _varietasError = "Gagal memuat varietas: $e";
      print("Error fetching varietas: $e");
    } finally {
      setState(() {
        _isLoadingVarietas = false;
      });
    }
  }

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
          'pt_detail_is_open': 1,
          'pt_detail_data_pupuk': faseTemplate['pupuk_rekomendasi'] ?? {},
        });
        currentFaseDate = faseEndDate.add(const Duration(days: 1));
      }
    } else {
      fases = _generateGenericFases(tanamDate);
    }
    return fases;
  }

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
    
    // Validasi lokasi peta
    if (_selectedMapLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Harap pilih lokasi lahan di peta.")),
      );
      return;
    }

    setState(() {
      _isLoadingVarietas = true;
    });

    try {
      List<Map<String, dynamic>> defaultFases = await _generateDefaultFases(_selectedVarietasId!, _selectedTanamDate);

      Map<String, dynamic> jadwalTanamData = {
        'lahanId': widget.lahanId,
        'userId': widget.userId,
        'petani_tanam_date': Timestamp.fromDate(_selectedTanamDate),
        'varietas_id': _selectedVarietasId,
        'varietas_name': _selectedVarietasName,
        'petani_tanam_panen_date': null,
        'petani_tanam_panen_qty': null,
        'petani_tanam_is_panen': 0,
        'fase': defaultFases,
        'latitude': _selectedMapLocation!.latitude, // <<< SIMPAN LATITUDE
        'longitude': _selectedMapLocation!.longitude, // <<< SIMPAN LONGITUDE
        'lokasi_peta_text': _selectedMapAddress, // <<< SIMPAN ALAMAT DARI PETA
        'createdAt': FieldValue.serverTimestamp(),
      };

      await _firestore.collection('jadwal_tanam').add(jadwalTanamData);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Jadwal tanam berhasil ditambahkan!")),
      );

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
        _isLoadingVarietas = false;
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
              MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: widget.lahanId)),
            );
          },
        ),
      ),
      body: _isLoadingVarietas
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    DropdownButtonFormField<String>(
                      value: _selectedVarietasId,
                      hint: const Text("Pilih Varietas"),
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Varietas Tanaman'),
                      validator: (value) => value == null ? 'Varietas wajib dipilih' : null,
                      items: _varietasList.map((varietas) {
                        return DropdownMenuItem(
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
                      controller: TextEditingController(text: DateFormat('dd MMMM yyyy').format(_selectedTanamDate)),
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
                    const SizedBox(height: 16),
                    
                    // --- Widget Pemilihan Lokasi Peta ---
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
                            // Anda bisa memicu geocoding di sini untuk mendapatkan alamat,
                            // atau biarkan MapSelectionPage yang mengurusnya dan mengembalikan alamat juga.
                            // Untuk saat ini, kita akan mengasumsikan MapSelectionPage mengembalikan LatLng.
                            // Alamatnya akan kita ambil dari MapSelectionPage via String_selectedMapAddress
                          });
                          // Dapatkan alamat setelah koordinat dipilih
                          _getAddressFromLatLng(_selectedMapLocation!); // Panggil fungsi ini
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
                                  Icon(Icons.map, size: 50, color: Colors.grey),
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
  // Tambahkan fungsi ini di dalam _TambahJadwalTanamPageState
  Future<void> _getAddressFromLatLng(LatLng latLng) async {
  try {
    List<Placemark> placemarks = await placemarkFromCoordinates(
      latLng.latitude,
      latLng.longitude,
    );
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
    print("Error getting address: $e");
  }
}
}