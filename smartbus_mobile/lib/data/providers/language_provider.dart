import 'package:flutter/foundation.dart';

class LanguageProvider extends ChangeNotifier {
  String _language = 'en'; // 'en' or 'am'

  String get language => _language;
  bool get isAmharic => _language == 'am';

  void setLanguage(String lang) {
    if (lang == 'en' || lang == 'am') {
      _language = lang;
      notifyListeners();
    }
  }

  void toggleLanguage() {
    _language = _language == 'en' ? 'am' : 'en';
    notifyListeners();
  }
}
