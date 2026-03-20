import hallOfFameEntries from "@/data/hall-of-fame";

const categoryStyle = {
  full: {
    gradient: "bg-gradient-to-br from-[#7b2d26] to-[#a93226]",
    badge: "bg-white/20 text-white",
    label: "풀코스",
    accent: "#c0392b",
  },
  half: {
    gradient: "bg-gradient-to-br from-[#1a4a5e] to-[#2a6f8e]",
    badge: "bg-white/20 text-white",
    label: "하프",
    accent: "#2a6f8e",
  },
};

export default function HallOfFamePage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 py-8">
      <h2 className="text-lg font-bold tracking-tight mb-6">명예의 전당</h2>

      <div className="flex flex-col gap-4">
        {[...hallOfFameEntries]
          .sort((a, b) => b.event.sortDate.localeCompare(a.event.sortDate))
          .map((entry) => {
            const style = categoryStyle[entry.category];
            return (
              <article
                key={entry.id}
                className="bg-white rounded-2xl border border-[#e8e8e4] overflow-hidden hover:border-[#d1d5db] transition-colors"
              >
                <div className={`${style.gradient} text-white px-5 py-4`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[17px] font-bold tracking-tight">
                      {entry.recipient}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${style.badge}`}
                    >
                      {style.label}
                    </span>
                  </div>
                  <div className="text-[13px] opacity-70 mt-1">
                    {entry.event.name} · {entry.event.date}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[#4a4a4a] text-[14px] whitespace-pre-line leading-[1.75]">
                    {entry.message}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#f0f0ec] flex justify-between text-xs text-[#a3a3a3]">
                    <span>수여: {entry.presenter}</span>
                    <span>{entry.date}</span>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
}
