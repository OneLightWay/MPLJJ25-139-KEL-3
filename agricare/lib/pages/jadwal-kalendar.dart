import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import 'home_page.dart';

class JadwalTanamPage extends StatefulWidget {
  @override
  _JadwalTanamPageState createState() => _JadwalTanamPageState();
}

class _JadwalTanamPageState extends State<JadwalTanamPage> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  // Simulasi data jadwal tanam
  final Map<DateTime, List<String>> _jadwal = {
    DateTime(2025, 5, 18): [],
    DateTime(2025, 5, 23): [
      'Lahan Anonim (Tanam + Pupuk Dasar + Perlakuan Benih)',
    ],
  };

  List<String> _getJadwalForDay(DateTime day) {
    return _jadwal[DateTime(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    final selectedDateFormatted = _selectedDay != null
        ? DateFormat('d MMMM yyyy', 'id_ID').format(_selectedDay!)
        : '';

    return Scaffold(
      appBar: AppBar(
        title: Text('Jadwal Tanam'),
        leading: BackButton(
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
            firstDay: DateTime.utc(2020),
            lastDay: DateTime.utc(2030),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) =>
                isSameDay(_selectedDay, day),
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            calendarFormat: CalendarFormat.month,
            startingDayOfWeek: StartingDayOfWeek.monday,
            calendarStyle: CalendarStyle(
              todayDecoration: BoxDecoration(
                color: Colors.blueAccent,
                shape: BoxShape.circle,
              ),
              selectedDecoration: BoxDecoration(
                color: Colors.deepPurple,
                shape: BoxShape.circle,
              ),
              markerDecoration: BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
              ),
            ),
            eventLoader: _getJadwalForDay,
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Jadwal Tanam',
                style: TextStyle(
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
                  style: TextStyle(
                    color: Colors.green,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          const SizedBox(height: 8),
          Expanded(
            child: _buildJadwalList(),
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
          children: [
            Image.asset('assets/calender/tambah-event.png', height: 120), // ikon traktor
            const SizedBox(height: 10),
            const Text(
              'Anda belum isi data tanam\ndi Lahan Anda',
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
          color: Colors.pinkAccent.shade100,
          margin: const EdgeInsets.only(bottom: 10),
          child: ListTile(
            leading: Icon(Icons.circle, color: Colors.white),
            title: Text(
              list[index],
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              // Aksi lihat detail
            },
          ),
        );
      },
    );
  }
}
