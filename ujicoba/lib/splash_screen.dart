// import 'package:flutter/material.dart';

// void main() {
//   runApp(const MaterialApp(
//     debugShowCheckedModeBanner: false,
//     home: SplashScreen(),
//   ));
// }

// class SplashScreen extends StatefulWidget {
//   const SplashScreen({super.key});

//   @override
//   State<SplashScreen> createState() => _SplashScreenState();
// }

// class _SplashScreenState extends State<SplashScreen> {
//   final PageController _pageController = PageController();
//   int _currentIndex = 0;

//   final List<_SlideData> slides = [
//   _SlideData(
//     backgroundImage: 'assets/images/pictures/1.png',
//     image: '',
//     title: '',
//     description: '',
//   ),
//   _SlideData(
//     backgroundImage: 'assets/images/pictures/2.png',
//     image: 'assets/images/pictures/2-icon.png',
//     title: 'Informasi lengkap',
//     description: 'Mengenai bantuan tanam, jadwal budidaya hingga berita terbaru khusus untukmu.',
//   ),
//   _SlideData(
//     backgroundImage: 'assets/images/pictures/3.png',
//     image: 'assets/images/pictures/3-icon.png',
//     title: 'Rencanakan',
//     description: 'Jadwal tanam, analisa kebutuhan dengan kalkulator aplikasi bisa kapan saja.',
//   ),
//   _SlideData(
//     backgroundImage: 'assets/images/pictures/4.png',
//     image: 'assets/images/pictures/4-icon.png',
//     title: 'Lacak dimana saja',
//     description: 'Sales, kios, trader dan petani terdekatmu.',
//   ),
//   _SlideData(
//     backgroundImage: 'assets/images/pictures/5.png',
//     image: 'assets/images/pictures/5-icon.png',
//     title: 'Hitung pengeluaran',
//     description: 'Dengan detail dan keuntungan dari panen lahanmu.',
//   ),
// ];

//   void _nextPage() {
//     if (_currentIndex < slides.length - 1) {
//       _pageController.animateToPage(
//         _currentIndex + 1,
//         duration: const Duration(milliseconds: 300),
//         curve: Curves.easeInOut,
//       );
//     } else {
//       // TODO: Navigasi ke halaman berikutnya
//       debugPrint("Selesai splash");
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Stack(
//         children: [
//           PageView.builder(
//             controller: _pageController,
//             itemCount: slides.length,
//             onPageChanged: (index) => setState(() => _currentIndex = index),
//             itemBuilder: (context, index) {
//               final slide = slides[index];
//               return Container(
//                 decoration: BoxDecoration(
//                   image: DecorationImage(
//                     image: AssetImage(slide.backgroundImage),
//                     fit: BoxFit.cover,
//                   ),
//                 ),
//                 child: Container(
//                   color: Colors.black.withOpacity(0.0), // Overlay gelap agar teks terlihat
//                   child: Padding(
//                     padding: const EdgeInsets.all(32.0),
//                     child: Column(
//                       mainAxisAlignment: MainAxisAlignment.center,
//                       children: [
//                         if (slide.image.isNotEmpty)
//                           Image.asset(slide.image, height: 100),
//                         const SizedBox(height: 20),
//                         Text(
//                           slide.title,
//                           style: const TextStyle(
//                             fontSize: 20,
//                             fontWeight: FontWeight.bold,
//                             color: Colors.white,
//                           ),
//                           textAlign: TextAlign.center,
//                         ),
//                         const SizedBox(height: 10),
//                         Text(
//                           slide.description,
//                           style: const TextStyle(
//                             fontSize: 16,
//                             color: Colors.white,
//                           ),
//                           textAlign: TextAlign.center,
//                         ),
//                       ],
//                     ),
//                   ),
//                 ),
//               );
//             },
//           ),
//           Positioned(
//             bottom: 40,
//             left: 20,
//             right: 20,
//             child: Column(
//               children: [
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: List.generate(
//                     slides.length,
//                     (index) => AnimatedContainer(
//                       duration: const Duration(milliseconds: 300),
//                       margin: const EdgeInsets.symmetric(horizontal: 4),
//                       width: _currentIndex == index ? 16 : 8,
//                       height: 8,
//                       decoration: BoxDecoration(
//                         color: _currentIndex == index ? Colors.white : Colors.white54,
//                         borderRadius: BorderRadius.circular(4),
//                       ),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 20),
//                 ElevatedButton(
//                   onPressed: _nextPage,
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: Colors.white,
//                     foregroundColor: Colors.green,
//                     padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
//                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
//                   ),
//                   child: Text(_currentIndex == slides.length - 1 ? 'Selesai' : 'Lanjut'),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// class _SlideData {
//   final String image;
//   final String title;
//   final String description;
//   final String backgroundImage;

//   _SlideData({
//     required this.image,
//     required this.title,
//     required this.description,
//     required this.backgroundImage,
//   });
// }