import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import 'package:cloud_firestore/cloud_firestore.dart'; // Import Firestore
import 'package:firebase_auth/firebase_auth.dart';     // Import FirebaseAuth

import 'package:agricare/pages/home_page.dart'; // Pastikan path ini benar

class JadwalTanamPage extends StatefulWidget {
  const JadwalTanamPage({super.key}); // Tambahkan const constructor

  @override
  State<JadwalTanamPage> createState() => _JadwalTanamPageState();
}

class _JadwalTanamPageState extends State<JadwalTanamPage> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Map<DateTime, List<String>> _events = {}; // Menggantikan _jadwal simulasi
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay; // Set selected day ke hari ini saat inisialisasi
    _fetchJadwalData(); // Memuat data jadwal dari Firestore
  }

  Future<void> _fetchJadwalData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _events = {}; // Bersihkan event lama saat memuat baru
    });

    final user = _auth.currentUser;
    if (user == null) {
      setState(() {
        _errorMessage = "Anda harus login untuk melihat jadwal tanam.";
        _isLoading = false;
      });
      return;
    }

    try {
      final QuerySnapshot jadwalSnapshot = await _firestore
          .collection('jadwal_tanam')
          .where('userId', isEqualTo: user.uid)
          .get();

      final Map<DateTime, List<String>> loadedEvents = {};

      for (var doc in jadwalSnapshot.docs) {
        final data = doc.data() as Map<String, dynamic>;
        final String? lahanName = data['lahanName']; // Ambil nama lahan
        final String? varietasName = data['varietas_name'];

        // Tambahkan tanggal tanam utama
        if (data['petani_tanam_date'] is Timestamp) {
          final DateTime tanamDate = (data['petani_tanam_date'] as Timestamp).toDate();
          final normalizedTanamDate = DateTime.utc(tanamDate.year, tanamDate.month, tanamDate.day);
          
          final String eventText = '${lahanName != null ? '$lahanName - ' : ''}${varietasName ?? 'Tanaman'} (Tanam Awal)';
          loadedEvents.update(normalizedTanamDate, (value) => value..add(eventText), ifAbsent: () => [eventText]);
        }

        // Tambahkan fase-fase tanam
        if (data['fase'] is List) {
          for (var faseItem in (data['fase'] as List)) {
            if (faseItem is Map<String, dynamic> && faseItem['pt_detail_date_from'] is Timestamp) {
              final DateTime faseDate = (faseItem['pt_detail_date_from'] as Timestamp).toDate();
              final normalizedFaseDate = DateTime.utc(faseDate.year, faseDate.month, faseDate.day);
              
              final String faseEventText = '${lahanName != null ? '$lahanName - ' : ''}${faseItem['fase_detail_nama'] ?? 'Fase Tak Dikenal'}';
              loadedEvents.update(normalizedFaseDate, (value) => value..add(faseEventText), ifAbsent: () => [faseEventText]);

              // Jika ada fase yang memiliki rentang tanggal, Anda bisa menambahkan event untuk setiap hari dalam rentang tersebut
              // Atau hanya untuk tanggal mulai dan berakhir seperti di bawah ini
              if (faseItem['pt_detail_date_to'] is Timestamp) {
                final DateTime faseEndDate = (faseItem['pt_detail_date_to'] as Timestamp).toDate();
                if (!isSameDay(normalizedFaseDate, faseEndDate)) { // Hindari duplikasi jika start dan end sama
                  final normalizedFaseEndDate = DateTime.utc(faseEndDate.year, faseEndDate.month, faseEndDate.day);
                  final String faseEndEventText = '${lahanName != null ? '$lahanName - ' : ''}${faseItem['fase_detail_nama'] ?? 'Fase Tak Dikenal'} (Berakhir)';
                  loadedEvents.update(normalizedFaseEndDate, (value) => value..add(faseEndEventText), ifAbsent: () => [faseEndEventText]);
                }
              }
            }
          }
        }
      }

      setState(() {
        _events = loadedEvents;
        _isLoading = false;
      });
    } catch (e) {
      _errorMessage = "Gagal memuat jadwal tanam: $e";
      print("Error fetching jadwal tanam for calendar: $e");
      setState(() {
        _isLoading = false;
      });
    }
  }

  List<String> _getJadwalForDay(DateTime day) {
    // Normalisasi tanggal untuk memastikan kunci map cocok
    final normalizedDay = DateTime.utc(day.year, day.month, day.day);
    return _events[normalizedDay] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    final selectedDateFormatted = _selectedDay != null
        ? DateFormat('d MMMM yyyy', 'id_ID').format(_selectedDay!) // PERBAIKAN FORMAT TANGGAL
        : '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Jadwal Tanam', style: TextStyle(color: Colors.white)),
        leading: BackButton(
          color: Colors.white,
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const HomePage()),
            );
          },
        ),
        backgroundColor: Colors.green,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Image.asset('assets/images/icons/icon_agricare.png', height: 30),
          ),
        ],
      ),
      body: Column(
        children: [
          TableCalendar(
            firstDay: DateTime.utc(2020, 1, 1), // Perbaikan: Pastikan bulan dan hari valid
            lastDay: DateTime.utc(2030, 12, 31), // Perbaikan: Pastikan bulan dan hari valid
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            calendarFormat: CalendarFormat.month,
            startingDayOfWeek: StartingDayOfWeek.monday,
            calendarStyle: const CalendarStyle(
              todayDecoration: BoxDecoration(
                color: Colors.blueAccent,
                shape: BoxShape.circle,
              ),
              selectedDecoration: BoxDecoration(
                color: Colors.deepPurple,
                shape: BoxShape.circle,
              ),
              markerDecoration: BoxDecoration(
                color: Colors.green, // Warna marker untuk event
                shape: BoxShape.circle,
              ),
            ),
            headerStyle: HeaderStyle( // Tambahkan HeaderStyle untuk menampilkan judul bulan
              formatButtonVisible: false, // Sembunyikan tombol format
              titleCentered: true,
              titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              // leftMakersAutoVisibility: false, // Menghilangkan tombol panah kiri jika tidak ada bulan sebelumnya
              // rightMakersAutoVisibility: false, // Menghilangkan tombol panah kanan jika tidak ada bulan berikutnya
            ),
            // Tambahkan eventLoader di sini
            eventLoader: _getJadwalForDay,
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Jadwal Tanam',
                style: Theme.of(context).textTheme.titleMedium!.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ),
          if (_selectedDay != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  selectedDateFormatted,
                  style: const TextStyle(
                    color: Colors.green,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          const SizedBox(height: 8),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _errorMessage != null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Text(
                            _errorMessage!,
                            textAlign: TextAlign.center,
                            style: const TextStyle(color: Colors.red),
                          ),
                        ),
                      )
                    : _buildJadwalList(), // Tampilkan daftar jadwal
          ),
        ],
      ),
    );
  }

  Widget _buildJadwalList() {
    final list = _selectedDay != null ? _getJadwalForDay(_selectedDay!) : [];
    if (list.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center, // Pusatkan secara vertikal
          children: [
            Image.asset('assets/calender/tambah-event.png', height: 120),
            const SizedBox(height: 10),
            const Text(
              'Anda belum isi data tanam\ndi Lahan Anda untuk tanggal ini', // Pesan lebih spesifik
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: list.length,
      itemBuilder: (context, index) {
        return Card(
          color: Colors.green.shade600, // Warna card jadwal
          margin: const EdgeInsets.only(bottom: 10),
          child: ListTile(
            leading: const Icon(Icons.circle, color: Colors.white, size: 12), // Ikon kecil
            title: Text(
              list[index],
              style: const TextStyle(color: Colors.white),
            ),
            onTap: () {
              // Aksi lihat detail jadwal tanam.
              // Anda bisa meneruskan ID jadwal tanam ke halaman DetailTanamPage
              print("Lihat detail: ${list[index]}");
            },
          ),
        );
      },
    );
  }
}