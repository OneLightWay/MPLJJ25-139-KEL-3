import 'package:flutter/material.dart';
import 'lokasi-lahan-detail.dart';

class EditLokasiLahanPage extends StatefulWidget {
  @override
  _EditLokasiLahanPageState createState() => _EditLokasiLahanPageState();
}

class _EditLokasiLahanPageState extends State<EditLokasiLahanPage> {
  final _formKey = GlobalKey<FormState>();

  String? selectedSatuan;
  String? selectedProvinsi;
  String? selectedKota;
  String? selectedKecamatan;
  String? selectedKelurahan;

  final TextEditingController namaLahanController = TextEditingController();
  final TextEditingController luasLahanController = TextEditingController();
  final TextEditingController luasHaController = TextEditingController();
  final TextEditingController alamatController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Edit Lokasi Lahan',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: BackButton(
          color: Colors.white,
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const LahanDetailPage()),
            );
          },
        ),
        backgroundColor: Colors.green,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: namaLahanController,
                decoration: InputDecoration(
                  labelText: 'Nama Lahan',
                  hintText: 'Masukkan nama lahan',
                ),
                validator:
                    (value) => value!.isEmpty ? 'Nama lahan wajib diisi' : null,
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedSatuan,
                items:
                    ['ha', 'm²', 'are'].map((String satuan) {
                      return DropdownMenuItem<String>(
                        value: satuan,
                        child: Text(satuan),
                      );
                    }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedSatuan = value;
                  });
                },
                decoration: InputDecoration(labelText: 'Satuan Luas'),
                validator:
                    (value) =>
                        value == null ? 'Satuan luas wajib dipilih' : null,
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: luasLahanController,
                decoration: InputDecoration(labelText: 'Luas Lahan'),
                keyboardType: TextInputType.number,
                validator:
                    (value) => value!.isEmpty ? 'Luas lahan wajib diisi' : null,
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: luasHaController,
                decoration: InputDecoration(labelText: 'Luas Lahan (Hektar)'),
                readOnly: true,
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedProvinsi,
                items:
                    ['Sumatera Barat'].map((String provinsi) {
                      return DropdownMenuItem<String>(
                        value: provinsi,
                        child: Text(provinsi),
                      );
                    }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedProvinsi = value;
                  });
                },
                decoration: InputDecoration(labelText: 'Provinsi'),
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKota,
                items:
                    ['Padang'].map((String kota) {
                      return DropdownMenuItem<String>(
                        value: kota,
                        child: Text(kota),
                      );
                    }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedKota = value;
                  });
                },
                decoration: InputDecoration(labelText: 'Kota'),
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKecamatan,
                items:
                    ['Nanggalo'].map((String kec) {
                      return DropdownMenuItem<String>(
                        value: kec,
                        child: Text(kec),
                      );
                    }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedKecamatan = value;
                  });
                },
                decoration: InputDecoration(labelText: 'Kecamatan'),
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedKelurahan,
                items:
                    ['Kelurahan A'].map((String kel) {
                      return DropdownMenuItem<String>(
                        value: kel,
                        child: Text(kel),
                      );
                    }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedKelurahan = value;
                  });
                },
                decoration: InputDecoration(labelText: 'Kelurahan'),
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: alamatController,
                decoration: InputDecoration(labelText: 'Alamat'),
                validator:
                    (value) => value!.isEmpty ? 'Alamat wajib diisi' : null,
              ),
              SizedBox(height: 20),
              Container(
                height: 200,
                color: Colors.grey[300],
                alignment: Alignment.center,
                child: Text('Peta lokasi (placeholder)'),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  minimumSize: Size(double.infinity, 40),
                ),
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    // Simpan data
                  }
                },
                child: Text('Simpan', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
