class AppTranslations {
  static const Map<String, String> _amharic = {
    // Nav & General
    'Book': 'ያዙ',
    'Trips': 'ጉዞዎች',
    'Settings': 'ቅንብሮች',
    'ETB': 'ብር',
    'English': 'እንግሊዝኛ',
    'Amharic': 'አማርኛ',
    'Welcome back, {0}! 👋': 'እንኳን ደህና መጡ፣ {0}! 👋',
    'Ready to book your next bus journey?': 'ቀጣዩን የአውቶቡስ ጉዞዎን ለመያዝ ዝግጁ ነዎት?',

    // Map & Arrivals
    'Track Nearby Buses': 'በአቅራቢያ ያሉ አውቶቡሶችን ይከታተሉ',
    'Live location enabled': 'ቀጥታ አካባቢ ነቅቷል',
    'Tap to enable location': 'አካባቢን ለማንቃት ይንኩ',
    'Open': 'ክፈት',
    'Upcoming Buses': 'በቅርብ የሚመጡ አውቶቡሶች',
    '{0} buses': '{0} አውቶቡሶች',
    'to {0}': 'ወደ {0}',
    '{0} min': '{0} ደቂቃ',
    'Arriving now': 'አሁን እየደረሰ ነው',
    'Seats available': 'መቀመጫዎች አሉ',
    'Filling up': 'እየሞላ ነው',
    'Almost full': 'ሊሞላ ተቃርቧል',
    'Buy Ticket': 'ቲኬት ግዛ',

    // Modal
    'Route Information': 'የመንገድ መረጃ',
    'Current Status': 'የአሁኑ ሁኔታ',
    'Next Stops': 'ቀጣይ ማቆሚያዎች',
    'Bus Amenities': 'የአውቶቡስ መገልገያዎች',
    'Driver Information': 'የሹፌር መረጃ',
    'Ticket Price': 'የቲኬት ዋጋ',
    'Per passenger': 'በአንድ ተሳፋሪ',
    'One way': 'አንድ መንገድ',
    'Track Live': 'በቀጥታ ተከታተል',

    // Seat Selection
    'Select Seat(s)': 'መቀመጫ(ዎች) ይምረጡ',
    'Available': 'ይገኛል',
    'Selected': 'ተመርጧል',
    'Occupied': 'ተይዟል',
    'Standing position': 'የቆሚያ ቦታ',
    'Seat plan': 'የመቀመጫ አሰራር',
    'Info': 'መረጃ',
    'Review': 'ግምገማ',

    // Stations
    'Addis Ababa': 'አዲስ አበባ',
    'Meskel Square': 'መስቀል አደባባይ',
    'Bole Airport': 'ቦሌ ኤርፖርት',
    'Merkato': 'መርካቶ',
    'Piazza': 'ፒያሳ',
    'Stadium': 'ስታዲየም',

    // Booking & Ticket
    'Select Fare Type': 'የክፍያ ዓይነት ይምረጡ',
    'Seated Passengers': 'የተቀመጡ ተሳፋሪዎች',
    'Confirm Booking ({0} ETB)': 'ቦታ ማስያዝ አረጋግጥ ({0} ብር)',
    'Ticket Purchased!': 'ቲኬት ገዝተዋል!',
    'Confirmed': 'ተረጋግጧል',
    'SmartBus Ticket': 'የSmartBus ቲኬት',
    'My Trips': 'ጉዞዎቼ',
    'Active ({0})': 'ንቁ ({0})',
    'History ({0})': 'ታሪክ ({0})',

    // Login & Register
    'Welcome to SmartBus': 'እንኳን ወደ SmartBus በደህና መጡ',
    'Sign in to book your bus tickets': 'የአውቶቡስ ቲኬቶችዎን ለመያዝ ይግቡ',
    'Email': 'ኢሜይል',
    'Password': 'የይለፍ ቃል',
    'Sign In': 'ግባ',
    'Create Account': 'መለያ ይፍጠሩ',
    "Don't have an account?": 'መለያ የለዎትም?',
    'Already have an account?': 'መለያ አለዎት?',

    // Profile & Settings
    'Personal Information': 'የግል መረጃ',
    'Full Name': 'ሙሉ ስም',
    'Phone Number': 'ስልክ ቁጥር',
    'Location': 'አካባቢ',
    'Save': 'አስቀምጥ',
    'Appearance': 'መልክ',
    'Theme': 'ገጽታ',
    'Language': 'ቋንቋ',
    'Notifications': 'ማስታወቂያዎች',
  };

  static String translate(String key, String language, [List<dynamic>? args]) {
    String text = key;
    if (language == 'am' && _amharic.containsKey(key)) {
      text = _amharic[key]!;
    }

    if (args != null) {
      for (int i = 0; i < args.length; i++) {
        text = text.replaceAll('{$i}', args[i].toString());
      }
    }
    return text;
  }
}
