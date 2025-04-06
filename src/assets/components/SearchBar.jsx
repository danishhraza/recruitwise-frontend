import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar = ({ initialSearchQuery = '', onSearch }) => {
  const [inputValue, setInputValue] = useState(initialSearchQuery);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const triggerSearch = () => {
    onSearch(inputValue.toLowerCase());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  return (
    <div className="relative flex-1 max-w-4xl">
      <div className="relative flex w-full items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          className="pl-10 pr-24 py-6 w-full text-lg"
          placeholder="Search jobs..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 h-10"
          onClick={triggerSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;