import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';

import 'lokasi_lahan.dart'; // Untuk kembali ke halaman LahanPage
import 'lokasi_lahan_detail.dart'; // Jika ingin kembali ke DetailLahanPage setelah hapus tanam

class DetailTanamPage extends StatefulWidget {
  final String tanamId;
  const DetailTanamPage({super.key, required this.tanamId});

  @override
  State<DetailTanamPage> createState() => _DetailTanamPageState();
}

class _DetailTanamPageState extends State<DetailTanamPage> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  Map<String, dynamic>? _tanamData;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchTanamData();
  }

  Future<void> _fetchTanamData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      DocumentSnapshot doc = await _firestore.collection('jadwal_tanam').doc(widget.tanamId).get();
      if (doc.exists) {
        setState(() {
          _tanamData = doc.data() as Map<String, dynamic>;
        });
      } else {
        _errorMessage = "Data jadwal tanam tidak ditemukan.";
      }
    } catch (e) {
      _errorMessage = "Gagal memuat detail jadwal tanam: $e";
      print("Error fetching tanam detail: $e");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  String _getFaseDetailIcon(int type) {
    String imagePath = 'assets/images/icons/';
    switch (type) {
      case 0:
        return '${imagePath}icon-certificate.png';
      case 1:
        return '${imagePath}icon-pupuk.png';
      case 2:
        return '${imagePath}icon-circle.png';
      case 3:
        return '${imagePath}icon-ulat.png';
      case 4:
        return '${imagePath}icon-panen.png';
      default:
        return '${imagePath}icon-calendar.png';
    }
  }

  Future<void> _confirmDeleteTanam() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Hapus Jadwal Tanam'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Apakah Anda yakin ingin menghapus jadwal tanam "${_tanamData?['varietas_name'] ?? 'ini'}"?'),
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
                _deleteTanam();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _deleteTanam() async {
    try {
      await _firestore.collection('jadwal_tanam').doc(widget.tanamId).delete();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Jadwal tanam berhasil dihapus.')),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LahanPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal menghapus jadwal tanam: $e')),
      );
      print("Error deleting jadwal tanam: $e");
    }
  }

  // --- Fungsi untuk menampilkan dialog aksi fase ---
  // Menerima faseIndex (posisi fase dalam daftar) dan fase (data fase itu sendiri)
  Future<void> _showAksiFaseDialog(int faseIndex, Map<String, dynamic> fase) async {
    final TextEditingController deskripsiController = TextEditingController(text: fase['pt_detail_desc'] ?? '');
    final Map<String, TextEditingController> pupukAktualControllers = {};
    
    Map<String, dynamic>? pupukRekomendasi = fase['pt_detail_data_pupuk'] as Map<String, dynamic>?;
    Map<String, dynamic>? pupukAktualAwal = fase['pt_detail_data_pupuk_act'] as Map<String, dynamic>?;

    if (pupukRekomendasi != null) {
      pupukRekomendasi.forEach((key, value) {
        pupukAktualControllers[key] = TextEditingController(
          text: pupukAktualAwal != null && pupukAktualAwal.containsKey(key) 
                ? pupukAktualAwal[key].toString() 
                : '0'
        );
      });
    }

    DateTime selectedDate = (fase['pt_detail_date_act'] as Timestamp?)?.toDate() ?? DateTime.now();
    DateTime faseStartDate = (fase['pt_detail_date_from'] as Timestamp).toDate();
    DateTime faseEndDate = (fase['pt_detail_date_to'] as Timestamp).toDate();

    await showDialog(
      context: context,
      builder: (context) {
        // StatefulBuilder digunakan agar setState di dalam dialog bisa bekerja
        return StatefulBuilder(
          builder: (context, setStateSB) {
            return AlertDialog(
              title: Text('Aksi: ${fase['fase_detail_nama']}'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ListTile(
                      leading: const Icon(Icons.calendar_today),
                      title: const Text('Tanggal Aksi'),
                      subtitle: Text(DateFormat('dd-MM-yyyy').format(selectedDate)),
                      onTap: () async {
                        DateTime? picked = await showDatePicker(
                          context: context,
                          initialDate: selectedDate,
                          firstDate: faseStartDate,
                          lastDate: faseEndDate,
                        );
                        if (picked != null && picked != selectedDate) {
                          setStateSB(() { // Gunakan setStateSB untuk update dialog
                            selectedDate = picked;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 10),
                    if (fase['fase_detail_type'] == 1 && pupukRekomendasi != null) ...[
                      const Text('Rekomendasi Pupuk (Kg)'),
                      const SizedBox(height: 5),
                      ...pupukRekomendasi.entries.map((entry) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('${entry.key}: ${entry.value} Kg'),
                          ],
                        ),
                      )).toList(),
                      const SizedBox(height: 15),
                      const Text('Jumlah Pupuk Aktual (Kg)'),
                      const SizedBox(height: 5),
                      ...pupukAktualControllers.entries.map((entry) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: TextField(
                          controller: entry.value,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: entry.key,
                            border: const OutlineInputBorder(),
                            suffixText: 'Kg',
                          ),
                        ),
                      )).toList(),
                    ],
                    const SizedBox(height: 10),
                    TextField(
                      controller: deskripsiController,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        labelText: 'Deskripsi Aksi',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    if (fase['fase_detail_type'] == 4)
                      Padding(
                        padding: const EdgeInsets.only(top: 10.0),
                        child: TextField(
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(
                            labelText: 'Jumlah Panen (KG)',
                            border: OutlineInputBorder(),
                          ),
                          controller: TextEditingController(text: (_tanamData!['petani_tanam_panen_qty'] ?? 0).toString()),
                          onChanged: (value) {
                            // Update nilai di _tanamData sementara
                            _tanamData!['petani_tanam_panen_qty'] = num.tryParse(value);
                          },
                        ),
                      ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Batal'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    Navigator.pop(context);

                    Map<String, dynamic> pupukActualData = {};
                    if (fase['fase_detail_type'] == 1) {
                      pupukAktualControllers.forEach((key, controller) {
                        pupukActualData[key] = num.tryParse(controller.text) ?? 0;
                      });
                    }
                    
                    await _updateFaseData(
                      faseIndex: faseIndex, // Menggunakan faseIndex yang diterima
                      isDone: true,
                      actionDate: selectedDate,
                      description: deskripsiController.text,
                      pupukAktual: pupukActualData,
                      panenQty: fase['fase_detail_type'] == 4 ? _tanamData!['petani_tanam_panen_qty'] : null,
                    );
                  },
                  child: const Text('Simpan Aksi'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Fungsi untuk memperbarui data fase di Firestore
  Future<void> _updateFaseData({
    required int faseIndex,
    required bool isDone,
    required DateTime actionDate,
    String? description,
    Map<String, dynamic>? pupukAktual,
    num? panenQty,
  }) async {
    try {
      DocumentSnapshot doc = await _firestore.collection('jadwal_tanam').doc(widget.tanamId).get();
      if (!doc.exists) return;

      Map<String, dynamic> tanamData = doc.data() as Map<String, dynamic>;
      List<dynamic> fases = tanamData['fase'] ?? [];

      if (faseIndex < 0 || faseIndex >= fases.length) return;

      Map<String, dynamic> updatedFase = Map.from(fases[faseIndex]);
      updatedFase['pt_detail_is_open'] = isDone ? 0 : 1;
      updatedFase['pt_detail_date_act'] = Timestamp.fromDate(actionDate);
      updatedFase['pt_detail_desc'] = description;

      if (pupukAktual != null && pupukAktual.isNotEmpty) {
        updatedFase['pt_detail_data_pupuk_act'] = pupukAktual;
      }

      if (updatedFase['fase_detail_type'] == 4 && panenQty != null) {
        tanamData['petani_tanam_panen_date'] = Timestamp.fromDate(actionDate);
        tanamData['petani_tanam_panen_qty'] = panenQty;
        tanamData['petani_tanam_is_panen'] = 1;
      }

      fases[faseIndex] = updatedFase;

      await _firestore.collection('jadwal_tanam').doc(widget.tanamId).update({
        'fase': fases,
        'petani_tanam_panen_date': tanamData['petani_tanam_panen_date'],
        'petani_tanam_panen_qty': tanamData['petani_tanam_panen_qty'],
        'petani_tanam_is_panen': tanamData['petani_tanam_is_panen'],
        'updatedAt': FieldValue.serverTimestamp(),
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Aksi berhasil disimpan!')),
      );
      _fetchTanamData();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal menyimpan aksi: $e')),
      );
      print("Error updating fase data: $e");
    }
  }


  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Detail Jadwal Tanam', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.green,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: _tanamData?['lahanId'] ?? '')),
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
          title: const Text('Detail Jadwal Tanam', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.green,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: _tanamData?['lahanId'] ?? '')),
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
                  onPressed: _fetchTanamData,
                  child: const Text('Coba Lagi'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final tanamDate = (_tanamData!['petani_tanam_date'] as Timestamp).toDate();
    final panenDate = (_tanamData!['petani_tanam_panen_date'] as Timestamp?)?.toDate();
    final varietasName = _tanamData!['varietas_name'] ?? 'N/A';
    final panenQty = _tanamData!['petani_tanam_panen_qty'];
    final jadwalDay = DateTime.now().difference(tanamDate).inDays;
    final List<dynamic> fases = _tanamData!['fase'] ?? []; // Pastikan 'fases' didefinisikan di sini


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
                          MaterialPageRoute(builder: (context) => LahanDetailPage(lahanId: _tanamData!['lahanId'])),
                        );
                      },
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      "Fase Tanam",
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
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Card(
                    elevation: 3,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Align(
                            alignment: Alignment.topRight,
                            child: IconButton(
                              icon: const Icon(Icons.close, color: Colors.grey),
                              onPressed: () {
                                Navigator.pop(context);
                              },
                            ),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    varietasName.toUpperCase(),
                                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 8),
                                  Text('Tgl Tanam : ${DateFormat('dd-MM-yyyy').format(tanamDate)}'),
                                  Text('Tgl Panen : ${panenDate != null ? DateFormat('dd-MM-yyyy').format(panenDate) : '-'}'),
                                  Text('Jml Panen : ${panenQty != null ? NumberFormat.compact().format(panenQty) + ' KG' : '-'}'),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'Hari ke - $jadwalDay',
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    print("Data AUT clicked!");
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.yellow[700],
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Data AUT'),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: _confirmDeleteTanam,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Hapus'),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  Text(
                    "Detail jadwal tanam",
                    style: Theme.of(context).textTheme.titleMedium!.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  if (fases.isNotEmpty)
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: fases.length,
                      itemBuilder: (context, index) {
                        final fase = fases[index];
                        final faseType = fase['fase_detail_type'] as int? ?? 0;
                        final faseNama = fase['fase_detail_nama'] as String? ?? 'Aktivitas Tidak Diketahui';
                        final dateFrom = (fase['pt_detail_date_from'] as Timestamp).toDate();
                        final dateTo = (fase['pt_detail_date_to'] as Timestamp).toDate();
                        final isDone = (fase['pt_detail_is_open'] as int? ?? 1) == 0;

                        return Card(
                          margin: const EdgeInsets.only(bottom: 10),
                          elevation: 2,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          child: InkWell(
                            onTap: () {
                              // Panggil _showAksiFaseDialog dengan index dan data fase
                              _showAksiFaseDialog(index, fase); // <<< PERBAIKAN DI SINI
                            },
                            child: Padding(
                              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                              child: Row(
                                children: [
                                  Image.asset(
                                    _getFaseDetailIcon(faseType),
                                    width: 30,
                                    height: 30,
                                    errorBuilder: (context, error, stackTrace) => const Icon(Icons.image_not_supported),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '${DateFormat('dd/MM').format(dateFrom)} - ${DateFormat('dd/MM/yyyy').format(dateTo)}',
                                          style: const TextStyle(fontSize: 14, color: Colors.grey),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          faseNama,
                                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                                        ),
                                      ],
                                    ),
                                  ),
                                  if (isDone)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.green,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: const Text(
                                        'DONE',
                                        style: TextStyle(color: Colors.white, fontSize: 10),
                                      ),
                                    ),
                                  const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    )
                  else
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text('Tidak ada fase tanam yang tercatat.'),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}