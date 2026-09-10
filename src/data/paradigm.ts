// Shared domain types + static UI constants for Paradigm.
// All real content comes from Lovable Cloud — no demo data lives here.

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  bio: string;
  location: string;
  joinedDate: string;
  followers: number;
  following: number;
  articles: number;
  totalReads: number;
  appreciations: number;
  isOnline: boolean;
  coverImage: string;
  influences: string[];
  interests: string[];
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  reactions: number;
  replies: Comment[];
}

export interface Post {
  id: string;
  author: User;
  type: 'thought' | 'article' | 'image' | 'shared';
  content: string;
  title?: string;
  images?: string[];
  bgColor?: string;
  tags: string[];
  category?: string;
  timestamp: string;
  readTime?: string;
  reactions: { type: string; count: number }[];
  myReaction?: string | null;
  totalReactions: number;
  comments: Comment[];
  shares: number;
  isBookmarked: boolean;
  privacy: 'public' | 'friends' | 'only_me';
  sharedLink?: { url: string; title: string; source: string; thumbnail: string };
}

export interface Story {
  id: string;
  author: User;
  content: string;
  type: 'text' | 'image';
  bgColor?: string;
  image?: string;
  viewed: boolean;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'appreciation' | 'comment' | 'follow' | 'mention' | 'share';
  actor: User;
  target?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'article';
  seen: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  cover: string;
  recentActivity: string;
  isJoined: boolean;
}

export interface TrendingTopic {
  tag: string;
  count: string;
}

export interface MindToFollow {
  user: User;
  mutualFollowers: number;
}

export const reactionTypes = [
  { id: 'appreciate', emoji: '\u{1FAB6}', label: 'Appreciate', color: '#C9A84C' },
  { id: 'enlightened', emoji: '\u{1F4A1}', label: 'Enlightened', color: '#E8C97A' },
  { id: 'brilliant', emoji: '\u{1F525}', label: 'Brilliant', color: '#FF6B35' },
  { id: 'resonate', emoji: '\u{1F91D}', label: 'Resonate', color: '#6B9BAC' },
  { id: 'thought_provoking', emoji: '\u{1F4AD}', label: 'Thought-Provoking', color: '#9B8EC4' },
  { id: 'moved', emoji: '\u2764\uFE0F', label: 'Moved', color: '#C45C5C' },
];

export const categories = [
  'Philosophy', 'Literature', 'Science', 'Culture', 'Politics',
  'Personal Essay', 'Poetry', 'History', 'Psychology', 'Art & Criticism',
  'World Affairs', 'Technology & Ethics',
];

export const storyBgOptions = ['gold', 'blue', 'red', 'green'];

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function readTimeFor(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
