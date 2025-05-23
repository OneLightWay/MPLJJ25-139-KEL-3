import 'package:flutter/material.dart';

class CuacaPage extends StatelessWidget {
  const CuacaPage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> forecast = [
      {
        "title": "Awan Tersebar",
        "date": "Kamis, 22 Mei 2025",
        "temp": "31° / 27°",
        "icon": "assets/images/weather/berawan.png"
      },
      {
        "title": "Sedikit Berawan",
        "date": "Jumat, 23 Mei 2025",
        "temp": "31° / 27°",
        "icon": "assets/images/weather/cerah-berawan.png"
      },
      {
        "title": "Hujan Rintik-Rintik",
        "date": "Sabtu, 24 Mei 2025",
        "temp": "31° / 27°",
        "icon": "assets/images/weather/hujan-badai.png"
      },
      {
        "title": "Sedikit Berawan",
        "date": "Minggu, 25 Mei 2025",
        "temp": "31° / 27°",
        "icon": "assets/images/weather/hujan.png"
      },
    ];

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.green, Colors.greenAccent],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: AppBar(
            title: const Text("Cuaca"),
            backgroundColor: Colors.transparent,
            elevation: 0,
            foregroundColor: Colors.white,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: const [
                    BoxShadow(color: Colors.black12, blurRadius: 8)
                  ],
                ),
                child: Column(
                  children: [
                    const Text(
                      "Harau, Kabupaten Lima Puluh Kota",
                      style: TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 12),
                    Image.asset(
                      "assets/images/weather/cerah-berawan.png",
                      width: 100,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      "Sedikit Berawan",
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    const Text("Rabu, 21 Mei 2025"),
                    const SizedBox(height: 12),
                    const Text(
                      "28.4℃",
                      style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "Perkiraan Cuaca",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 12),
              ...forecast.map((item) => Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: const [
                        BoxShadow(color: Colors.black12, blurRadius: 4)
                      ],
                    ),
                    child: Row(
                      children: [
                        Image.asset(
                          item['icon']!,
                          width: 40,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item['title']!,
                                style: const TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w600),
                              ),
                              Text(item['date']!,
                                  style: const TextStyle(color: Colors.grey)),
                            ],
                          ),
                        ),
                        Text(
                          item['temp']!,
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w500),
                        )
                      ],
                    ),
                  ))
            ],
          ),
        ),
      ),
      backgroundColor: const Color(0xFFF2F2F2),
    );
  }
}
