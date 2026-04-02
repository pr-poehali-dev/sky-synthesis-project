import { useState } from "react";
import Icon from "@/components/ui/icon";

type Category = "all" | "maps" | "mods" | "textures";

interface CatalogItem {
  id: number;
  title: string;
  description: string;
  category: "maps" | "mods" | "textures";
  image: string;
  downloads: string;
  rating: number;
  tag: string;
}

const items: CatalogItem[] = [
  {
    id: 1,
    title: "Остров выживания",
    description: "Огромный остров с джунглями, водопадами и секретными данжами. Начни с нуля и покори каждый уголок.",
    category: "maps",
    image: "https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/b05f14c5-3a29-402a-8ca6-80ffe93791de.jpg",
    downloads: "48K",
    rating: 5,
    tag: "Выживание",
  },
  {
    id: 2,
    title: "Паркур Нeon Rush",
    description: "120 уровней паркура на неоновых платформах. Каждый уровень сложнее предыдущего.",
    category: "maps",
    image: "https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/e81ae412-9fba-4ea8-a2a1-b238e136ec45.jpg",
    downloads: "31K",
    rating: 4,
    tag: "Паркур",
  },
  {
    id: 3,
    title: "Ultimate Weapons",
    description: "Добавляет 40+ новых видов оружия: зачарованные мечи, боевые топоры и луки с особыми эффектами.",
    category: "mods",
    image: "https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/c25774c8-087d-4107-adf6-771983b38fad.jpg",
    downloads: "92K",
    rating: 5,
    tag: "Оружие",
  },
  {
    id: 4,
    title: "Dragon Invasion",
    description: "Мод добавляет дракона Края в обычный мир. Новый босс, броня дракона и эпические битвы.",
    category: "mods",
    image: "https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/a9903bb7-c95e-45a7-ae0e-cb44d0a0e133.jpg",
    downloads: "67K",
    rating: 5,
    tag: "Боссы",
  },
  {
    id: 5,
    title: "Подземелье теней",
    description: "Лабиринт из 30 комнат с ловушками, загадками и финальным боссом. Найди артефакт и выберись.",
    category: "maps",
    image: "https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/83c54897-4a91-435f-8ed0-b1fbd90be597.jpg",
    downloads: "25K",
    rating: 4,
    tag: "Данж",
  },
  {
    id: 6,
    title: "Pixel Fantasy Pack",
    description: "Пакет текстур в стиле фэнтези: магические блоки, светящиеся руды и переработанный интерфейс.",
    category: "textures",
    image: "https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/36b15b5c-c175-4d19-b3c5-7c2872c043a7.jpg",
    downloads: "19K",
    rating: 4,
    tag: "Текстуры",
  },
];

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "maps", label: "Карты" },
  { value: "mods", label: "Моды" },
  { value: "textures", label: "Текстуры" },
];

export default function Catalog() {
  const [active, setActive] = useState<Category>("all");

  const filtered = active === "all" ? items : items.filter((i) => i.category === active);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
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
                      {item.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Star" size={14} className="text-yellow-400 fill-yellow-400" />
                      {item.rating}.0
                    </span>
                  </div>
                  <button className="bg-green-500 hover:bg-green-400 text-white text-xs px-4 py-2 uppercase tracking-wide transition-colors duration-200 flex items-center gap-1">
                    <Icon name="Download" size={12} />
                    Скачать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
