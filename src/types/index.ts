// ====== CORE TYPES ======

export type Phase = 'coming' | 'open' | 'voting' | 'pending' | 'winners';

export type VotingMode = 'community' | 'jury';

export type SubmissionStatus = 'active' | 'removed';

export type RemovalReason =
  | 'rule_violation'
  | 'copyright'
  | 'inappropriate'
  | 'duplicate'
  | 'requested_by_artist'
  | 'other';

// ====== CONTEST ======

export interface Contest {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerUrl: string;
  bannerVideoUrl?: string;
  logoUrl?: string;

  // Timeline (4 fields)
  submissionStart?: string; // ISO date, optional
  submissionEnd: string; // ISO date, required
  votingEnd?: string; // required if community voting
  contestEnd: string; // = winners announced, required

  // Voting
  votingMode: VotingMode;
  showJurySection: boolean;
  preModeration: boolean;

  // Track rules
  maxTracksPerUser: number;
  allowRemixes: boolean;

  // Tags
  tags: string[];
}

// ====== SUBMISSION ======

export interface Submission {
  id: string;
  contestId: string;
  trackTitle: string;
  artistName: string;
  artistId: string; // user id
  trackUrl: string; // audiotool track url
  coverUrl?: string;
  submittedAt: string;
  status: SubmissionStatus;
  removalReason?: RemovalReason;
  internalNote?: string;
  removedAt?: string;
  removedBy?: string;
}

// ====== VOTE ======

export interface Vote {
  id: string;
  contestId: string;
  voterId: string;
  voterType: 'community' | 'jury';
  submissionId: string;
  points: 1 | 2 | 3;
  createdAt: string;
}

// ====== PRIZE ======

export interface Prize {
  id: string;
  contestId: string;
  position: number; // 1, 2, 3, ...
  name: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
}

// ====== JUDGE & QUOTE ======

export interface Judge {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  links?: { label: string; url: string }[];
  isAudiotoolMember: boolean;
}

export interface Quote {
  id: string;
  contestId: string;
  judgeId: string;
  submissionId: string;
  text: string;
}

// ====== RULES & TERMS ======

export interface RuleItem {
  id: string;
  text: string;
  isDefault: boolean;
  order: number;
}

export interface TermItem {
  id: string;
  text: string;
  isDefault: boolean;
  order: number;
}

// ====== AUDIT LOG ======

export interface AuditEntry {
  id: string;
  contestId: string;
  timestamp: string;
  actorName: string;
  action: string; // e.g. "removed_submission", "edited_prize"
  targetId?: string;
  details?: string;
}

// ====== CURRENT USER (mock) ======

export interface CurrentUser {
  id: string;
  username: string;
  avatarUrl?: string;
}

// ====== WINNER ======

export interface Winner {
  position: number;
  submissionId: string;
}
