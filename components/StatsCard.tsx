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
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="text-sm text-gray-400 font-semibold mb-3">
        이번 달 요약
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600">{totalDistance}</div>
          <div className="text-xs text-gray-400 mt-1">총 거리 (km)</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600">
            {participatingCount}
          </div>
          <div className="text-xs text-gray-400 mt-1">참여 회원</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600">{avgDistance}</div>
          <div className="text-xs text-gray-400 mt-1">인당 평균 (km)</div>
        </div>
      </div>
    </div>
  );
}
