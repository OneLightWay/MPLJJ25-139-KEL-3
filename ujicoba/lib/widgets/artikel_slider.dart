import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class ArtikelSlider extends StatelessWidget {
  const ArtikelSlider({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> imageUrls = [
      'assets/images/informasi/NK_7207_NK_Naga1718105533.png',
      'assets/images/informasi/NK_8103_NK_Fantastis1718102822.png',
      'assets/images/informasi/NK_2121718102515.png',
    ];

    return CarouselSlider(
      options: CarouselOptions(
        height: 180.0,
        autoPlay: true,
        enlargeCenterPage: true,
        viewportFraction: 0.85,
      ),
      items: imageUrls.map((url) {
        return Builder(
          builder: (BuildContext context) {
            return GestureDetector(
              onTap: () {
                // Aksi ketika klik gambar slider
              },
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(url, fit: BoxFit.cover, width: double.infinity),
              ),
            );
          },
        );
      }).toList(),
    );
  }
}
