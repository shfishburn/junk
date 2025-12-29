import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3RlcGhlbmhmaXNoYnVybiIsImEiOiJjbWppenpwZm8xdjMxM2hwc2szaHY4NGM4In0.wQOiDt0ksVfZqEirVEw1jw';

interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  isVerified: boolean;
}

interface AddressInputProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
  required?: boolean;
  className?: string;
}

interface MapboxSuggestion {
  id: string;
  place_name: string;
  text: string;
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  properties?: {
    address?: string;
  };
}

export function AddressInput({ value, onChange, required = false, className }: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Bias search to Washington state area
      const bbox = '-124.85,45.54,-116.91,49.00'; // WA state bounding box
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=US&types=address&bbox=${bbox}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Address search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreetChange = (newStreet: string) => {
    setSearchQuery(newStreet);
    onChange({
      ...value,
      street: newStreet,
      isVerified: false,
    });

    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAddress(`${newStreet} ${value.city} ${value.state}`);
    }, 300);
  };

  const handleSuggestionSelect = (suggestion: MapboxSuggestion) => {
    // Parse the address components from Mapbox response
    let street = suggestion.properties?.address 
      ? `${suggestion.properties.address} ${suggestion.text}`
      : suggestion.text;
    let city = '';
    let state = '';
    let zip = '';

    if (suggestion.context) {
      for (const ctx of suggestion.context) {
        if (ctx.id.startsWith('place')) {
          city = ctx.text;
        } else if (ctx.id.startsWith('region')) {
          state = ctx.short_code?.replace('US-', '') || ctx.text;
        } else if (ctx.id.startsWith('postcode')) {
          zip = ctx.text;
        }
      }
    }

    const newAddress: AddressData = {
      street,
      city,
      state,
      zip,
      fullAddress: suggestion.place_name,
      isVerified: true,
    };

    onChange(newAddress);
    setSearchQuery(street);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleManualChange = (field: keyof AddressData, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
      isVerified: false,
    });
  };

  const verifyAddress = async () => {
    if (!value.street || !value.city || !value.state) return;

    setIsLoading(true);
    try {
      const query = `${value.street}, ${value.city}, ${value.state} ${value.zip}`;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=US&types=address&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        // Check if the result is a close match (relevance score > 0.8)
        if (feature.relevance > 0.8) {
          onChange({
            ...value,
            fullAddress: feature.place_name,
            isVerified: true,
          });
        }
      }
    } catch (error) {
      console.error('Address verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)} ref={wrapperRef}>
      {/* Street Address with Autocomplete */}
      <div className="space-y-2 relative">
        <Label htmlFor="street">
          Street Address {required && <span className="text-destructive">*</span>}
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="street"
            value={value.street}
            onChange={(e) => handleStreetChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="123 Main Street"
            className="pl-9"
            required={required}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-accent text-sm transition-colors"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <div className="font-medium">{suggestion.text}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {suggestion.place_name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* City, State, ZIP in a row */}
      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-3 space-y-2">
          <Label htmlFor="city">
            City {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="city"
            value={value.city}
            onChange={(e) => handleManualChange('city', e.target.value)}
            onBlur={verifyAddress}
            placeholder="Mount Vernon"
            required={required}
          />
        </div>
        <div className="col-span-1 space-y-2">
          <Label htmlFor="state">
            State {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="state"
            value={value.state}
            onChange={(e) => handleManualChange('state', e.target.value.toUpperCase().slice(0, 2))}
            onBlur={verifyAddress}
            placeholder="WA"
            maxLength={2}
            required={required}
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="zip">
            ZIP Code {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="zip"
            value={value.zip}
            onChange={(e) => handleManualChange('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
            onBlur={verifyAddress}
            placeholder="98273"
            maxLength={5}
            required={required}
          />
        </div>
      </div>

      {/* Verification Status */}
      {(value.street || value.city) && (
        <div className={cn(
          "flex items-center gap-2 text-sm px-3 py-2 rounded-md",
          value.isVerified 
            ? "bg-primary/10 text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          {value.isVerified ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Address verified</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>Address not yet verified - select from suggestions or complete all fields</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function getEmptyAddress(): AddressData {
  return {
    street: '',
    city: '',
    state: '',
    zip: '',
    fullAddress: '',
    isVerified: false,
  };
}

export function formatAddressForStorage(address: AddressData): string {
  if (!address.street) return '';
  const parts = [address.street];
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zip) parts.push(address.zip);
  return parts.join(', ');
}

export type { AddressData };
