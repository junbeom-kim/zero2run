interface StatsCardProps {
  totalDistance: number;
  participatingCount: number;
  avgDistance: number;
}

export default function StatsCard({
  totalDistance,
  participatingCount,
  avgDistance,
}: StatsCardProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl p-5 border border-[#e8e8e4]">
        <div className="text-xs text-[#a3a3a3] font-medium mb-2 tracking-wide">
          총 거리
        </div>
        <div className="text-2xl font-bold text-[#0d9668] tabular-nums tracking-tight">
          {totalDistance}
          <span className="text-sm font-medium text-[#a3a3a3] ml-1">km</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-[#e8e8e4]">
        <div className="text-xs text-[#a3a3a3] font-medium mb-2 tracking-wide">
          참여 회원
        </div>
        <div className="text-2xl font-bold text-[#1a1a1a] tabular-nums tracking-tight">
          {participatingCount}
          <span className="text-sm font-medium text-[#a3a3a3] ml-1">명</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-[#e8e8e4]">
        <div className="text-xs text-[#a3a3a3] font-medium mb-2 tracking-wide">
          인당 평균
        </div>
        <div className="text-2xl font-bold text-[#1a1a1a] tabular-nums tracking-tight">
          {avgDistance}
          <span className="text-sm font-medium text-[#a3a3a3] ml-1">km</span>
        </div>
      </div>
    </div>
  );
}
