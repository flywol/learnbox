export interface CountryState {
  name: string;
  code: string;
}

export interface Country {
  name: string;
  code: string;
  states: CountryState[];
}

export const africanCountriesStates: Country[] = [
  {
    name: "Nigeria",
    code: "NG",
    states: [
      { name: "Abia", code: "AB" },
      { name: "Adamawa", code: "AD" },
      { name: "Akwa Ibom", code: "AK" },
      { name: "Anambra", code: "AN" },
      { name: "Bauchi", code: "BA" },
      { name: "Bayelsa", code: "BY" },
      { name: "Benue", code: "BE" },
      { name: "Borno", code: "BO" },
      { name: "Cross River", code: "CR" },
      { name: "Delta", code: "DE" },
      { name: "Ebonyi", code: "EB" },
      { name: "Edo", code: "ED" },
      { name: "Ekiti", code: "EK" },
      { name: "Enugu", code: "EN" },
      { name: "Federal Capital Territory", code: "FC" },
      { name: "Gombe", code: "GO" },
      { name: "Imo", code: "IM" },
      { name: "Jigawa", code: "JI" },
      { name: "Kaduna", code: "KD" },
      { name: "Kano", code: "KN" },
      { name: "Katsina", code: "KT" },
      { name: "Kebbi", code: "KE" },
      { name: "Kogi", code: "KO" },
      { name: "Kwara", code: "KW" },
      { name: "Lagos", code: "LA" },
      { name: "Nasarawa", code: "NA" },
      { name: "Niger", code: "NI" },
      { name: "Ogun", code: "OG" },
      { name: "Ondo", code: "ON" },
      { name: "Osun", code: "OS" },
      { name: "Oyo", code: "OY" },
      { name: "Plateau", code: "PL" },
      { name: "Rivers", code: "RI" },
      { name: "Sokoto", code: "SO" },
      { name: "Taraba", code: "TA" },
      { name: "Yobe", code: "YO" },
      { name: "Zamfara", code: "ZA" }
    ]
  },
  {
    name: "Ghana",
    code: "GH",
    states: [
      { name: "Ahafo", code: "AF" },
      { name: "Ashanti", code: "AS" },
      { name: "Bono", code: "BO" },
      { name: "Bono East", code: "BE" },
      { name: "Central", code: "CE" },
      { name: "Eastern", code: "EA" },
      { name: "Greater Accra", code: "GA" },
      { name: "North East", code: "NE" },
      { name: "Northern", code: "NO" },
      { name: "Oti", code: "OT" },
      { name: "Savannah", code: "SA" },
      { name: "Upper East", code: "UE" },
      { name: "Upper West", code: "UW" },
      { name: "Volta", code: "VO" },
      { name: "Western", code: "WE" },
      { name: "Western North", code: "WN" }
    ]
  },
  {
    name: "Kenya",
    code: "KE",
    states: [
      { name: "Baringo", code: "01" },
      { name: "Bomet", code: "02" },
      { name: "Bungoma", code: "03" },
      { name: "Busia", code: "04" },
      { name: "Elgeyo-Marakwet", code: "05" },
      { name: "Embu", code: "06" },
      { name: "Garissa", code: "07" },
      { name: "Homa Bay", code: "08" },
      { name: "Isiolo", code: "09" },
      { name: "Kajiado", code: "10" },
      { name: "Kakamega", code: "11" },
      { name: "Kericho", code: "12" },
      { name: "Kiambu", code: "13" },
      { name: "Kilifi", code: "14" },
      { name: "Kirinyaga", code: "15" },
      { name: "Kisii", code: "16" },
      { name: "Kisumu", code: "17" },
      { name: "Kitui", code: "18" },
      { name: "Kwale", code: "19" },
      { name: "Laikipia", code: "20" },
      { name: "Lamu", code: "21" },
      { name: "Machakos", code: "22" },
      { name: "Makueni", code: "23" },
      { name: "Mandera", code: "24" },
      { name: "Marsabit", code: "25" },
      { name: "Meru", code: "26" },
      { name: "Migori", code: "27" },
      { name: "Mombasa", code: "28" },
      { name: "Murang'a", code: "29" },
      { name: "Nairobi", code: "30" },
      { name: "Nakuru", code: "31" },
      { name: "Nandi", code: "32" },
      { name: "Narok", code: "33" },
      { name: "Nyamira", code: "34" },
      { name: "Nyandarua", code: "35" },
      { name: "Nyeri", code: "36" },
      { name: "Samburu", code: "37" },
      { name: "Siaya", code: "38" },
      { name: "Taita-Taveta", code: "39" },
      { name: "Tana River", code: "40" },
      { name: "Tharaka-Nithi", code: "41" },
      { name: "Trans Nzoia", code: "42" },
      { name: "Turkana", code: "43" },
      { name: "Uasin Gishu", code: "44" },
      { name: "Vihiga", code: "45" },
      { name: "Wajir", code: "46" },
      { name: "West Pokot", code: "47" }
    ]
  },
  {
    name: "South Africa",
    code: "ZA",
    states: [
      { name: "Eastern Cape", code: "EC" },
      { name: "Free State", code: "FS" },
      { name: "Gauteng", code: "GP" },
      { name: "KwaZulu-Natal", code: "KZN" },
      { name: "Limpopo", code: "LP" },
      { name: "Mpumalanga", code: "MP" },
      { name: "North West", code: "NW" },
      { name: "Northern Cape", code: "NC" },
      { name: "Western Cape", code: "WC" }
    ]
  },
  {
    name: "Egypt",
    code: "EG",
    states: [
      { name: "Alexandria", code: "ALX" },
      { name: "Aswan", code: "ASN" },
      { name: "Asyut", code: "AST" },
      { name: "Beheira", code: "BH" },
      { name: "Beni Suef", code: "BNS" },
      { name: "Cairo", code: "C" },
      { name: "Dakahlia", code: "DK" },
      { name: "Damietta", code: "DT" },
      { name: "Fayyum", code: "FYM" },
      { name: "Gharbia", code: "GH" },
      { name: "Giza", code: "GZ" },
      { name: "Ismailia", code: "IS" },
      { name: "Kafr el-Sheikh", code: "KFS" },
      { name: "Luxor", code: "LX" },
      { name: "Matrouh", code: "MT" },
      { name: "Minya", code: "MN" },
      { name: "Monufia", code: "MNF" },
      { name: "New Valley", code: "WAD" },
      { name: "North Sinai", code: "SIN" },
      { name: "Port Said", code: "PTS" },
      { name: "Qalyubia", code: "KB" },
      { name: "Qena", code: "KN" },
      { name: "Red Sea", code: "BA" },
      { name: "Sharqia", code: "SHR" },
      { name: "Sohag", code: "SHG" },
      { name: "South Sinai", code: "JS" },
      { name: "Suez", code: "SUZ" }
    ]
  },
  {
    name: "Morocco",
    code: "MA",
    states: [
      { name: "Béni Mellal-Khénifra", code: "05" },
      { name: "Casablanca-Settat", code: "06" },
      { name: "Dakhla-Oued Ed-Dahab", code: "12" },
      { name: "Drâa-Tafilalet", code: "08" },
      { name: "Fès-Meknès", code: "03" },
      { name: "Guelmim-Oued Noun", code: "10" },
      { name: "Laâyoune-Sakia El Hamra", code: "11" },
      { name: "Marrakech-Safi", code: "07" },
      { name: "Oriental", code: "02" },
      { name: "Rabat-Salé-Kénitra", code: "04" },
      { name: "Souss-Massa", code: "09" },
      { name: "Tanger-Tétouan-Al Hoceïma", code: "01" }
    ]
  },
  {
    name: "Ethiopia",
    code: "ET",
    states: [
      { name: "Addis Ababa", code: "AA" },
      { name: "Afar", code: "AF" },
      { name: "Amhara", code: "AM" },
      { name: "Benishangul-Gumuz", code: "BE" },
      { name: "Dire Dawa", code: "DD" },
      { name: "Gambela", code: "GA" },
      { name: "Harari", code: "HA" },
      { name: "Oromia", code: "OR" },
      { name: "Sidama", code: "SI" },
      { name: "Somali", code: "SO" },
      { name: "Southern Nations, Nationalities and Peoples", code: "SN" },
      { name: "Tigray", code: "TI" }
    ]
  },
  {
    name: "Tanzania",
    code: "TZ",
    states: [
      { name: "Arusha", code: "01" },
      { name: "Dar es Salaam", code: "02" },
      { name: "Dodoma", code: "03" },
      { name: "Geita", code: "27" },
      { name: "Iringa", code: "04" },
      { name: "Kagera", code: "05" },
      { name: "Katavi", code: "28" },
      { name: "Kigoma", code: "08" },
      { name: "Kilimanjaro", code: "09" },
      { name: "Lindi", code: "12" },
      { name: "Manyara", code: "26" },
      { name: "Mara", code: "13" },
      { name: "Mbeya", code: "14" },
      { name: "Morogoro", code: "16" },
      { name: "Mtwara", code: "17" },
      { name: "Mwanza", code: "18" },
      { name: "Njombe", code: "29" },
      { name: "Pemba North", code: "06" },
      { name: "Pemba South", code: "10" },
      { name: "Pwani", code: "19" },
      { name: "Rukwa", code: "20" },
      { name: "Ruvuma", code: "21" },
      { name: "Shinyanga", code: "22" },
      { name: "Simiyu", code: "30" },
      { name: "Singida", code: "23" },
      { name: "Songwe", code: "31" },
      { name: "Tabora", code: "24" },
      { name: "Tanga", code: "25" },
      { name: "Unguja North", code: "07" },
      { name: "Unguja South", code: "11" },
      { name: "Unguja West", code: "15" }
    ]
  },
  {
    name: "Uganda",
    code: "UG",
    states: [
      { name: "Central", code: "C" },
      { name: "Eastern", code: "E" },
      { name: "Northern", code: "N" },
      { name: "Western", code: "W" }
    ]
  },
  {
    name: "Algeria",
    code: "DZ",
    states: [
      { name: "Adrar", code: "01" },
      { name: "Chlef", code: "02" },
      { name: "Laghouat", code: "03" },
      { name: "Oum El Bouaghi", code: "04" },
      { name: "Batna", code: "05" },
      { name: "Béjaïa", code: "06" },
      { name: "Biskra", code: "07" },
      { name: "Béchar", code: "08" },
      { name: "Blida", code: "09" },
      { name: "Bouira", code: "10" },
      { name: "Tamanrasset", code: "11" },
      { name: "Tébessa", code: "12" },
      { name: "Tlemcen", code: "13" },
      { name: "Tiaret", code: "14" },
      { name: "Tizi Ouzou", code: "15" },
      { name: "Algiers", code: "16" },
      { name: "Djelfa", code: "17" },
      { name: "Jijel", code: "18" },
      { name: "Sétif", code: "19" },
      { name: "Saïda", code: "20" },
      { name: "Skikda", code: "21" },
      { name: "Sidi Bel Abbès", code: "22" },
      { name: "Annaba", code: "23" },
      { name: "Guelma", code: "24" },
      { name: "Constantine", code: "25" },
      { name: "Médéa", code: "26" },
      { name: "Mostaganem", code: "27" },
      { name: "M'Sila", code: "28" },
      { name: "Mascara", code: "29" },
      { name: "Ouargla", code: "30" },
      { name: "Oran", code: "31" },
      { name: "El Bayadh", code: "32" },
      { name: "Illizi", code: "33" },
      { name: "Bordj Bou Arréridj", code: "34" },
      { name: "Boumerdès", code: "35" },
      { name: "El Tarf", code: "36" },
      { name: "Tindouf", code: "37" },
      { name: "Tissemsilt", code: "38" },
      { name: "El Oued", code: "39" },
      { name: "Khenchela", code: "40" },
      { name: "Souk Ahras", code: "41" },
      { name: "Tipaza", code: "42" },
      { name: "Mila", code: "43" },
      { name: "Aïn Defla", code: "44" },
      { name: "Naâma", code: "45" },
      { name: "Aïn Témouchent", code: "46" },
      { name: "Ghardaïa", code: "47" },
      { name: "Relizane", code: "48" }
    ]
  }
];

// Helper functions
export const getCountryByCode = (code: string): Country | undefined => {
  return africanCountriesStates.find(country => country.code === code);
};

export const getStatesByCountryCode = (countryCode: string): CountryState[] => {
  const country = getCountryByCode(countryCode);
  return country ? country.states : [];
};

export const getCountryByName = (name: string): Country | undefined => {
  return africanCountriesStates.find(country => 
    country.name.toLowerCase() === name.toLowerCase()
  );
};

export const getStateByCode = (countryCode: string, stateCode: string): CountryState | undefined => {
  const states = getStatesByCountryCode(countryCode);
  return states.find(state => state.code === stateCode);
};