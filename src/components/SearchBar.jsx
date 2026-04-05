import { MdSearch } from 'react-icons/md';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="search-bar">
      <MdSearch className="search-bar__icon" />
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
