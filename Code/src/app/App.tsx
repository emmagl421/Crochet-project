import { useState, useMemo } from "react";
import { Search, Plus, Star, User, X, ChevronLeft, Minus } from "lucide-react";

const WEIGHT_LABELS: Record<number, string> = {
  1: "Lace",
  2: "Fine",
  3: "Light",
  4: "Medium",
  5: "Bulky",
  6: "Super Bulky",
};

const COLOR_CATEGORIES: { name: string; color: string }[] = [
  { name: "Red",     color: "#e05555" },
  { name: "Orange",  color: "#e88040" },
  { name: "Yellow",  color: "#e8cc40" },
  { name: "Green",   color: "#5aaa5a" },
  { name: "Teal",    color: "#3aacaa" },
  { name: "Blue",    color: "#4a7fd8" },
  { name: "Purple",  color: "#8855cc" },
  { name: "Pink",    color: "#e066a8" },
  { name: "Brown",   color: "#8b5a2b" },
  { name: "Gray",    color: "#888888" },
  { name: "White",   color: "#f0ede8" },
  { name: "Black",   color: "#222222" },
  { name: "Neutral", color: "#c4a882" },
  { name: "Multi",   color: "linear-gradient(135deg, #e05555 0%, #e8cc40 33%, #4a7fd8 66%, #8855cc 100%)" },
];


interface Yarn {
  id: string;
  brand: string;
  colorName: string;
  color: string;
  colorCategory?: string;
  weight: number;
  price: number;
  yards: number;
  skeins: number;
  favorite: boolean;
}

type FilterType = "all" | "favorites" | "in-stock" | "no-stock";

const defaultForm = {
  brand: "",
  colorName: "",
  color: "#c4956a",
  colorCategory: "",
  weight: 4,
  price: "",
  yards: "",
  skeins: "1",
  favorite: false,
};

function YarnBallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="32" fill="currentColor" opacity="0.15" />
      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M16 32 Q30 20 44 32 Q58 44 72 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M12 44 Q26 32 40 44 Q54 56 68 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M32 12 Q20 26 32 40 Q44 54 32 68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M48 10 Q36 24 48 38 Q60 52 48 68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="58" cy="24" r="5" fill="currentColor" opacity="0.6" />
      <path d="M58 24 Q66 16 70 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function YarnCard({
  yarn,
  onToggleFavorite,
  onDelete,
  onUpdateSkeins,
}: {
  yarn: Yarn;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onUpdateSkeins: (delta: number) => void;
}) {
  const isLight = isLightColor(yarn.color);

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group">
      {/* Color swatch */}
      <div className="relative h-28 flex items-end p-3" style={{ backgroundColor: yarn.color }}>
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${
            isLight ? "bg-black/10 hover:bg-black/20" : "bg-white/20 hover:bg-white/30"
          }`}
        >
          <Star
            size={15}
            className={yarn.favorite ? "text-amber-400" : isLight ? "text-black/40" : "text-white/60"}
            fill={yarn.favorite ? "currentColor" : "none"}
          />
        </button>
        {yarn.colorCategory && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isLight ? "bg-black/10 text-black/60" : "bg-white/20 text-white/80"
            }`}
          >
            {yarn.colorCategory}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase mb-0.5 truncate">
          {yarn.brand}
        </p>
        <p className="text-sm font-semibold text-foreground truncate mb-2">{yarn.colorName}</p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
            Wt {yarn.weight} · {WEIGHT_LABELS[yarn.weight]}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Skeins adjuster */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateSkeins(-1)}
              disabled={yarn.skeins === 0}
              className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <Minus size={11} />
            </button>
            <span className="text-sm font-semibold w-6 text-center tabular-nums">{yarn.skeins}</span>
            <button
              onClick={() => onUpdateSkeins(1)}
              className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Plus size={11} />
            </button>
            <span className="text-xs text-muted-foreground">skein{yarn.skeins !== 1 ? "s" : ""}</span>
          </div>

          {/* Price */}
          {yarn.price > 0 && (
            <span className="text-xs text-muted-foreground">${yarn.price.toFixed(2)}</span>
          )}
        </div>

        {yarn.yards > 0 && (
          <p className="text-xs text-muted-foreground mt-1.5">{yarn.yards} yd/skein</p>
        )}

        <button
          onClick={onDelete}
          className="mt-3 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

export default function App() {
  const [yarns, setYarns] = useState<Yarn[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = useMemo(() => {
    let result = yarns;
    if (filter === "favorites") result = result.filter((y) => y.favorite);
    if (filter === "in-stock") result = result.filter((y) => y.skeins > 0);
    if (filter === "no-stock") result = result.filter((y) => y.skeins === 0);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (y) =>
          y.brand.toLowerCase().includes(q) ||
          y.colorName.toLowerCase().includes(q) ||
          y.colorCategory?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [yarns, filter, search]);

  const totalSkeins = yarns.reduce((s, y) => s + y.skeins, 0);
  const totalValue = yarns.reduce((s, y) => s + y.price * y.skeins, 0);

  function handleAdd() {
    if (!form.brand.trim() || !form.colorName.trim()) return;
    const yarn: Yarn = {
      id: crypto.randomUUID(),
      brand: form.brand.trim(),
      colorName: form.colorName.trim(),
      color: form.color,
      colorCategory: form.colorCategory || undefined,
      weight: form.weight,
      price: parseFloat(form.price as string) || 0,
      yards: parseFloat(form.yards as string) || 0,
      skeins: parseInt(form.skeins as string) || 0,
      favorite: form.favorite,
    };
    setYarns((prev) => [yarn, ...prev]);
    setForm({ ...defaultForm });
    setShowAdd(false);
  }

  function toggleFavorite(id: string) {
    setYarns((prev) => prev.map((y) => (y.id === id ? { ...y, favorite: !y.favorite } : y)));
  }

  function deleteYarn(id: string) {
    setYarns((prev) => prev.filter((y) => y.id !== id));
  }

  function updateSkeins(id: string, delta: number) {
    setYarns((prev) =>
      prev.map((y) => (y.id === id ? { ...y, skeins: Math.max(0, y.skeins + delta) } : y))
    );
  }

  const navItems: [FilterType, string][] = [
    ["all", "All Yarns"],
    ["favorites", "Favorites"],
    ["in-stock", "In Stock"],
    ["no-stock", "Out of Stock"],
  ];

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "var(--font-sans)", background: "var(--background)" }}
    >
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-card border-r border-border transition-all duration-300 shrink-0 ${
          sidebarOpen ? "w-52" : "w-0 overflow-hidden border-r-0"
        }`}
      >
        <div className="p-5 pt-4 pb-4">
          <h1
            className="text-3xl font-semibold text-foreground leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Yarn
            <br />
            Stash
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Your fiber collection</p>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1 mb-1">
            Inventory
          </p>
          {navItems.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5 ${
                filter === key
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Stats */}
        {yarns.length > 0 && (
          <div className="mx-3 mb-3 p-3 bg-muted rounded-xl">
            <p className="text-xs font-medium text-foreground">{totalSkeins} skeins total</p>
            {totalValue > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">${totalValue.toFixed(2)} value</p>
            )}
          </div>
        )}

        <div className="p-3 pb-5">
          <button className="flex items-center gap-2 px-3 py-2.5 w-full rounded-xl text-sm text-muted-foreground hover:bg-accent transition-colors">
            <User size={15} />
            Account
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground shrink-0"
          >
            <ChevronLeft
              size={17}
              className={`transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`}
            />
          </button>

          <div className="flex-1 relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search yarns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-input-background rounded-xl text-sm outline-none focus:ring-2 ring-ring transition-all placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus size={15} />
            Add
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-muted-foreground select-none">
              <YarnBallIcon className="w-24 h-24" />
              <div className="text-center">
                <p className="text-base font-medium text-foreground">
                  {yarns.length === 0 ? "Nothing added yet" : "No yarns match"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {yarns.length === 0
                    ? "Add your first yarn to get started"
                    : "Try adjusting your search or filter"}
                </p>
              </div>
              {yarns.length === 0 && (
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} />
                  Add Your First Yarn
                </button>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filtered.map((yarn) => (
                  <YarnCard
                    key={yarn.id}
                    yarn={yarn}
                    onToggleFavorite={() => toggleFavorite(yarn.id)}
                    onDelete={() => deleteYarn(yarn.id)}
                    onUpdateSkeins={(delta) => updateSkeins(yarn.id, delta)}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-right mt-4">
                Total: {filtered.reduce((s, y) => s + y.skeins, 0)} skein
                {filtered.reduce((s, y) => s + y.skeins, 0) !== 1 ? "s" : ""}
                {filtered.length !== yarns.length && ` (${filtered.length} of ${yarns.length} yarns)`}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Add Yarn Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(44,31,20,0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto border border-border">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
              <h2
                className="text-xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Add Yarn
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setForm((f) => ({ ...f, favorite: !f.favorite }))}
                  title="Mark as favorite"
                  className="p-2 rounded-xl transition-colors hover:bg-accent"
                >
                  <Star
                    size={19}
                    className={form.favorite ? "text-amber-500" : "text-muted-foreground"}
                    fill={form.favorite ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 space-y-5">
              {/* Color picker + preview combined */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Color <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative shrink-0 group">
                    <div
                      className="w-16 h-16 rounded-xl border-2 border-border cursor-pointer overflow-hidden"
                      style={{ backgroundColor: form.color }}
                    >
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: isLightColor(form.color) ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ color: isLightColor(form.color) ? "rgba(0,0,0,0.7)" : "white" }}>
                        <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setForm((f) => ({ ...f, color: v }));
                      }}
                      className="w-full px-3 py-2.5 bg-input-background rounded-xl text-sm font-mono outline-none focus:ring-2 ring-ring"
                      placeholder="#000000"
                      maxLength={7}
                    />
                    <p className="text-xs text-muted-foreground mt-1.5 pl-1">Click the swatch to open the color picker</p>
                  </div>
                </div>

                {/* Preview strip — clearly labelled, not interactive */}
                <div className="relative">
                  <p className="text-xs text-muted-foreground mb-1">Card preview</p>
                  <div
                    className="h-14 rounded-xl flex items-center justify-center select-none"
                    style={{ backgroundColor: form.color }}
                  >
                    <span
                      className="text-sm font-medium px-3 py-1 rounded-full"
                      style={{
                        background: isLightColor(form.color) ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)",
                        color: isLightColor(form.color) ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)",
                      }}
                    >
                      {form.colorName || (form.brand ? form.brand : "Your yarn color")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lion Brand, Caron, Malabrigo..."
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-input-background rounded-xl text-sm outline-none focus:ring-2 ring-ring placeholder:text-muted-foreground"
                />
              </div>

              {/* Color Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Color Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dusty Rose, Ocean Mist..."
                  value={form.colorName}
                  onChange={(e) => setForm((f) => ({ ...f, colorName: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-input-background rounded-xl text-sm outline-none focus:ring-2 ring-ring placeholder:text-muted-foreground"
                />
              </div>

              {/* Color category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Color Category{" "}
                  <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() =>
                        setForm((f) => ({ ...f, colorCategory: f.colorCategory === cat.name ? "" : cat.name }))
                      }
                      title={cat.name}
                      className={`w-8 h-8 rounded-full border-[2.5px] transition-transform hover:scale-110 ${
                        form.colorCategory === cat.name
                          ? "border-foreground scale-110 shadow-md"
                          : "border-transparent"
                      }`}
                      style={
                        cat.name === "Multi"
                          ? { background: cat.color, border: form.colorCategory === cat.name ? "2.5px solid var(--foreground)" : "2.5px solid transparent" }
                          : { backgroundColor: cat.color }
                      }
                    />
                  ))}
                </div>
                {form.colorCategory && (
                  <p className="text-xs text-muted-foreground mt-1.5">{form.colorCategory}</p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Weight Class <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((w) => (
                    <button
                      key={w}
                      onClick={() => setForm((f) => ({ ...f, weight: w }))}
                      title={WEIGHT_LABELS[w]}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        form.weight === w
                          ? "bg-primary text-primary-foreground"
                          : "bg-input-background text-foreground hover:bg-secondary"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {WEIGHT_LABELS[form.weight]}
                </p>
              </div>

              {/* Price + Yards */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Price / Skein</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      className="w-full pl-7 pr-3 py-2.5 bg-input-background rounded-xl text-sm outline-none focus:ring-2 ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Yards / Skein</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="200"
                    value={form.yards}
                    onChange={(e) => setForm((f) => ({ ...f, yards: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-input-background rounded-xl text-sm outline-none focus:ring-2 ring-ring"
                  />
                </div>
              </div>

              {/* Skeins */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Skeins in Stock</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setForm((f) => ({ ...f, skeins: String(Math.max(0, parseInt(f.skeins || "0") - 1)) }))
                    }
                    className="w-10 h-10 rounded-xl bg-input-background flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={form.skeins}
                    onChange={(e) => setForm((f) => ({ ...f, skeins: e.target.value }))}
                    className="flex-1 px-3 py-2.5 bg-input-background rounded-xl text-sm text-center font-semibold outline-none focus:ring-2 ring-ring tabular-nums"
                  />
                  <button
                    onClick={() =>
                      setForm((f) => ({ ...f, skeins: String(parseInt(f.skeins || "0") + 1) }))
                    }
                    className="w-10 h-10 rounded-xl bg-input-background flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleAdd}
                disabled={!form.brand.trim() || !form.colorName.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Stash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
