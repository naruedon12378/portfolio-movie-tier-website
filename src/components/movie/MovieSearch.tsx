import type { FormEvent } from "react";

interface Props {
  value: string;
  onChange: (query: string) => void;
  onSearch: (query: string) => void;
  onReset: () => void;
}

export default function MovieSearch({
  value,
  onChange,
  onSearch,
  onReset,
}: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 md:flex-row md:items-center"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movie..."
        className="flex-1 rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-500 transition-colors"
        >
          Search
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-700 bg-slate-800 px-4 py-3 text-white hover:bg-slate-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}