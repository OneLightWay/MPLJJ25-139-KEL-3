import 'package:flutter/material.dart';
import 'login_page.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({Key? key}) : super(key: key);

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  String? selectedProvince;
  String? selectedCity;
  String? selectedDistrict;
  String? selectedSubdistrict;

  final Map<String, Map<String, Map<String, List<String>>>> wilayah = {
    'Jawa Barat': {
      'Bandung': {
        'Coblong': ['Dago', 'Lebak Gede'],
        'Sukajadi': ['Pasteur', 'Sukagalih'],
      },
      'Bekasi': {
        'Bekasi Timur': ['Duren Jaya', 'Aren Jaya'],
        'Bekasi Barat': ['Bintara', 'Kranji'],
      },
    },
    'DKI Jakarta': {
      'Jakarta Selatan': {
        'Kebayoran Baru': ['Gandaria', 'Senayan'],
        'Pasar Minggu': ['Pejaten', 'Ragunan'],
      },
    },
  };

  List<String> get cities =>
      selectedProvince != null ? wilayah[selectedProvince!]!.keys.toList() : [];

  List<String> get districts =>
      selectedProvince != null && selectedCity != null
          ? wilayah[selectedProvince!]![selectedCity!]!.keys.toList()
          : [];

  List<String> get subdistricts =>
      selectedProvince != null &&
              selectedCity != null &&
              selectedDistrict != null
          ? wilayah[selectedProvince!]![selectedCity!]![selectedDistrict!]!
          : [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFFFFFFF), Color(0xFF2EC83D)],
            stops: [0.0, 1.0],
            transform: GradientRotation(2.93),
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const SizedBox(height: 20),
                const Text(
                  "Daftar Akun",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2E2E2E),
                  ),
                ),
                const SizedBox(height: 16),
                const CustomInputField(
                  icon: Icons.person,
                  hintText: 'Nama Lengkap',
                ),
                const SizedBox(height: 12),
                const CustomInputField(icon: Icons.email, hintText: 'Email'),
                const SizedBox(height: 12),
                const CustomInputField(
                  icon: Icons.lock,
                  hintText: 'Password',
                  obscureText: true,
                ),
                const SizedBox(height: 12),
                const CustomInputField(icon: Icons.home, hintText: 'Alamat'),
                const SizedBox(height: 12),
                const CustomInputField(
                  icon: Icons.phone,
                  hintText: 'No. Telepon',
                ),
                const SizedBox(height: 16),

                // Dropdown Provinsi
                DropdownButtonFormField<String>(
                  value: selectedProvince,
                  hint: const Text("Pilih Provinsi"),
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                  items:
                      wilayah.keys.map((prov) {
                        return DropdownMenuItem(value: prov, child: Text(prov));
                      }).toList(),
                  onChanged: (val) {
                    setState(() {
                      selectedProvince = val;
                      selectedCity = null;
                      selectedDistrict = null;
                      selectedSubdistrict = null;
                    });
                  },
                ),
                const SizedBox(height: 12),

                // Dropdown Kota/Kabupaten
                DropdownButtonFormField<String>(
                  value: selectedCity,
                  hint: const Text("Pilih Kab./Kota"),
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                  items:
                      cities.map((city) {
                        return DropdownMenuItem(value: city, child: Text(city));
                      }).toList(),
                  onChanged: (val) {
                    setState(() {
                      selectedCity = val;
                      selectedDistrict = null;
                      selectedSubdistrict = null;
                    });
                  },
                ),
                const SizedBox(height: 12),

                // Dropdown Kecamatan
                DropdownButtonFormField<String>(
                  value: selectedDistrict,
                  hint: const Text("Pilih Kecamatan"),
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                  items:
                      districts.map((dist) {
                        return DropdownMenuItem(value: dist, child: Text(dist));
                      }).toList(),
                  onChanged: (val) {
                    setState(() {
                      selectedDistrict = val;
                      selectedSubdistrict = null;
                    });
                  },
                ),
                const SizedBox(height: 12),

                // Dropdown Kelurahan
                DropdownButtonFormField<String>(
                  value: selectedSubdistrict,
                  hint: const Text("Pilih Kelurahan"),
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                  items:
                      subdistricts.map((sub) {
                        return DropdownMenuItem(value: sub, child: Text(sub));
                      }).toList(),
                  onChanged: (val) {
                    setState(() => selectedSubdistrict = val);
                  },
                ),
                const SizedBox(height: 24),

                SizedBox(
                  width: double.infinity,
                  height: 45,
                  child: ElevatedButton(
                    onPressed: () {
                      // Validasi & navigasi ke halaman berikutnya
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Registrasi berhasil!")),
                      );
                      // Setelah validasi sukses
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const LoginPage(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2EC83D),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Daftar',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Sudah punya akun?',
                      style: TextStyle(fontSize: 16, color: Color(0xFF666666)),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginPage(),
                          ),
                        );
                      },
                      child: const Text(
                        'Masuk Disini',
                        style: TextStyle(
                          fontSize: 16,
                          color: Color(0xFF2EC83D),
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class CustomInputField extends StatelessWidget {
  final IconData icon;
  final String hintText;
  final bool obscureText;

  const CustomInputField({
    Key? key,
    required this.icon,
    required this.hintText,
    this.obscureText = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: TextField(
        obscureText: obscureText,
        decoration: InputDecoration(
          icon: Icon(icon, color: const Color(0xFF8C8C91)),
          border: InputBorder.none,
          hintText: hintText,
          hintStyle: const TextStyle(fontSize: 16, color: Color(0xFF8C8C91)),
        ),
      ),
    );
  }
}
