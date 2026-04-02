CREATE TABLE catalog_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('maps', 'mods', 'textures')),
  image TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 5.0,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO catalog_items (title, description, category, image, downloads, rating, tag) VALUES
('Остров выживания', 'Огромный остров с джунглями, водопадами и секретными данжами. Начни с нуля и покори каждый уголок.', 'maps', 'https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/b05f14c5-3a29-402a-8ca6-80ffe93791de.jpg', 48000, 5.0, 'Выживание'),
('Паркур Neon Rush', '120 уровней паркура на неоновых платформах. Каждый уровень сложнее предыдущего.', 'maps', 'https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/e81ae412-9fba-4ea8-a2a1-b238e136ec45.jpg', 31000, 4.0, 'Паркур'),
('Ultimate Weapons', 'Добавляет 40+ новых видов оружия: зачарованные мечи, боевые топоры и луки с особыми эффектами.', 'mods', 'https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/c25774c8-087d-4107-adf6-771983b38fad.jpg', 92000, 5.0, 'Оружие'),
('Dragon Invasion', 'Мод добавляет дракона Края в обычный мир. Новый босс, броня дракона и эпические битвы.', 'mods', 'https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/a9903bb7-c95e-45a7-ae0e-cb44d0a0e133.jpg', 67000, 5.0, 'Боссы'),
('Подземелье теней', 'Лабиринт из 30 комнат с ловушками, загадками и финальным боссом. Найди артефакт и выберись.', 'maps', 'https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/83c54897-4a91-435f-8ed0-b1fbd90be597.jpg', 25000, 4.0, 'Данж'),
('Pixel Fantasy Pack', 'Пакет текстур в стиле фэнтези: магические блоки, светящиеся руды и переработанный интерфейс.', 'textures', 'https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/36b15b5c-c175-4d19-b3c5-7c2872c043a7.jpg', 19000, 4.0, 'Текстуры');
