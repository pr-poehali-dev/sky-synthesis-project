export default function Featured() {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0 bg-white">
      <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2">
        <img
          src="https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/36b15b5c-c175-4d19-b3c5-7c2872c043a7.jpg"
          alt="Minecraft mods collection"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1">
        <h3 className="uppercase mb-4 text-sm tracking-wide text-neutral-600">Тысячи модов и карт для MCPE</h3>
        <p className="text-2xl lg:text-4xl mb-8 text-neutral-900 leading-tight">
          Новые измерения, оружие, текстуры и целые миры — всё бесплатно.
          Устанавливай в один клик и играй прямо сейчас.
        </p>
        <button className="bg-black text-white border border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide">
          Открыть каталог
        </button>
      </div>
    </div>
  );
}