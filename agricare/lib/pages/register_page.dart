import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';
import 'login_page.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final DatabaseReference dbRef = FirebaseDatabase.instance.ref("wilayah");

  String? selectedProvince;
  String? selectedCity;
  String? selectedDistrict;
  String? selectedSubdistrict;

  List<Map<String, String>> provinces = [];
  List<Map<String, String>> cities = [];
  List<Map<String, String>> districts = [];
  List<Map<String, String>> subdistricts = [];

  @override
  void initState() {
    super.initState();
    fetchProvinces();
  }

  Future<void> fetchProvinces() async {
    final snapshot = await dbRef.child('provinsi').get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> provList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        provList.add({'id': val['id'], 'name': val['name']});
      });
      setState(() {
        provinces = provList;
      });
    }
  }

  Future<void> fetchCities(String provinceId) async {
    final snapshot =
        await dbRef
            .child('kabupaten_kota')
            .orderByChild('id_provinsi')
            .equalTo(provinceId)
            .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> cityList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        cityList.add({'id': val['id'], 'name': val['name']});
      });
      setState(() {
        cities = cityList;
      });
    }
  }

  Future<void> fetchDistricts(String cityId) async {
    final snapshot =
        await dbRef
            .child('kecamatan')
            .orderByChild('id_kabupaten_kota')
            .equalTo(cityId)
            .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> distList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        distList.add({'id': val['id'], 'name': val['name']});
      });
      setState(() {
        districts = distList;
      });
    }
  }

  Future<void> fetchSubdistricts(String districtId) async {
    final snapshot =
        await dbRef
            .child('desa_kelurahan')
            .orderByChild('id_kecamatan')
            .equalTo(districtId)
            .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final List<Map<String, String>> subList = [];
      data.forEach((key, value) {
        final val = Map<String, dynamic>.from(value);
        subList.add({'id': val['id'], 'name': val['name']});
      });
      setState(() {
        subdistricts = subList;
      });
    }
  }

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
                      provinces.map((prov) {
                        return DropdownMenuItem(
                          value: prov['id'],
                          child: Text(prov['name']!),
                        );
                      }).toList(),
                  onChanged: (val) {
                    setState(() {
                      selectedProvince = val;
                      selectedCity = null;
                      selectedDistrict = null;
                      selectedSubdistrict = null;
                      cities = [];
                      districts = [];
                      subdistricts = [];
                    });
                    if (val != null) fetchCities(val);
                  },
                ),
                const SizedBox(height: 12),

                // Dropdown Kota
                DropdownButtonFormField<String>(
                  value: selectedCity,
                  hint: const Text("Pilih Kab./Kota"),
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                  items:
                      cities.map((city) {
                        return DropdownMenuItem(
                          value: city['id'],
                          child: Text(city['name']!),
                        );
                      }).toList(),
                  onChanged: (val) {
                    setState(() {
                      selectedCity = val;
                      selectedDistrict = null;
                      selectedSubdistrict = null;
                      districts = [];
                      subdistricts = [];
                    });
                    if (val != null) fetchDistricts(val);
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
                        return DropdownMenuItem(
                          value: dist['id'],
                          child: Text(dist['name']!),
                        );
                      }).toList(),
                  onChanged: (val) {
                    setState(() {
                      selectedDistrict = val;
                      selectedSubdistrict = null;
                      subdistricts = [];
                    });
                    if (val != null) fetchSubdistricts(val);
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
                        return DropdownMenuItem(
                          value: sub['id'],
                          child: Text(sub['name']!),
                        );
                      }).toList(),
                  onChanged: (val) {
                    setState(() {
                      selectedSubdistrict = val;
                    });
                  },
                ),
                const SizedBox(height: 24),

                // Tombol Daftar
                SizedBox(
                  width: double.infinity,
                  height: 45,
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Registrasi berhasil!")),
                      );
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
    super.key,
    required this.icon,
    required this.hintText,
    this.obscureText = false,
  });

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
