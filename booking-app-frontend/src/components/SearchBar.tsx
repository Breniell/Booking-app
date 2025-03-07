// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import axios from 'axios';

interface SearchResult {
  id: number;
  name: string;
  type: 'expert' | 'service';
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim() === '') {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`/search`, { params: { query: value } });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          placeholder="Rechercher un expert ou un service..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          aria-label="Barre de recherche"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Effacer la recherche"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50"
          >
            <ul>
              {results.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    window.location.href = result.type === 'expert'
                      ? `/expert/${result.id}`
                      : `/service/${result.id}`;
                  }}
                >
                  <span>{result.name}</span>
                  <span className="text-sm text-gray-500">
                    {result.type === 'expert' ? 'Expert' : 'Service'}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        {isFocused && query && results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50 p-4 text-center text-gray-500"
          >
            Aucun résultat trouvé.
          </motion.div>
        )}
        {isFocused && loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50 p-4 text-center text-gray-500"
          >
            Recherche en cours...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
