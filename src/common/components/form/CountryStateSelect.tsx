import { useState, useEffect, useRef } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { africanCountriesStates, type Country, type CountryState } from "@/common/data/africanCountriesStates";

interface CountryStateSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  countryFieldName?: string;
  stateFieldName?: string;
  placeholder?: {
    country?: string;
    state?: string;
  };
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function CountryStateSelect({
  register,
  setValue,
  watch,
  countryFieldName = "country",
  stateFieldName = "state",
  placeholder = {
    country: "Select Country",
    state: "Select State"
  },
  className = "",
  required = false,
  disabled = false
}: CountryStateSelectProps) {
  const [availableStates, setAvailableStates] = useState<CountryState[]>([]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  
  const countryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  
  const selectedCountry = watch(countryFieldName);
  const selectedState = watch(stateFieldName);

  // Update available states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const country = africanCountriesStates.find(c => c.name === selectedCountry);
      if (country) {
        setAvailableStates(country.states);
        // Clear state selection when country changes
        setValue(stateFieldName, "");
      }
    } else {
      setAvailableStates([]);
      setValue(stateFieldName, "");
    }
  }, [selectedCountry, setValue, stateFieldName]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setIsStateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country: Country) => {
    setValue(countryFieldName, country.name);
    setIsCountryOpen(false);
  };

  const handleStateSelect = (state: CountryState) => {
    setValue(stateFieldName, state.name);
    setIsStateOpen(false);
  };

  const baseInputClasses = `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white cursor-pointer flex items-center justify-between ${className} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Country Dropdown */}
      <div className="relative" ref={countryRef}>
        <input
          type="hidden"
          {...register(countryFieldName, { required: required ? "Country is required" : false })}
        />
        <div
          onClick={() => !disabled && setIsCountryOpen(!isCountryOpen)}
          className={baseInputClasses}
        >
          <span className={selectedCountry ? "text-gray-900" : "text-gray-500"}>
            {selectedCountry || placeholder.country}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
        </div>
        
        {isCountryOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {africanCountriesStates.map((country) => (
              <div
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCountryFlag(country.code)}</span>
                  <span className="text-gray-900">{country.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* State Dropdown */}
      <div className="relative" ref={stateRef}>
        <input
          type="hidden"
          {...register(stateFieldName, { required: required ? "State is required" : false })}
        />
        <div
          onClick={() => !disabled && availableStates.length > 0 && setIsStateOpen(!isStateOpen)}
          className={`${baseInputClasses} ${availableStates.length === 0 ? 'cursor-not-allowed bg-gray-100' : ''}`}
        >
          <span className={selectedState ? "text-gray-900" : "text-gray-500"}>
            {selectedState || placeholder.state}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isStateOpen ? 'rotate-180' : ''}`} />
        </div>
        
        {isStateOpen && !disabled && availableStates.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {availableStates.map((state) => (
              <div
                key={state.code}
                onClick={() => handleStateSelect(state)}
                className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-900">{state.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get country flag emoji
function getCountryFlag(countryCode: string): string {
  const flagMap: Record<string, string> = {
    'NG': '🇳🇬', // Nigeria
    'GH': '🇬🇭', // Ghana
    'KE': '🇰🇪', // Kenya
    'ZA': '🇿🇦', // South Africa
    'EG': '🇪🇬', // Egypt
    'MA': '🇲🇦', // Morocco
    'ET': '🇪🇹', // Ethiopia
    'TZ': '🇹🇿', // Tanzania
    'UG': '🇺🇬', // Uganda
    'DZ': '🇩🇿', // Algeria
  };
  
  return flagMap[countryCode] || '🌍';
}