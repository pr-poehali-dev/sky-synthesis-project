import { useState, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_API = "https://functions.poehali.dev/2b62ab7b-b40b-4151-91dd-fc7af1505ca1";
const UPLOAD_API = "https://functions.poehali.dev/1e0228d1-1e3c-4f71-a099-6e6d163bc813";

interface CatalogItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  downloads: number;
  rating: number;
  tag: string;
}

const emptyForm = {
  title: "",
  description: "",
  category: "maps",
  image: "",
  tag: "",
  downloads: "0",
  rating: "5",
};

function ImageUploader({ token, value, onChange }: { token: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const res = await fetch(UPLOAD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ file: base64, filename: file.name }),
      });
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setPreview(parsed.url);
      onChange(parsed.url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="md:col-span-2">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-neutral-700 hover:border-green-500 transition-colors cursor-pointer flex items-center gap-4 p-4"
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-24 h-24 object-cover shrink-0" />
        ) : (
          <div className="w-24 h-24 bg-neutral-800 flex items-center justify-center shrink-0">
            <Icon name="Image" size={28} className="text-neutral-600" />
          </div>
        )}
        <div className="text-neutral-400 text-sm">
          {uploading ? (
            <span className="text-green-400">Загрузка...</span>
          ) : (
            <>
              <p className="text-white mb-1">{preview ? "Нажми чтобы сменить" : "Нажми или перетащи картинку"}</p>
              <p>JPG, PNG, WEBP — до 5 МБ</p>
            </>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState("");

  const loadItems = useCallback(async (t: string) => {
    const res = await fetch(ADMIN_API, { headers: { "X-Admin-Token": t } });
    if (res.status === 401) return false;
    const data = await res.json();
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    setItems(parsed.items || []);
    return true;
  }, []);

  const handleLogin = async () => {
    const ok = await loadItems(password);
    if (ok) {
      setToken(password);
      setAuthed(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleAdd = async () => {
    setSaving(true);
    await fetch(ADMIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": token },
      body: JSON.stringify({
        ...form,
        downloads: Number(form.downloads),
        rating: Number(form.rating),
      }),
    });
    setForm(emptyForm);
    await loadItems(token);
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${ADMIN_API}?id=${id}`, {
      method: "DELETE",
      headers: { "X-Admin-Token": token },
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="bg-neutral-900 border border-neutral-800 p-8 w-full max-w-sm">
          <div className="text-green-500 uppercase text-xs tracking-widest mb-6">Kayos Team Admin</div>
          <h1 className="text-white text-2xl font-bold mb-6">Вход</h1>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 mb-3 focus:outline-none focus:border-green-500"
          />
          {authError && <p className="text-red-400 text-sm mb-3">Неверный пароль</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 uppercase tracking-wide transition-colors"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-green-500 uppercase text-xs tracking-widest mb-1">Kayos Team</p>
            <h1 className="text-white text-3xl font-bold">Управление каталогом</h1>
          </div>
          <a href="/" className="text-neutral-400 hover:text-white text-sm uppercase tracking-wide transition-colors">
            ← На сайт
          </a>
        </div>

        {/* Форма добавления */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 mb-10">
          <h2 className="text-white font-bold text-lg mb-5 uppercase tracking-wide">Добавить новый элемент</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ImageUploader
              token={token}
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
            />
            <input
              placeholder="Название"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-neutral-800 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-green-500 placeholder-neutral-500"
            />
            <input
              placeholder="Тег (например: Выживание)"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="bg-neutral-800 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-green-500 placeholder-neutral-500"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-neutral-800 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-green-500"
            >
              <option value="maps">Карты</option>
              <option value="mods">Моды</option>
              <option value="textures">Текстуры</option>
            </select>
            <input
              placeholder="Скачиваний (число)"
              type="number"
              value={form.downloads}
              onChange={(e) => setForm({ ...form, downloads: e.target.value })}
              className="bg-neutral-800 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-green-500 placeholder-neutral-500"
            />
            <input
              placeholder="Рейтинг (1-5)"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="bg-neutral-800 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-green-500 placeholder-neutral-500"
            />
          </div>
          <textarea
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 mb-4 focus:outline-none focus:border-green-500 placeholder-neutral-500 resize-none"
          />
          <button
            onClick={handleAdd}
            disabled={saving || !form.title || !form.description || !form.image}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold px-8 py-3 uppercase tracking-wide transition-colors flex items-center gap-2"
          >
            <Icon name="Plus" size={16} />
            {saving ? "Сохранение..." : "Добавить"}
          </button>
        </div>

        {/* Список элементов */}
        <h2 className="text-white font-bold text-lg mb-4 uppercase tracking-wide">
          Все элементы <span className="text-neutral-500 font-normal">({items.length})</span>
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-4 flex items-center gap-4">
              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-bold truncate">{item.title}</span>
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 shrink-0">{item.tag}</span>
                  <span className="text-neutral-500 text-xs shrink-0 capitalize">{item.category}</span>
                </div>
                <p className="text-neutral-400 text-sm truncate">{item.description}</p>
              </div>
              <div className="text-neutral-500 text-sm shrink-0 text-right mr-4">
                <div>{item.downloads.toLocaleString()} скач.</div>
                <div>★ {item.rating}</div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-neutral-600 hover:text-red-400 transition-colors shrink-0"
              >
                <Icon name="Trash2" size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
