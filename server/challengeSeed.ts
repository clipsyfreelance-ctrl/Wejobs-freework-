import {
  Challenge,
  ChallengeParticipant,
  ChallengeChampionHistory,
  BuiltInAvatarId,
} from '../src/types';

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal-2026-09',
    slug: 'september-2026',
    title: 'WEJOBS Monthly Challenge — September 2026',
    tagline: 'Work. Compete. Earn More.',
    description:
      'Compete with talented freelancers from around the world, complete quality work, earn challenge points, climb the leaderboard, and win monthly rewards.',
    registrationStartAt: '2026-08-25T00:00:00.000Z',
    registrationEndAt: '2026-09-07T23:59:59.000Z',
    challengeStartAt: '2026-09-01T00:00:00.000Z',
    challengeEndAt: '2026-09-30T23:59:59.000Z',
    maxParticipants: 500,
    prizePool: 1750,
    prizes: [
      {
        id: 'prz-1',
        rank: 1,
        title: '1st Place Grand Champion',
        amount: 1000,
        description: 'Awarded to the #1 ranked contributor with the highest verified quality point total.',
        icon: 'gold_cup',
      },
      {
        id: 'prz-2',
        rank: 2,
        title: '2nd Place Runner-Up',
        amount: 300,
        description: 'Second place overall standing with exceptional reliability and volume.',
        icon: 'silver_cup',
      },
      {
        id: 'prz-3',
        rank: 3,
        title: '3rd Place Bronze Winner',
        amount: 150,
        description: 'Third place standing across editorial submissions and on-time turnarounds.',
        icon: 'bronze_cup',
      },
      {
        id: 'prz-4',
        title: 'Best Writer Award',
        amount: 100,
        description: 'Highest average rating (5.0★) with zero rejected revisions and perfect editorial prose.',
        icon: 'star',
      },
      {
        id: 'prz-5',
        title: 'Rising Star Award',
        amount: 75,
        description: 'Top performing new freelancer in their first 30 days on WEJOBS.',
        icon: 'rocket',
      },
      {
        id: 'prz-6',
        title: 'Consistency Award',
        amount: 75,
        description: 'Flawless streak of consecutive days with on-time approved deliveries.',
        icon: 'diamond',
      },
    ],
    pointRules: {
      microtask: 5,
      smallTask: 10,
      mediumTask: 20,
      mediumHighTask: 30,
      largeTask: 50,
      rating5Bonus: 5,
      firstTimeAcceptedBonus: 5,
      earlyCompletionBonus: 3,
      positiveReviewBonus: 3,
      lateTaskPenalty: -3,
      rejectionPenalty: -5,
      ruleViolationPenalty: -20,
    },
    status: 'active',
    rankingStatus: 'provisional',
    isFeatured: true,
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-25T00:00:00.000Z',
  },
];

export const INITIAL_CHAMPION_HISTORIES: ChallengeChampionHistory[] = [
  {
    id: 'hist-2026-08',
    challengeSlug: 'august-2026',
    challengeTitle: 'WEJOBS August 2026 Monthly Challenge',
    monthYear: 'August 2026',
    totalParticipants: 500,
    totalPrizePaid: 1750,
    winners: [
      {
        rank: 1,
        prizeTitle: '1st Place — Freelancer of the Month',
        amount: 1000,
        winnerName: 'Elena Rostova',
        winnerAvatar: 'wolf',
        country: 'Czech Republic',
        score: 1120,
      },
      {
        rank: 2,
        prizeTitle: '2nd Place Runner-Up',
        amount: 300,
        winnerName: 'Marcus Vance',
        winnerAvatar: 'lion',
        country: 'United Kingdom',
        score: 1045,
      },
      {
        rank: 3,
        prizeTitle: '3rd Place',
        amount: 150,
        winnerName: 'Kenji Takahashi',
        winnerAvatar: 'panda',
        country: 'Japan',
        score: 980,
      },
      {
        rank: 4,
        prizeTitle: 'Best Writer Award',
        amount: 100,
        winnerName: 'Sophia Dubois',
        winnerAvatar: 'fox',
        country: 'France',
        score: 940,
      },
      {
        rank: 5,
        prizeTitle: 'Rising Star Award',
        amount: 75,
        winnerName: 'Amara Okafor',
        winnerAvatar: 'cheetah',
        country: 'Nigeria',
        score: 890,
      },
      {
        rank: 6,
        prizeTitle: 'Consistency Award',
        amount: 75,
        winnerName: 'Carlos Mendoza',
        winnerAvatar: 'owl',
        country: 'Mexico',
        score: 860,
      },
    ],
  },
  {
    id: 'hist-2026-07',
    challengeSlug: 'july-2026',
    challengeTitle: 'WEJOBS July 2026 Monthly Challenge',
    monthYear: 'July 2026',
    totalParticipants: 480,
    totalPrizePaid: 1750,
    winners: [
      {
        rank: 1,
        prizeTitle: '1st Place Champion',
        amount: 1000,
        winnerName: 'Priya Sharma',
        winnerAvatar: 'rabbit',
        country: 'India',
        score: 1085,
      },
      {
        rank: 2,
        prizeTitle: '2nd Place',
        amount: 300,
        winnerName: 'Liam Henderson',
        winnerAvatar: 'bear',
        country: 'Canada',
        score: 1020,
      },
      {
        rank: 3,
        prizeTitle: '3rd Place',
        amount: 150,
        winnerName: 'Chloe Bennett',
        winnerAvatar: 'koala',
        country: 'Australia',
        score: 955,
      },
      {
        rank: 4,
        prizeTitle: 'Best Writer',
        amount: 100,
        winnerName: 'Oliver Wright',
        winnerAvatar: 'deer',
        country: 'New Zealand',
        score: 915,
      },
      {
        rank: 5,
        prizeTitle: 'Rising Star',
        amount: 75,
        winnerName: 'Reza Kurniawan',
        winnerAvatar: 'squirrel',
        country: 'Indonesia',
        score: 875,
      },
      {
        rank: 6,
        prizeTitle: 'Consistency Award',
        amount: 75,
        winnerName: 'Hannah Schmidt',
        winnerAvatar: 'cat',
        country: 'Germany',
        score: 840,
      },
    ],
  },
];

const GLOBAL_NAMES = [
  { name: 'Elena Rostova', country: 'Czech Republic', avatar: 'wolf' },
  { name: 'Marcus Vance', country: 'United Kingdom', avatar: 'lion' },
  { name: 'Kenji Takahashi', country: 'Japan', avatar: 'panda' },
  { name: 'Sophia Dubois', country: 'France', avatar: 'fox' },
  { name: 'Liam Henderson', country: 'Canada', avatar: 'bear' },
  { name: 'Amara Okafor', country: 'Nigeria', avatar: 'cheetah' },
  { name: 'Carlos Mendoza', country: 'Mexico', avatar: 'owl' },
  { name: 'Chloe Bennett', country: 'Australia', avatar: 'koala' },
  { name: 'Oliver Wright', country: 'New Zealand', avatar: 'deer' },
  { name: 'Priya Sharma', country: 'India', avatar: 'rabbit' },
  { name: 'Hannah Schmidt', country: 'Germany', avatar: 'cat' },
  { name: 'Matteo Rossi', country: 'Italy', avatar: 'squirrel' },
  { name: 'Lars Lindqvist', country: 'Sweden', avatar: 'penguin' },
  { name: 'Fatima Al-Mansoor', country: 'United Arab Emirates', avatar: 'eagle' },
  { name: 'Lucas Silva', country: 'Brazil', avatar: 'tiger' },
  { name: 'Zainab Qureshi', country: 'Pakistan', avatar: 'hamster' },
  { name: 'David Kim', country: 'South Korea', avatar: 'lion' },
  { name: 'Camille Leroux', country: 'France', avatar: 'fox' },
  { name: 'Siti Nurhaliza', country: 'Malaysia', avatar: 'cat' },
  { name: 'Budi Prakoso', country: 'Indonesia', avatar: 'rabbit' },
  { name: 'Jessica Taylor', country: 'United States', avatar: 'owl' },
  { name: 'Johan van Dijk', country: 'Netherlands', avatar: 'bear' },
  { name: 'Astrid Nielsen', country: 'Denmark', avatar: 'deer' },
  { name: 'Alejandro Morales', country: 'Spain', avatar: 'wolf' },
  { name: 'Dmitry Ivanov', country: 'Estonia', avatar: 'fox' },
  { name: 'Mei-Ling Chen', country: 'Taiwan', avatar: 'panda' },
  // Alex Santoso is #27 matching Section 20 of requirements!
  { name: 'Alex Santoso', country: 'Indonesia', avatar: 'panda', isDemoUser: true },
  { name: 'Gabriel Dubois', country: 'Belgium', avatar: 'rabbit' },
  { name: 'Nadia Petrova', country: 'Bulgaria', avatar: 'koala' },
  { name: 'Kwame Mensah', country: 'Ghana', avatar: 'tiger' },
  { name: 'Leila Haddad', country: 'Morocco', avatar: 'cheetah' },
  { name: 'Marek Nowak', country: 'Poland', avatar: 'squirrel' },
  { name: 'Simona Rossi', country: 'Switzerland', avatar: 'cat' },
  { name: 'Tariq Al-Fassi', country: 'Saudi Arabia', avatar: 'eagle' },
  { name: 'Yuki Tanaka', country: 'Japan', avatar: 'owl' },
  { name: 'Elijah Moore', country: 'Ireland', avatar: 'deer' },
  { name: 'Nguyen Van Minh', country: 'Vietnam', avatar: 'panda' },
  { name: 'Aiden O’Connor', country: 'United Kingdom', avatar: 'lion' },
  { name: 'Beatriz Santos', country: 'Portugal', avatar: 'fox' },
  { name: 'Viktor Horvath', country: 'Hungary', avatar: 'bear' },
];

export function generateSeedParticipants(challengeId: string): ChallengeParticipant[] {
  const participants: ChallengeParticipant[] = [];
  const totalCount = 327; // Exact 327 registered out of 500 slots, remaining 173 slots (65.4% filled)!

  for (let i = 1; i <= totalCount; i++) {
    const nameData = GLOBAL_NAMES[(i - 1) % GLOBAL_NAMES.length];
    const isDemo = nameData.isDemoUser || i === 27;
    const userId = isDemo ? 'user-freelancer-demo' : `user-chal-seed-${i}`;
    const partId = `WMC-202609-${String(i).padStart(4, '0')}`;

    // Score curve: Top rank has 945, down to rank 27 having 684, down to rank 327 having 45
    let score: number;
    let completedTasksCount: number;
    let averageRating: number;

    if (i === 27) {
      // Exactly matching prompt section 20: Rank #27, Points 684, Tasks 32, Rating 4.87
      score = 684;
      completedTasksCount = 32;
      averageRating = 4.87;
    } else if (i === 1) {
      score = 945;
      completedTasksCount = 44;
      averageRating = 4.98;
    } else if (i === 2) {
      score = 890;
      completedTasksCount = 41;
      averageRating = 4.96;
    } else if (i === 3) {
      score = 845;
      completedTasksCount = 39;
      averageRating = 4.94;
    } else if (i < 27) {
      score = Math.round(840 - (i - 4) * 6.8);
      completedTasksCount = Math.max(33, 40 - Math.floor(i / 4));
      averageRating = Number((4.95 - (i * 0.003)).toFixed(2));
    } else {
      score = Math.max(35, Math.round(684 - (i - 27) * 2.15));
      completedTasksCount = Math.max(2, Math.round(32 - (i - 27) * 0.1));
      averageRating = Number((4.85 - (i * 0.001)).toFixed(2));
    }

    const acceptanceRate = Number((99.5 - (i * 0.03)).toFixed(1));

    participants.push({
      id: partId,
      challengeId,
      userId,
      userEmail: isDemo ? 'alex.writer@wejobs.com' : `participant.${i}@wejobs.global`,
      userFullName: isDemo ? 'Alex Santoso' : `${nameData.name}${i > GLOBAL_NAMES.length ? ` ${Math.floor(i / GLOBAL_NAMES.length) + 1}` : ''}`,
      displayName: isDemo ? 'Alex Santoso' : `${nameData.name}${i > GLOBAL_NAMES.length ? ` ${Math.floor(i / GLOBAL_NAMES.length) + 1}` : ''}`,
      avatarType: 'builtin',
      builtinAvatarId: nameData.avatar as BuiltInAvatarId,
      avatarId: nameData.avatar,
      country: nameData.country,
      participantStatus: 'active',
      joinedAt: new Date(Date.now() - (totalCount - i + 2) * 4800000).toISOString(),
      score,
      rank: i,
      completedTasksCount,
      acceptanceRate,
      averageRating,
      fraudStatus: 'clean',
      pointAdjustments: [],
    });
  }

  return participants;
}
