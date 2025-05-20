import 'package:flutter/material.dart';
import '../widgets/artikel_slider.dart';
import '../widgets/artikel_card.dart';

class ArtikelPage extends StatelessWidget {
  final VoidCallback onBack;
  const ArtikelPage({super.key, required this.onBack});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        children: [
          Stack(
            children: [
              Container(height: 75, color: Colors.black.withOpacity(0.1)),
              Container(height: 75, color: const Color(0xFF32b368).withOpacity(0.9)),
              Positioned(
                bottom: 20,
                left: 20,
                child: Text(
                  "Artikel",
                  style: const TextStyle(
                    fontSize: 20,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Positioned(
                right: 20,
                top: 20,
                child: Image.asset('assets/images/icons/icon_agricare.png', width: 25,height: 50,),
              ),
              // Positioned(
              //   right: 20,
              //   top: 40,
              //   child: IconButton(
              //     icon: const Icon(Icons.arrow_back, color: Colors.white),
              //     // onPressed: () => Navigator.pop(context),
              //     onPressed: onBack,
              //   ),
              // )

            ],
          ),

          // Artikel Terbaru - Slider
          // Padding(
          //   padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          //   child: Row(
          //     children: [
          //       Container(
          //         decoration: const BoxDecoration(
          //           border: Border(
          //             left: BorderSide(color: Color(0xFF32b368), width: 3),
          //           ),
          //         ),
          //         padding: const EdgeInsets.only(left: 5),
          //         child: const Text(
          //           "Artikel Terbaru",
          //           style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          //         ),
          //       ),
          //     ],
          //   ),
          // ),
          // const ArtikelSlider(),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 5),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(13),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        decoration: const BoxDecoration(
                          border: Border(
                            left: BorderSide(color: Color(0xFF32b368), width: 3),
                          ),
                        ),
                        padding: const EdgeInsets.only(left: 5),
                        child: const Text(
                          "Artikel Terbaru",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  const ArtikelSlider(),
                ],
              ),
            ),
          ),


          // Artikel Lainnya - Header + Search + Card
          Padding(
            padding: const EdgeInsets.fromLTRB(15, 20, 15, 10),
            child: Row(
              children: [
                const Expanded(
                  child: Text(
                    "Artikel Lainnya",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.filter_list, color: Color(0xFF32b368)),
                  onPressed: () {
                    // Tambahkan modal filter
                  },
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15),
            child: TextField(
              decoration: InputDecoration(
                hintText: "Cari Artikel",
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(6),
                  borderSide: const BorderSide(color: Color(0xFFCCD0D9)),
                ),
                filled: true,
                fillColor: const Color(0xFFF9F9F9),
              ),
            ),
          ),

          // List Artikel
          const ArtikelCard(
            imageUrl: 'assets/images/informasi/NK_7207_NK_Naga1718105533.png',
            category: 'Informasi Umum',
            title: 'NK 7207 | NK Naga',
            views: 2316,
          ),
          const ArtikelCard(
            imageUrl: 'assets/images/informasi/TOKO_ONLINE_NK1700644396.png',
            category: 'Informasi Promosi',
            title: 'TOKO ONLINE NK!',
            views: 1517,
          ),
          const ArtikelCard(
            imageUrl: 'assets/images/informasi/TUKAR_POIN_ANDA1717388339.png',
            category: 'Informasi Umum',
            title: 'SAKSIKAN PENGUNDIAN PETANI FESTIVAL DISINI!',
            views: 7684,
          ),

          Padding(
            padding: const EdgeInsets.all(20),
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF8CC152)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text(
                "Lihat Lainnya",
                style: TextStyle(color: Color(0xFF8CC152)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
