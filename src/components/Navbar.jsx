export default function Navbar() {
  return (
    <header className="bg-white dark:bg-black text-black dark:text-white font-lexend font-black uppercase tracking-tighter text-sm border-b-2 border-black dark:border-white z-50">
      <nav className="flex justify-between items-center w-full px-8 py-6 max-w-[1440px] mx-auto">
        <div className="text-3xl font-black tracking-[0.2em]">SQH</div>

        <div className="hidden md:flex gap-8">
          <a className="border-b-2 border-black pb-1">SHOP</a>
          <a className="text-black/40 hover:text-black">COLLECTIONS</a>
          <a className="text-black/40 hover:text-black">COMMUNITY</a>
          <a className="text-black/40 hover:text-black">STORY</a>
        </div>

        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined cursor-pointer">
            shopping_cart
          </span>
          <span className="material-symbols-outlined cursor-pointer">
            person
          </span>
          <button className="md:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}