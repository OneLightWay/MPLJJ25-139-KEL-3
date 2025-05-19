import 'package:flutter/material.dart';
import '../widgets/footer.dart';
import 'dashboard_page.dart';
import 'artikel_page.dart';
import 'profile_page.dart';
// import 'explore_page.dart';
// import 'scan_page.dart';
// import 'profile_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  List<Widget> _buildPages() { 
    return[
      const DashboardPage(),
      ArtikelPage(onBack: () {
        setState(() {
          _selectedIndex = 0;
        });
      }),
      Center(child: Text('Scan')),
      Center(child: Text('Terdekat')),
      const ProfilePage(),
      // const ExplorePage(),
      // const ScanPage(),
      // const ProfilePage(),
    ];
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildPages()[_selectedIndex],
      bottomNavigationBar: Footer(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
