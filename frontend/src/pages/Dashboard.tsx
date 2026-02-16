import MainHeader from "../components/layout/Header"

export default function Dashboard() {
  return (
    <div className="">
      <MainHeader />
      <header>
        {["Orders", "Products"].map((s) => (
          <button
            key={s}
            onClick={() => {}}
            className={`px-3 py-1 rounded-md border transition ${
              false
                ? "bg-green-600 border-green-500"
                : "border-neutral-700 hover:border-neutral-600"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </header>
    </div>
  );
}
