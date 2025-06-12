import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geocoding/geocoding.dart';

class MapSelectionPage extends StatefulWidget {
  final LatLng? initialLocation; // Lokasi awal pin (opsional)
  final String? initialAddress; // Alamat awal (opsional)

  const MapSelectionPage({
    super.key,
    this.initialLocation,
    this.initialAddress,
  });

  @override
  State<MapSelectionPage> createState() => _MapSelectionPageState();
}

class _MapSelectionPageState extends State<MapSelectionPage> {
  LatLng _selectedLocation = const LatLng(-0.940892, 100.354157); // Default Padang
  Set<Marker> _markers = {};
  GoogleMapController? _mapController;
  String _selectedAddress = "Mencari lokasi..."; // Alamat yang dipilih

  @override
  void initState() {
    super.initState();
    if (widget.initialLocation != null) {
      _selectedLocation = widget.initialLocation!;
    }
    _markers.add(
      Marker(
        markerId: const MarkerId('selected_location'),
        position: _selectedLocation,
        draggable: true, // Bisa digeser
        onDragEnd: _onMarkerDragEnd, // Handle saat pin selesai digeser
      ),
    );
    _getAddressFromLatLng(_selectedLocation);
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
    // Pindahkan kamera ke lokasi awal setelah peta dibuat
    _mapController?.animateCamera(CameraUpdate.newLatLngZoom(_selectedLocation, 15));
  }

  void _onTap(LatLng latLng) {
    setState(() {
      _selectedLocation = latLng;
      _markers.clear();
      _markers.add(
        Marker(
          markerId: const MarkerId('selected_location'),
          position: _selectedLocation,
          draggable: true,
          onDragEnd: _onMarkerDragEnd,
        ),
      );
    });
    _getAddressFromLatLng(_selectedLocation);
  }

  void _onMarkerDragEnd(LatLng newPosition) {
    setState(() {
      _selectedLocation = newPosition;
    });
    _getAddressFromLatLng(_selectedLocation);
  }

  Future<void> _getAddressFromLatLng(LatLng latLng) async {
  try {
    List<Placemark> placemarks = await placemarkFromCoordinates(latLng.latitude, latLng.longitude);
    if (placemarks.isNotEmpty) {
      Placemark place = placemarks.first;
      setState(() {
        _selectedAddress = '${place.street}, ${place.subLocality}, ${place.locality}, ${place.administrativeArea}, ${place.country}';
      });
    } else {
      setState(() {
        _selectedAddress = 'Alamat tidak ditemukan';
      });
    }
  } catch (e) {
    setState(() {
      _selectedAddress = 'Gagal mengambil alamat: $e';
    });
    print("Error getting address: $e");
  }
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pilih Lokasi Lahan'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          GoogleMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: CameraPosition(
              target: _selectedLocation, // Akan diupdate di onMapCreated
              zoom: 12,
            ),
            markers: _markers,
            onTap: _onTap,
            myLocationButtonEnabled: true,
            myLocationEnabled: true,
          ),
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Lokasi Dipilih:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 5),
                    Text('Lat: ${_selectedLocation.latitude.toStringAsFixed(6)}, Long: ${_selectedLocation.longitude.toStringAsFixed(6)}'),
                    Text('Alamat: $_selectedAddress'),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          // Kembali ke halaman sebelumnya dengan LatLng yang dipilih
                          Navigator.pop(context, _selectedLocation);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text('Simpan Lokasi Ini'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}