// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import api from '../lib/api.ts';

interface SearchResult {
  id: number;
  name: string;
  type: 'expert' | 'service';
}

// Composant stylisé isolé des styles globaux via Emotion
const ResultsContainer = styled(motion.div)`
  background-color: #ffffff !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  z-index: 50;
  margin-top: 0.5rem;
  width: 100%;
  position: absolute;
  top: 100%;
`;

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  // Variants pour animer la liste avec un effet de stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim() === '') {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(`/search`, { params: { query: value } });
      setResults(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur de recherche:', error.response?.data);
      } else {
        console.error('Erreur inconnue:', error);
      }
      setResults([]);
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
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
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
          <ResultsContainer
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {results.map((result) => (
                <motion.li
                  key={result.id}
                  variants={itemVariants}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    window.location.href =
                      result.type === 'expert'
                        ? `/expert/${result.id}`
                        : `/service/${result.id}`;
                  }}
                >
                  <span>{result.name}</span>
                  <span className="text-sm text-gray-500">
                    {result.type === 'expert' ? 'Expert' : 'Service'}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </ResultsContainer>
        )}
        {isFocused && query && results.length === 0 && !loading && (
          <ResultsContainer
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 text-center text-gray-500"
          >
            Aucun résultat trouvé.
          </ResultsContainer>
        )}
        {isFocused && loading && (
          <ResultsContainer
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 text-center text-gray-500"
          >
            Recherche en cours...
          </ResultsContainer>
        )}
      </AnimatePresence>
    </div>
  );
}
