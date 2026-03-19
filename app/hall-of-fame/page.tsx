import hallOfFameEntries from "@/data/hall-of-fame";

export default function HallOfFamePage() {
  return (
    <div className="max-w-[800px] mx-auto p-6">
      <h2 className="text-xl font-bold mb-5">명예의 전당</h2>

      <div className="flex flex-col gap-4">
        {hallOfFameEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#2b3a67] to-[#3d5a99] text-white px-5 py-3">
              <div className="text-lg font-bold">{entry.recipient}</div>
              <div className="text-sm text-blue-200">
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
        ))}
      </div>
    </div>
  );
}
