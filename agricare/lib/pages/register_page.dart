import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'login_page.dart';

bool isValidEmail(String email) {
  final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
  return emailRegex.hasMatch(email);
}

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _auth = FirebaseAuth.instance;
  final DatabaseReference dbRef = FirebaseDatabase.instance.ref("wilayah");

  // Controllers
  final TextEditingController _namaController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _alamatController = TextEditingController();
  final TextEditingController _teleponController = TextEditingController();

  // Lokasi
  String? selectedProvince;
  String? selectedCity;
  String? selectedDistrict;
  String? selectedSubdistrict;

  List<Map<String, dynamic>> provinces = [];
  List<Map<String, dynamic>> cities = [];
  List<Map<String, dynamic>> districts = [];
  List<Map<String, dynamic>> subdistricts = [];

  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    fetchProvinces();
  }

  // Ambil data lokasi dari Firebase Realtime Database
  Future<void> fetchProvinces() async {
    final snapshot = await dbRef.child('provinsi').get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final provList =
          data.entries.map((e) {
            final val = Map<String, dynamic>.from(e.value);
            return {'id': val['id'], 'name': val['name']};
          }).toList();
      setState(() => provinces = provList);
    }
  }

  Future<void> fetchCities(String provId) async {
    final snapshot =
        await dbRef
            .child('kabupaten_kota')
            .orderByChild('id_provinsi')
            .equalTo(provId)
            .get();
    if (snapshot.exists) {
      final data = Map<String, dynamic>.from(snapshot.value as Map);
      final cityList =
          data.entries.map((e) {
            final val = Map<String, dynamic>.from(e.value);
            return {'id': val['id'], 'name': val['name']};
          }).toList();
      setState(() => cities = cityList);
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
      final districtList =
          data.entries.map((e) {
            final val = Map<String, dynamic>.from(e.value);
            return {'id': val['id'], 'name': val['name']};
          }).toList();
      setState(() => districts = districtList);
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
      final subList =
          data.entries.map((e) {
            final val = Map<String, dynamic>.from(e.value);
            return {'id': val['id'], 'name': val['name']};
          }).toList();
      setState(() => subdistricts = subList);
    }
  }

  Future<void> _register() async {
    if (_namaController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _passwordController.text.length < 6 ||
        selectedProvince == null ||
        selectedCity == null ||
        selectedDistrict == null ||
        selectedSubdistrict == null) {
      setState(() {
        _errorMessage = "Mohon isi semua data dengan benar.";
      });
      return;
    }

    if (!isValidEmail(_emailController.text.trim())) {
      setState(() {
        _errorMessage = "Email tidak valid.";
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // 🔍 Cek apakah email sudah dipakai
      final signInMethods = await _auth.fetchSignInMethodsForEmail(
        _emailController.text.trim(),
      );
      if (signInMethods.isNotEmpty) {
        setState(() {
          _errorMessage = "Email sudah terdaftar. Gunakan email lain.";
          _isLoading = false;
        });
        return;
      }
      
      final credential = await _auth.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      await credential.user!.sendEmailVerification();

      // Tambahan: simpan info user ke Firebase Realtime Database (opsional)
      await FirebaseDatabase.instance.ref("users/${credential.user!.uid}").set({
        "nama": _namaController.text.trim(),
        "email": _emailController.text.trim(),
        "alamat": _alamatController.text.trim(),
        "telepon": _teleponController.text.trim(),
        "provinsi_id": selectedProvince,
        "kabupaten_id": selectedCity,
        "kecamatan_id": selectedDistrict,
        "kelurahan_id": selectedSubdistrict,
        "provinsi":
            provinces.firstWhere((e) => e['id'] == selectedProvince)['name'],
        "kabupaten": cities.firstWhere((e) => e['id'] == selectedCity)['name'],
        "kecamatan":
            districts.firstWhere((e) => e['id'] == selectedDistrict)['name'],
        "kelurahan":
            subdistricts.firstWhere(
              (e) => e['id'] == selectedSubdistrict,
            )['name'],
      });

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
    } on FirebaseAuthException catch (e) {
      print('FirebaseAuthException: ${e.code} - ${e.message}');
      setState(() => _errorMessage = e.message);
    } catch (e) {
      print('Other exception: $e');
      setState(() => _errorMessage = 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.white, Color(0xFF2EC83D)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            stops: [0, 1],
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
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                CustomInputField(
                  controller: _namaController,
                  icon: Icons.person,
                  hintText: 'Nama Lengkap',
                ),
                const SizedBox(height: 12),
                CustomInputField(
                  controller: _emailController,
                  icon: Icons.email,
                  hintText: 'Email',
                ),
                const SizedBox(height: 12),
                CustomInputField(
                  controller: _passwordController,
                  icon: Icons.lock,
                  hintText: 'Password',
                  obscureText: true,
                ),
                const SizedBox(height: 12),
                CustomInputField(
                  controller: _alamatController,
                  icon: Icons.home,
                  hintText: 'Alamat',
                ),
                const SizedBox(height: 12),
                CustomInputField(
                  controller: _teleponController,
                  icon: Icons.phone,
                  hintText: 'No. Telepon',
                ),
                const SizedBox(height: 16),

                // Dropdown lokasi
                _buildDropdown("Pilih Provinsi", provinces, selectedProvince, (
                  val,
                ) {
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
                }),
                const SizedBox(height: 12),
                _buildDropdown("Pilih Kab./Kota", cities, selectedCity, (val) {
                  setState(() {
                    selectedCity = val;
                    selectedDistrict = null;
                    selectedSubdistrict = null;
                    districts = [];
                    subdistricts = [];
                  });
                  if (val != null) fetchDistricts(val);
                }),
                const SizedBox(height: 12),
                _buildDropdown("Pilih Kecamatan", districts, selectedDistrict, (
                  val,
                ) {
                  setState(() {
                    selectedDistrict = val;
                    selectedSubdistrict = null;
                    subdistricts = [];
                  });
                  if (val != null) fetchSubdistricts(val);
                }),
                const SizedBox(height: 12),
                _buildDropdown(
                  "Pilih Kelurahan",
                  subdistricts,
                  selectedSubdistrict,
                  (val) {
                    setState(() => selectedSubdistrict = val);
                  },
                ),
                const SizedBox(height: 20),

                if (_errorMessage != null)
                  Text(
                    _errorMessage!,
                    style: const TextStyle(color: Colors.red),
                  ),

                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  height: 45,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _register,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2EC83D),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child:
                        _isLoading
                            ? const CircularProgressIndicator(
                              color: Colors.white,
                            )
                            : const Text(
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
                      style: TextStyle(fontSize: 16),
                    ),
                    TextButton(
                      onPressed:
                          () => Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const LoginPage(),
                            ),
                          ),
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

  Widget _buildDropdown(
    String hint,
    List<Map<String, dynamic>> items,
    String? selectedValue,
    ValueChanged<String?> onChanged,
  ) {
    return DropdownButtonFormField<String>(
      value: selectedValue,
      hint: Text(hint),
      decoration: const InputDecoration(border: OutlineInputBorder()),
      items:
          items
              .map(
                (item) => DropdownMenuItem<String>(
                  value: item['id'],
                  child: Text(item['name']!),
                ),
              )
              .toList(),
      onChanged: onChanged,
    );
  }
}

class CustomInputField extends StatelessWidget {
  final IconData icon;
  final String hintText;
  final TextEditingController controller;
  final bool obscureText;

  const CustomInputField({
    super.key,
    required this.icon,
    required this.hintText,
    required this.controller,
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
        controller: controller,
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
