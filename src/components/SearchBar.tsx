type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      placeholder="Buscar produto"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
