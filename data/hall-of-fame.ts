export interface HallOfFameEntry {
  id: number;
  recipient: string;
  presenter: string;
  date: string;
  event: {
    date: string;
    name: string;
  };
  message: string;
  category: "full" | "half";
}

const hallOfFameEntries: HallOfFameEntry[] = [
  {
    id: 1,
    recipient: "차상훈",
    presenter: "제로투런",
    date: "2025-11-05",
    event: {
      date: "2025년 10월 12일",
      name: "2025 SEOUL RACE",
    },
    message:
      "그 누구보다 마라톤에 진심이시고 제로투런 회원들의 수 많은 궁금증을 챗지피티보다도 더 신속하고 정확하게 알려주시는 정신적 지주 차상훈 회원님의 하프 완주를 기념하며 이 패를 드립니다.\n\n제로투원 회원 일동",
    category: "half",
  },
  {
    id: 2,
    recipient: "성종훈",
    presenter: "제로투런",
    date: "2025-11-05",
    event: {
      date: "2025년 10월 3일",
      name: "제22회 강남국제평화마라톤",
    },
    message:
      "'제로투런'이라는 이름처럼 단 1년만에 풀코스 완주라는 놀라운 성취를 이루어 인간승리의 표본이 되어주신 성종훈 회원님의 첫 풀코스 완주를 기념하며 이 패를 드립니다. \n\n제로투원 회원 일동",
    category: "full",
  },
];

export default hallOfFameEntries;
