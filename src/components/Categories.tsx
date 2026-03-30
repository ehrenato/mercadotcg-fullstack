type CategoriesProps = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export default function Categories({
  categories,
  selected,
  onSelect,
}: CategoriesProps) {
  return (
    <div className="row gap-sm wrap">
      <button
        type="button"
        className={selected === "" ? "primary-button" : "secondary-button"}
        onClick={() => onSelect("")}
      >
        Todas
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={
            selected === category ? "primary-button" : "secondary-button"
          }
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
