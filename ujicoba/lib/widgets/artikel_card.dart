import 'package:flutter/material.dart';

class ArtikelCard extends StatelessWidget {
  final String imageUrl;
  final String category;
  final String title;
  final int views;

  const ArtikelCard({
    super.key,
    required this.imageUrl,
    required this.category,
    required this.title,
    required this.views,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 15, vertical: 8),
      leading: ClipRRect(
        borderRadius: BorderRadius.circular(6),
        child: Image.network(imageUrl, width: 60, height: 60, fit: BoxFit.cover),
      ),
      title: Text(
        title,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
      ),
      subtitle: Row(
        children: [
          Text(
            category,
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
          const SizedBox(width: 10),
          const Icon(Icons.remove_red_eye, size: 14, color: Colors.grey),
          const SizedBox(width: 4),
          Text(
            views.toString(),
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 14),
      onTap: () {
        // Aksi saat klik artikel
      },
    );
  }
}
