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
    recipient: "성종훈",
    presenter: "제로투런",
    date: "2025-06-21",
    event: {
      date: "2025년 6월 1일",
      name: "제22회 새벽강변 국제마라톤대회",
    },
    message:
      "제로투런의 정신적 지주이자 훈련부장으로 맹활약하고 계신 성종훈 회장님의 생애 첫 하프 완주를 기념하기 위해 이 패를 드립니다.",
    category: "half",
  },
  {
    id: 2,
    recipient: "배성우",
    presenter: "제로투런",
    date: "2025-11-05",
    event: {
      date: "2025년 9월 14일",
      name: "2025 마블런 서울",
    },
    message:
      "제로투런의 창립멤버이자 2대 회장으로서 신규 멤버 유입 및 모임 활성화에 그 누구보다 진심이신 배성우 회장님의 첫 하프 완주를 기념하기 위해 이 패를 드립니다.",
    category: "half",
  },

  {
    id: 3,
    recipient: "이동영",
    presenter: "제로투런",
    date: "2025-11-05",
    event: {
      date: "2025년 9월 14일",
      name: "2025 마블런 서울",
    },
    message:
      "제로투런의 창립멤버이자 83에이스, 그리고 하도영을 맡고 계신 이동영님의 하프 완주를 기념하기 위해 이 패를 드립니다.",
    category: "half",
  },
  {
    id: 4,
    recipient: "차상훈",
    presenter: "제로투런",
    date: "2025-11-05",
    event: {
      date: "2025년 10월 12일",
      name: "2025 SEOUL RACE",
    },
    message:
      "그 누구보다 마라톤에 진심이시고 제로투런 회원들의 수 많은 궁금증을 챗지피티보다도 더 신속하고 정확하게 알려주시는 정신적 지주 차상훈 회원님의 하프 완주를 기념하며 이 패를 드립니다.",
    category: "half",
  },
  {
    id: 5,
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
  }
];

export default hallOfFameEntries;
