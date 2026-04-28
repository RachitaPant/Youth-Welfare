'use client';

import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export default function PlaceAutocomplete({ 
  onPlaceSelect, 
  defaultValue = '', 
  placeholder = 'Search for address...',
  className = ''
}: PlaceAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      fields: ['geometry', 'name', 'formatted_address'],
      componentRestrictions: { country: 'in' }, // Restricted to India
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setInputValue(place.formatted_address || place.name || '');
      onPlaceSelect(place);
      
      // Force suggestions to disappear by blurring the input
      if (inputRef.current) {
        inputRef.current.blur();
      }
    });

    // Cleanup
    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [places, onPlaceSelect]);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        inputRef.current.blur();
        // Force hide the Google container if it's being stubborn
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => {
          (container as HTMLElement).style.display = 'none';
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (e.target.value === '') onPlaceSelect(null);
        }}
        placeholder={placeholder}
        className={className}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <i className="fas fa-search text-xs" />
      </div>
    </div>
  );
}
