import { MdSearch, MdClose } from 'react-icons/md';

export default function SearchInput({ value, onChange, placeholder = 'Search…', onClear }) {
  return (
    <div className="relative">
      <MdSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
        style={{ color: '#00AEEF' }}   /* Cyan search icon */
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10 pr-9"
      />
      {value && (
        <button
          onClick={() => { onChange(''); onClear?.(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <MdClose className="text-lg" />
        </button>
      )}
    </div>
  );
}
