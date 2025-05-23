import 'package:flutter/material.dart';
import 'lokasi-lahan.dart';
import 'lokasi-lahan-edit.dart';

class LahanDetailPage extends StatelessWidget {
  const LahanDetailPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Header hijau
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
                          MaterialPageRoute(
                            builder: (context) => const LahanPage(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      "Detail Lahan",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Image.asset(
                  'assets/images/icons/icon_agricare.png', // Ganti dengan logo kamu
                  height: 32,
                ),
              ],
            ),
          ),

          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // === Data Lahan ===
                    _buildSectionCard(
                      context,
                      title: "Data Lahan",
                      actions: [
                        IconButton(
                          icon: const Icon(Icons.edit, color: Colors.green),
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (context) => EditLokasiLahanPage(),
                              ),
                            );
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () {},
                        ),
                      ],
                      children: [
                        _buildLabel("Nama lahan", "Lahan Anonim"),
                        _buildLabel("Luas Lahan (ha)", "2"),
                        _buildLabel(
                          "Alamat",
                          "Anonim Rumah, Nanggalo, Kota Padang, Sumatera Barat",
                        ),
                        const SizedBox(height: 10),
                        Container(
                          height: 150,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                            color: Colors.grey[300],
                          ),
                          alignment: Alignment.center,
                          child: const Text("Map Placeholder"),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // === Data Tanam ===
                    _buildSectionCard(
                      context,
                      title: "Data Tanam",
                      actions: [
                        IconButton(
                          icon: const Icon(
                            Icons.swap_horiz,
                            color: Colors.grey,
                          ),
                          onPressed: () {},
                        ),
                        IconButton(
                          icon: const Icon(Icons.add, color: Colors.blue),
                          onPressed: () {},
                        ),
                      ],
                      children: [
                        Card(
                          elevation: 2,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            children: [
                              Container(
                                decoration: const BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: BorderRadius.vertical(
                                    top: Radius.circular(12),
                                  ),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: const [
                                    Text(
                                      "NK6501",
                                      style: TextStyle(color: Colors.white),
                                    ),
                                    Text(
                                      "Hari ke - 3",
                                      style: TextStyle(color: Colors.white),
                                    ),
                                  ],
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(12.0),
                                child: Image.asset(
                                  'assets/images/fase/1.png',
                                  height: 120,
                                ),
                              ),
                              const Divider(),
                              ListTile(
                                title: const Text("Ketuk untuk detail"),
                                trailing: const Icon(
                                  Icons.arrow_forward_ios,
                                  size: 16,
                                ),
                                onTap: () {},
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard(
    BuildContext context, {
    required String title,
    required List<Widget> children,
    List<Widget>? actions,
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium!.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (actions != null) ...actions,
              ],
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String title, String value) {
    Color labelColor = Colors.green;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: RichText(
        text: TextSpan(
          style: const TextStyle(fontSize: 14),
          children: [
            TextSpan(text: "$title\n", style: TextStyle(color: labelColor)),
            TextSpan(
              text: value,
              style: const TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
