export function Button({ label, onClick }) {
  return (
    <>
      <button
        onClick={onClick}
        type="submit"
        className="w-full group relative px-8 py-4 bg-emerald-900  border-gray-800 border text-stone-100 hover:bg-emerald-800 transition-all duration-300 rounded-md overflow-hidden focus:ring-1 focus: outline-none focus:ring-slate-600 font-medium  text-sm text-center transform active:scale-95">
        {label}
      </button>
    </>
  );
}
