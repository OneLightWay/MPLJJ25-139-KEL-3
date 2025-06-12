import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';

class CuacaPage extends StatefulWidget {
  const CuacaPage({super.key});

  @override
  State<CuacaPage> createState() => _CuacaPageState();
}

class _CuacaPageState extends State<CuacaPage> {
  final String _apiKey =
      '3d403ffd4da1a967b5471f0fcde29367'; // API key OpenWeatherMap Anda
  final String _currentWeatherApiBaseUrl =
      'https://api.openweathermap.org/data/2.5/weather';
  final String _forecastApiBaseUrl =
      'https://api.openweathermap.org/data/2.5/forecast';
  final String _geocodingApiBaseUrl =
      'http://api.openweathermap.org/geo/1.0/direct';

  Map<String, dynamic>? _currentWeather;
  List<dynamic>? _forecastWeatherList;
  bool _isLoading = true;
  String? _errorMessage;

  String _userLocationDisplay = "Lokasi tidak diketahui";
  double? _latitude;
  double? _longitude;

  @override
  void initState() {
    super.initState();
    Intl.defaultLocale = 'id_ID';
    _fetchUserLocationAndWeatherData();
  }

  String _cleanLocationName(String name) {
    name =
        name
            .replaceAll(
              RegExp(r'^(KOTA|KABUPATEN)\s+', caseSensitive: false),
              '',
            )
            .trim();
    return name;
  }

  Future<void> _fetchUserLocationAndWeatherData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      User? currentUser = FirebaseAuth.instance.currentUser;
      if (currentUser == null) {
        throw Exception("Pengguna tidak terautentikasi. Silakan login.");
      }
      String userId = currentUser.uid;

      DatabaseReference userRef = FirebaseDatabase.instance
          .ref()
          .child('users')
          .child(userId);
      DataSnapshot snapshot = await userRef.get();

      String? kabupatenRaw;
      String? provinsi;
      double? firebaseLat;
      double? firebaseLon;

      if (snapshot.exists && snapshot.value is Map) {
        Map<dynamic, dynamic> userData =
            snapshot.value as Map<dynamic, dynamic>;
        kabupatenRaw = userData['kabupaten'] as String?;
        provinsi = userData['provinsi'] as String?;
        firebaseLat = (userData['latitude'] as num?)?.toDouble();
        firebaseLon = (userData['longitude'] as num?)?.toDouble();

        if (kabupatenRaw != null && provinsi != null) {
          _userLocationDisplay = "$kabupatenRaw, $provinsi";
        } else {
          print(
            "Data kabupaten atau provinsi tidak ditemukan untuk pengguna ini.",
          );
          _userLocationDisplay = "Lokasi tidak lengkap di profil";
        }
      } else {
        throw Exception("Data pengguna tidak ditemukan di database.");
      }

      if (firebaseLat != null && firebaseLon != null) {
        _latitude = firebaseLat;
        _longitude = firebaseLon;
        print(
          'Koordinat diambil dari Firebase: Lat=$_latitude, Lon=$_longitude',
        );
      } else if (kabupatenRaw != null) {
        print('Koordinat tidak ditemukan di Firebase, mencoba geocoding...');
        String cleanedKabupaten = _cleanLocationName(kabupatenRaw);

        // --- PERUBAHAN UTAMA ADA DI BARIS BERIKUT ---
        // Kueri hanya dengan nama kabupaten yang sudah dibersihkan
        final String locationQuery = "$cleanedKabupaten";
        // --- AKHIR PERUBAHAN UTAMA ---

        final geocodingUrl = Uri.parse(
          '$_geocodingApiBaseUrl?q=$locationQuery&limit=1&appid=$_apiKey',
        );
        final geocodingResponse = await http.get(geocodingUrl);

        if (geocodingResponse.statusCode == 200) {
          List<dynamic> geoData = json.decode(geocodingResponse.body);
          if (geoData.isNotEmpty) {
            _latitude = geoData[0]['lat'];
            _longitude = geoData[0]['lon'];
            print(
              'Koordinat ditemukan via geocoding: Lat=$_latitude, Lon=$_longitude',
            );
            if (geoData[0]['name'] != null && geoData[0]['country'] != null) {
              _userLocationDisplay =
                  "${geoData[0]['name']}, ${geoData[0]['country']}";
            }
          } else {
            throw Exception(
              "Koordinat tidak ditemukan untuk lokasi '$locationQuery' via geocoding.",
            );
          }
        } else {
          throw Exception(
            'Gagal mendapatkan koordinat via geocoding: ${geocodingResponse.statusCode} - ${geocodingResponse.body}',
          );
        }
      } else {
        throw Exception(
          "Nama lokasi (kabupaten) tidak tersedia untuk geocoding atau di Firebase.",
        );
      }

      if (_latitude == null || _longitude == null) {
        throw Exception("Koordinat lokasi tidak tersedia untuk memuat cuaca.");
      }

      final currentWeatherUrl = Uri.parse(
        '$_currentWeatherApiBaseUrl?lat=$_latitude&lon=$_longitude&appid=$_apiKey&units=metric&lang=id',
      );
      final currentWeatherResponse = await http.get(currentWeatherUrl);

      if (currentWeatherResponse.statusCode == 200) {
        _currentWeather = json.decode(currentWeatherResponse.body);
        if (_currentWeather!['name'] != null &&
            _currentWeather!['sys']['country'] != null) {
          _userLocationDisplay =
              "${_currentWeather!['name']}, ${_currentWeather!['sys']['country']}";
        }
      } else {
        throw Exception(
          'Gagal memuat cuaca saat ini: ${currentWeatherResponse.statusCode} - ${currentWeatherResponse.body}',
        );
      }

      final forecastUrl = Uri.parse(
        '$_forecastApiBaseUrl?lat=$_latitude&lon=$_longitude&appid=$_apiKey&units=metric&lang=id',
      );
      final forecastResponse = await http.get(forecastUrl);

      if (forecastResponse.statusCode == 200) {
        _forecastWeatherList = json.decode(forecastResponse.body)['list'];
      } else {
        throw Exception(
          'Gagal memuat perkiraan cuaca: ${forecastResponse.statusCode} - ${forecastResponse.body}',
        );
      }
    } catch (e) {
      _errorMessage =
          'Gagal memuat data cuaca: $e. Pastikan koneksi internet Anda stabil, kunci API Anda benar, dan koordinat lokasi tersedia.';
      print('Error fetching weather data: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  String _getWeatherIcon(dynamic weatherData) {
    String description;
    String iconCode;

    if (weatherData is List && weatherData.isNotEmpty) {
      description = weatherData[0]['description'].toLowerCase();
      iconCode = weatherData[0]['icon'];
    } else {
      description = 'unknown';
      iconCode = '01d';
    }

    String iconPath = 'assets/images/weather/';
    if (description.contains('clear sky') || description.contains('cerah')) {
      return '${iconPath}cerah.png';
    } else if (description.contains('clouds') ||
        description.contains('berawan')) {
      if (description.contains('scattered clouds') ||
          description.contains('few clouds')) {
        return '${iconPath}cerah-berawan.png';
      }
      return '${iconPath}berawan.png';
    } else if (description.contains('rain') ||
        description.contains('drizzle') ||
        description.contains('hujan')) {
      return '${iconPath}hujan.png';
    } else if (description.contains('thunderstorm') ||
        description.contains('badai')) {
      return '${iconPath}hujan-badai.png';
    } else if (description.contains('snow') || description.contains('salju')) {
      return '${iconPath}salju.png';
    } else if (description.contains('mist') ||
        description.contains('fog') ||
        description.contains('kabut')) {
      return '${iconPath}kabut.png';
    }

    return '${iconPath}berawan.png';
  }

  List<Map<String, dynamic>> _getDailyForecasts(List<dynamic>? forecastList) {
    if (forecastList == null || forecastList.isEmpty) {
      return [];
    }

    Map<String, Map<String, dynamic>> dailyForecasts = {};
    DateTime now = DateTime.now();

    for (var item in forecastList) {
      DateTime forecastTime = DateTime.fromMillisecondsSinceEpoch(
        item['dt'] * 1000,
      );
      String dateKey = DateFormat('yyyy-MM-dd').format(forecastTime);

      if (forecastTime.isAfter(now.add(const Duration(hours: 3))) &&
          !dailyForecasts.containsKey(dateKey)) {
        dailyForecasts[dateKey] = {
          'date': forecastTime,
          'description': item['weather'][0]['description'],
          'icon': item['weather'],
          'temp_max': item['main']['temp_max'],
          'temp_min': item['main']['temp_min'],
        };
      } else if (dailyForecasts.containsKey(dateKey)) {
        dailyForecasts[dateKey]!['temp_max'] =
            (dailyForecasts[dateKey]!['temp_max'] > item['main']['temp_max'])
                ? dailyForecasts[dateKey]!['temp_max']
                : item['main']['temp_max'];
        dailyForecasts[dateKey]!['temp_min'] =
            (dailyForecasts[dateKey]!['temp_min'] < item['main']['temp_min'])
                ? dailyForecasts[dateKey]!['temp_min']
                : item['main']['temp_min'];
      }
    }
    List<Map<String, dynamic>> sortedForecasts = dailyForecasts.values.toList();
    sortedForecasts.sort(
      (a, b) => (a['date'] as DateTime).compareTo(b['date'] as DateTime),
    );

    return sortedForecasts.take(5).toList();
  }

  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> dailyForecasts = _getDailyForecasts(
      _forecastWeatherList,
    );

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.green, Colors.greenAccent],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: AppBar(
            title: const Text("Cuaca"),
            backgroundColor: Colors.transparent,
            elevation: 0,
            foregroundColor: Colors.white,
          ),
        ),
      ),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _errorMessage != null
              ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        color: Colors.red,
                        size: 50,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        _errorMessage!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.red, fontSize: 16),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _fetchUserLocationAndWeatherData,
                        child: const Text('Coba Lagi'),
                      ),
                    ],
                  ),
                ),
              )
              : SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      // Current Weather Section
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: const [
                            BoxShadow(color: Colors.black12, blurRadius: 8),
                          ],
                        ),
                        child: Column(
                          children: [
                            Text(
                              _userLocationDisplay,
                              style: const TextStyle(color: Colors.grey),
                            ),
                            const SizedBox(height: 12),
                            if (_currentWeather != null &&
                                _currentWeather!['weather'] != null)
                              Image.asset(
                                _getWeatherIcon(_currentWeather!['weather']),
                                width: 100,
                              )
                            else
                              const Icon(
                                Icons.cloud_off,
                                size: 100,
                                color: Colors.grey,
                              ),
                            const SizedBox(height: 12),
                            Text(
                              _currentWeather != null &&
                                      _currentWeather!['weather'] != null
                                  ? _currentWeather!['weather'][0]['description']
                                  : "Tidak ada data",
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _currentWeather != null
                                  ? DateFormat(
                                    'EEEE, dd MMMM yyyy',
                                    'id_ID',
                                  ) // <<< PERBAIKAN: Gunakan 'yyyy'
                                  .format(
                                    DateTime.fromMillisecondsSinceEpoch(
                                      _currentWeather!['dt'] * 1000,
                                    ),
                                  )
                                  : "Tanggal tidak diketahui",
                            ),
                            const SizedBox(height: 12),
                            Text(
                              _currentWeather != null
                                  ? "${_currentWeather!['main']['temp']?.round()}℃"
                                  : "--℃",
                              style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          "Perkiraan Cuaca",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Forecast Weather Section
                      if (dailyForecasts.isNotEmpty)
                        ...dailyForecasts.map((item) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: const [
                                BoxShadow(color: Colors.black12, blurRadius: 4),
                              ],
                            ),
                            child: Row(
                              children: [
                                if (item['icon'] != null)
                                  Image.asset(
                                    _getWeatherIcon(item['icon']),
                                    width: 40,
                                  )
                                else
                                  const Icon(
                                    Icons.cloud_off,
                                    size: 40,
                                    color: Colors.grey,
                                  ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item['description'],
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      Text(
                                        DateFormat(
                                          'EEEE, dd MMMM yyyy',
                                          'id_ID',
                                        ).format(item['date']),
                                        style: const TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  "${item['temp_max']?.round()}° / ${item['temp_min']?.round()}°",
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList()
                      else
                        const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text(
                            "Tidak ada data perkiraan cuaca yang tersedia.",
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
      backgroundColor: const Color(0xFFF2F2F2),
    );
  }
}
