import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Category = "all" | "maps" | "mods" | "textures";

interface CatalogItem {
  id: number;
  title: string;
  description: string;
  category: "maps" | "mods" | "textures";
  image: string;
  downloads: number;
  rating: number;
  tag: string;
  file_url: string | null;
}

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "maps", label: "Карты" },
  { value: "mods", label: "Моды" },
  { value: "textures", label: "Текстуры" },
];

const API_URL = "https://functions.poehali.dev/ecafd94e-ca6d-4d9d-9c15-048c1086ce45";

function formatDownloads(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function Catalog() {
  const [active, setActive] = useState<Category>("all");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}?category=${active}`)
      .then((r) => r.json())
      .then((data) => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setItems(parsed.items || []);
      })
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <section id="catalog" className="bg-neutral-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="uppercase text-green-500 text-sm tracking-widest mb-3">Каталог</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Карты, моды и текстуры
          </h2>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActive(cat.value)}
                className={`px-5 py-2 text-sm uppercase tracking-wide transition-colors duration-200 border ${
                  active === cat.value
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-neutral-700 text-neutral-400 hover:border-green-500 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 animate-pulse">
                <div className="h-48 bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-full" />
                  <div className="h-4 bg-neutral-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-green-500 transition-colors duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 uppercase tracking-wide">
                    {item.tag}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-neutral-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Icon name="Download" size={14} />
                        {formatDownloads(item.downloads)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Star" size={14} className="text-yellow-400 fill-yellow-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                    {item.file_url ? (
                      <a
                        href={item.file_url}
                        download
                        className="bg-green-500 hover:bg-green-400 text-white text-xs px-4 py-2 uppercase tracking-wide transition-colors duration-200 flex items-center gap-1"
                      >
                        <Icon name="Download" size={12} />
                        Скачать
                      </a>
                    ) : (
                      <button disabled className="bg-neutral-700 text-neutral-500 text-xs px-4 py-2 uppercase tracking-wide flex items-center gap-1 cursor-not-allowed">
                        <Icon name="Download" size={12} />
                        Скачать
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}