import 'package:agricare/pages/lokasi-lahan.dart';
import 'package:flutter/material.dart';
import 'package:agricare/pages/cuaca_page.dart';

class DashboardMenu extends StatelessWidget {
  const DashboardMenu({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 20),
      child:
      // Grid.view ika  ingin selalu 3 kolom tidak peduli ukuran layar
      GridView.count(
        crossAxisCount: 3,
        shrinkWrap: true,
        physics:
            NeverScrollableScrollPhysics(), // agar tidak konflik dengan scroll luar
        padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
        mainAxisSpacing: 15,
        crossAxisSpacing: 15,

        //Wrap akan otomatis membuat 3 item per baris jika lebar layar cukup dan width: 105
        // Wrap(
        //   spacing: 10, // Jarak horizontal antar item
        //   runSpacing: 10, // Jarak vertikal antar baris
        //   alignment: WrapAlignment.center, // Biar item ditengah
        children: [
          dashboardItem(
            image: 'assets/images/dashboard/cuaca.png',
            title: 'Cuaca',
            onTap: () => onPage(context, CuacaPage()),
          ),
          dashboardItem(
            image: 'assets/images/dashboard/jadwal-tanam.png',
            title: 'Jadwal Tanam',
            onTap: () => onPage(context, CuacaPage()),
          ),
          dashboardItem(
            image: 'assets/images/dashboard/lokasi-lahan.png',
            title: 'Lahan Anda',
            onTap: () => onPage(context, LahanPage()),
          ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/jagung-informasi-syngenta.png',
          //   title: 'Budidaya',
          //   onTap: () => onPage(context, 'budidaya'),
          // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/rekom-produk.png',
          //   title: 'Rekomendasi Produk',
          //   onTap: () => onPage(context, 'rekomendasi-produk'),
          // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/aut.png',
          //   title: 'Analisa Usaha Tani',
          //   onTap: () => onPage(context, 'petani-roi'),
          // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/kal-aplikasi.png',
          //   title: 'Kalkulator Benih',
          //   onTap: () => onPage(context, 'kalkulasi-kebutuhan-benih'),
          // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/kal-dosis-pupuk.png',
          //   title: 'Kalkulator Pupuk',
          //   onTap: () => onPage(context, 'kalkulasi-dosis-pupuk'),
          // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/hpt-hama.png',
          //   title: 'Hama Penyakit',
          //   onTap: () => onPage(context, 'hpt-hamatanaman'),
          // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/kios.png',
          //   title: 'List Kios',
          //   onTap: () => onPage(context, 'list-kios'),
          // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/trader.png',
          //   title: 'List Trader',
          //   onTap: () => onPage(context, 'list-trader'),
          // ),
          // //Stack(
          //   //children: [
          //     dashboardItem(
          //       image: 'assets/images/dashboard/dokter-nk.png',
          //       title: 'Dokter NK',
          //       onTap: () => onPage(context, 'dokternk-list-chat'),
          //     ),
          //   //   Positioned(
          //   //     top: 8,
          //   //     right: 8,
          //   //     child: Container(
          //   //       width: 25,
          //   //       height: 25,
          //   //       alignment: Alignment.center,
          //   //       decoration: const BoxDecoration(
          //   //         color: Colors.red,
          //   //         shape: BoxShape.circle,
          //   //       ),
          //   //       child: const Text(
          //   //         '!',
          //   //         style: TextStyle(
          //   //           color: Colors.white,
          //   //           fontWeight: FontWeight.bold,
          //   //         ),
          //   //       ),
          //   //     ),
          //   //   ),
          //   // ],
          // // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/toko_online_nk.png',
          //   title: 'Toko Online NK',
          //   onTap: () => onPage(context, 'list-ecommerce'),
          // ),
          // dashboardItem(
          //   image: 'assets/images/dashboard/nk-care.png',
          //   title: 'NK Care',
          //   onTap: () => onPage(context, 'customer-feedback'),
          // ),
        ],
      ),
    );
  }

  Widget dashboardItem({
    required String image,
    required String title,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 105,
        height: 130,
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFF4CAF50),
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4)],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(image, height: 50),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void onPage(BuildContext context, Widget page) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    );
  }
}
