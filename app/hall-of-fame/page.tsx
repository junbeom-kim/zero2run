import hallOfFameEntries from "@/data/hall-of-fame";

const categoryStyle = {
  full: {
    gradient: "bg-gradient-to-r from-[#7b2d26] to-[#c0392b]",
    badge: "bg-red-100 text-red-700",
    label: "풀코스",
  },
  half: {
    gradient: "bg-gradient-to-r from-[#2b3a67] to-[#3d5a99]",
    badge: "bg-blue-100 text-blue-700",
    label: "하프",
  },
};

export default function HallOfFamePage() {
  return (
    <div className="max-w-[800px] mx-auto p-6">
      <h2 className="text-xl font-bold mb-5">명예의 전당</h2>

      <div className="flex flex-col gap-4">
        {[...hallOfFameEntries].sort((a, b) => b.event.sortDate.localeCompare(a.event.sortDate)).map((entry) => {
          const style = categoryStyle[entry.category];
          return (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className={`${style.gradient} text-white px-5 py-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{entry.recipient}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.label}
                  </span>
                </div>
                <div className="text-sm opacity-75">
                  {entry.event.name} · {entry.event.date}
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {entry.message}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                  <span>수여: {entry.presenter}</span>
                  <span>{entry.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
