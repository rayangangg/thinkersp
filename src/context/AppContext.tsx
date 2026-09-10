import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
  Circle,
  Comment,
  Conversation,
  MindToFollow,
  Notification,
  Post,
  Story,
  TrendingTopic,
  User,
  readTimeFor,
  timeAgo,
} from '../data/paradigm';

type ProfileRow = {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  cover_image: string | null;
  role: string;
  bio: string;
  location: string;
  influences: string[];
  interests: string[];
  last_seen: string;
  created_at: string;
};

const ONLINE_WINDOW_MS = 3 * 60 * 1000;

function fallbackAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1c1c1c&textColor=c9a84c`;
}

function toUser(
  row: ProfileRow,
  stats?: { followers?: number; following?: number; articles?: number; appreciations?: number; totalReads?: number },
): User {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    avatar: row.avatar || fallbackAvatar(row.name || row.username),
    role: row.role,
    bio: row.bio,
    location: row.location,
    joinedDate: new Date(row.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    followers: stats?.followers ?? 0,
    following: stats?.following ?? 0,
    articles: stats?.articles ?? 0,
    totalReads: stats?.totalReads ?? 0,
    appreciations: stats?.appreciations ?? 0,
    isOnline: Date.now() - new Date(row.last_seen).getTime() < ONLINE_WINDOW_MS,
    coverImage: row.cover_image || '',
    influences: row.influences ?? [],
    interests: row.interests ?? [],
  };
}

const emptyUser: User = {
  id: '',
  name: 'Guest',
  username: 'guest',
  avatar: fallbackAvatar('Guest'),
  role: 'Reader',
  bio: '',
  location: '',
  joinedDate: '',
  followers: 0,
  following: 0,
  articles: 0,
  totalReads: 0,
  appreciations: 0,
  isOnline: true,
  coverImage: '',
  influences: [],
  interests: [],
};

export interface NewPostInput {
  type: Post['type'];
  content: string;
  title?: string;
  images?: string[];
  bgColor?: string;
  tags?: string[];
  category?: string;
  privacy?: Post['privacy'];
}

interface AppContextType {
  session: Session | null;
  authReady: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  currentUser: User;
  users: User[];
  posts: Post[];
  stories: Story[];
  notifications: Notification[];
  circles: Circle[];
  conversations: Conversation[];
  trendingTopics: TrendingTopic[];
  mindsToFollow: MindToFollow[];
  onlineUsers: User[];
  unreadCount: number;
  followingIds: string[];
  isFollowing: (userId: string) => boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  lightMode: boolean;
  toggleLightMode: () => void;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  showComposer: boolean;
  setShowComposer: (v: boolean) => void;
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  refresh: () => Promise<void>;
  createPost: (input: NewPostInput) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  reactToPost: (postId: string, reactionId: string) => Promise<void>;
  addComment: (postId: string, content: string, parentId?: string | null) => Promise<void>;
  toggleFollow: (userId: string) => Promise<void>;
  toggleCircle: (circleId: string) => Promise<void>;
  createCircle: (input: { name: string; description: string; category: string; cover?: string }) => Promise<void>;
  addStory: (input: { content: string; type: 'text' | 'image'; bgColor?: string; image?: string }) => Promise<void>;
  viewStory: (storyId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  startConversation: (userId: string) => Promise<string | null>;
  markNotificationsRead: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<ProfileRow, 'name' | 'bio' | 'location' | 'role' | 'avatar' | 'cover_image'>> & { interests?: string[]; influences?: string[] }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>({});
  const [followingCounts, setFollowingCounts] = useState<Record<string, number>>({});

  const [activeView, setActiveView] = useState('home');
  const [lightMode, setLightMode] = useState(false);
  const [selectedPost, setSelectedPostState] = useState<Post | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const userId = session?.user?.id ?? null;
  const userIdRef = useRef<string | null>(null);
  userIdRef.current = userId;

  /* ---------------------------------------------------------------- auth */
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setAuthReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  /* --------------------------------------------------------------- loads */
  const loadProfilesAndFollows = useCallback(async () => {
    const [{ data: profileRows }, { data: followRows }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: true }),
      supabase.from('follows').select('follower_id, following_id'),
    ]);
    setProfiles((profileRows ?? []) as unknown as ProfileRow[]);

    const followers: Record<string, number> = {};
    const following: Record<string, number> = {};
    const mine: string[] = [];
    for (const row of followRows ?? []) {
      followers[row.following_id] = (followers[row.following_id] ?? 0) + 1;
      following[row.follower_id] = (following[row.follower_id] ?? 0) + 1;
      if (row.follower_id === userIdRef.current) mine.push(row.following_id);
    }
    setFollowerCounts(followers);
    setFollowingCounts(following);
    setFollowingIds(mine);
  }, []);

  const loadPosts = useCallback(async () => {
    const uid = userIdRef.current;
    const { data } = await supabase
      .from('posts')
      .select(
        `id, author_id, type, content, title, images, bg_color, tags, category, read_time, privacy, created_at,
         author:profiles!posts_author_id_fkey(*),
         reactions(type, user_id),
         bookmarks(user_id),
         comments(id, content, created_at, parent_id, author_id, author:profiles!comments_author_id_fkey(*))`,
      )
      .order('created_at', { ascending: false })
      .limit(100);

    const mapped: Post[] = (data ?? []).map((row: any) => {
      const counts: Record<string, number> = {};
      for (const r of row.reactions ?? []) counts[r.type] = (counts[r.type] ?? 0) + 1;
      const reactions = Object.entries(counts).map(([type, count]) => ({ type, count }));
      const flatComments = (row.comments ?? []).map((c: any) => ({
        id: c.id,
        parentId: c.parent_id as string | null,
        author: toUser(c.author),
        content: c.content,
        timestamp: timeAgo(c.created_at),
        reactions: 0,
        replies: [] as Comment[],
      }));
      const byId = new Map<string, any>(flatComments.map((c: any) => [c.id, c]));
      const roots: Comment[] = [];
      for (const c of flatComments) {
        if (c.parentId && byId.has(c.parentId)) byId.get(c.parentId).replies.push(c);
        else roots.push(c);
      }

      return {
        id: row.id,
        author: toUser(row.author),
        type: row.type,
        content: row.content,
        title: row.title ?? undefined,
        images: row.images ?? [],
        bgColor: row.bg_color ?? undefined,
        tags: row.tags ?? [],
        category: row.category ?? undefined,
        timestamp: timeAgo(row.created_at),
        readTime: row.read_time ?? undefined,
        reactions,
        myReaction: (row.reactions ?? []).find((r: any) => r.user_id === uid)?.type ?? null,
        totalReactions: (row.reactions ?? []).length,
        comments: roots,
        shares: 0,
        isBookmarked: (row.bookmarks ?? []).some((b: any) => b.user_id === uid),
        privacy: row.privacy,
      } as Post;
    });
    setPosts(mapped);
    setSelectedPostState((prev) => (prev ? mapped.find((p) => p.id === prev.id) ?? null : null));
  }, []);

  const loadStories = useCallback(async () => {
    const uid = userIdRef.current;
    const { data } = await supabase
      .from('stories')
      .select('*, author:profiles!stories_author_id_fkey(*), story_views(user_id)')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    setStories(
      (data ?? []).map((row: any) => ({
        id: row.id,
        author: toUser(row.author),
        content: row.content,
        type: row.type,
        bgColor: row.bg_color ?? undefined,
        image: row.image ?? undefined,
        viewed: (row.story_views ?? []).some((v: any) => v.user_id === uid),
        timestamp: timeAgo(row.created_at),
      })),
    );
  }, []);

  const loadNotifications = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) return setNotifications([]);
    const { data } = await supabase
      .from('notifications')
      .select('*, actor:profiles!notifications_actor_id_fkey(*)')
      .order('created_at', { ascending: false })
      .limit(60);

    setNotifications(
      (data ?? []).map((row: any) => ({
        id: row.id,
        type: row.type,
        actor: row.actor ? toUser(row.actor) : emptyUser,
        message: row.message,
        timestamp: timeAgo(row.created_at),
        read: row.read,
      })),
    );
  }, []);

  const loadCircles = useCallback(async () => {
    const uid = userIdRef.current;
    const { data } = await supabase
      .from('circles')
      .select('*, circle_members(user_id)')
      .order('created_at', { ascending: false });

    setCircles(
      (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        members: (row.circle_members ?? []).length,
        cover: row.cover || '',
        recentActivity: `Created ${timeAgo(row.created_at)}`,
        isJoined: (row.circle_members ?? []).some((m: any) => m.user_id === uid),
      })),
    );
  }, []);

  const loadConversations = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) return setConversations([]);
    const { data } = await supabase
      .from('conversations')
      .select(
        `id, last_message_at,
         conversation_participants(user_id, profiles:profiles!conversation_participants_user_id_fkey(*)),
         messages(id, sender_id, content, type, seen, created_at)`,
      )
      .order('last_message_at', { ascending: false });

    const mapped: Conversation[] = (data ?? []).map((row: any) => {
      const other = (row.conversation_participants ?? []).find((p: any) => p.user_id !== uid);
      const messages = [...(row.messages ?? [])].sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      const last = messages[messages.length - 1];
      return {
        id: row.id,
        participant: other?.profiles ? toUser(other.profiles) : emptyUser,
        messages: messages.map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          content: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: m.type,
          seen: m.seen,
        })),
        lastMessage: last?.content ?? 'Say hello',
        lastTime: last ? timeAgo(last.created_at) : timeAgo(row.last_message_at),
        unread: messages.filter((m: any) => m.sender_id !== uid && !m.seen).length,
      };
    });
    setConversations(mapped);
    setActiveConversation((prev) => prev ?? mapped[0]?.id ?? null);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([
      loadProfilesAndFollows(),
      loadPosts(),
      loadStories(),
      loadNotifications(),
      loadCircles(),
      loadConversations(),
    ]);
    setLoading(false);
  }, [loadProfilesAndFollows, loadPosts, loadStories, loadNotifications, loadCircles, loadConversations]);

  useEffect(() => {
    if (!authReady) return;
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void refresh();
  }, [authReady, userId, refresh]);

  /* ------------------------------------------------------------ presence */
  useEffect(() => {
    if (!userId) return;
    const ping = () => {
      void supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', userId);
    };
    ping();
    const timer = setInterval(ping, 60_000);
    return () => clearInterval(timer);
  }, [userId]);

  /* ------------------------------------------------------------ realtime */
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('paradigm-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => void loadPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, () => void loadPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => void loadPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, () => void loadStories())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => void loadConversations())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => void loadNotifications())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => void loadProfilesAndFollows())
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, loadPosts, loadStories, loadConversations, loadNotifications, loadProfilesAndFollows]);

  /* -------------------------------------------------------------- derived */
  const postsByAuthor = useMemo(() => {
    const map: Record<string, { articles: number; appreciations: number }> = {};
    for (const p of posts) {
      const entry = (map[p.author.id] ??= { articles: 0, appreciations: 0 });
      entry.articles += 1;
      entry.appreciations += p.totalReactions;
    }
    return map;
  }, [posts]);

  const users = useMemo(
    () =>
      profiles.map((row) =>
        toUser(row, {
          followers: followerCounts[row.id] ?? 0,
          following: followingCounts[row.id] ?? 0,
          articles: postsByAuthor[row.id]?.articles ?? 0,
          appreciations: postsByAuthor[row.id]?.appreciations ?? 0,
        }),
      ),
    [profiles, followerCounts, followingCounts, postsByAuthor],
  );

  const currentUser = useMemo(
    () => users.find((u) => u.id === userId) ?? emptyUser,
    [users, userId],
  );

  const onlineUsers = useMemo(
    () => users.filter((u) => u.isOnline && u.id !== userId),
    [users, userId],
  );

  const trendingTopics = useMemo<TrendingTopic[]>(() => {
    const counts: Record<string, number> = {};
    for (const p of posts) for (const t of p.tags) counts[t] = (counts[t] ?? 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([tag, count]) => ({ tag: tag.startsWith('#') ? tag : `#${tag}`, count: `${count} ${count === 1 ? 'post' : 'posts'}` }));
  }, [posts]);

  const mindsToFollow = useMemo<MindToFollow[]>(
    () =>
      users
        .filter((u) => u.id !== userId && !followingIds.includes(u.id))
        .sort((a, b) => b.followers - a.followers)
        .slice(0, 4)
        .map((user) => ({ user, mutualFollowers: user.followers })),
    [users, userId, followingIds],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* -------------------------------------------------------------- actions */
  const requireUser = () => {
    const uid = userIdRef.current;
    if (!uid) throw new Error('You need to sign in first.');
    return uid;
  };

  const createPost = useCallback(async (input: NewPostInput) => {
    const uid = requireUser();
    await supabase.from('posts').insert({
      author_id: uid,
      type: input.type,
      content: input.content,
      title: input.title ?? null,
      images: input.images ?? [],
      bg_color: input.bgColor ?? null,
      tags: input.tags ?? [],
      category: input.category ?? null,
      privacy: input.privacy ?? 'public',
      read_time: input.type === 'article' ? readTimeFor(input.content) : null,
    });
    await loadPosts();
  }, [loadPosts]);

  const deletePost = useCallback(async (postId: string) => {
    await supabase.from('posts').delete().eq('id', postId);
    await loadPosts();
  }, [loadPosts]);

  const toggleBookmark = useCallback(async (postId: string) => {
    const uid = requireUser();
    const post = posts.find((p) => p.id === postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p)));
    if (post?.isBookmarked) {
      await supabase.from('bookmarks').delete().eq('post_id', postId).eq('user_id', uid);
    } else {
      await supabase.from('bookmarks').insert({ post_id: postId, user_id: uid });
    }
    await loadPosts();
  }, [posts, loadPosts]);

  const reactToPost = useCallback(async (postId: string, reactionId: string) => {
    const uid = requireUser();
    const post = posts.find((p) => p.id === postId);
    if (post?.myReaction === reactionId) {
      await supabase.from('reactions').delete().eq('post_id', postId).eq('user_id', uid);
    } else {
      await supabase
        .from('reactions')
        .upsert({ post_id: postId, user_id: uid, type: reactionId }, { onConflict: 'post_id,user_id' });
    }
    await loadPosts();
  }, [posts, loadPosts]);

  const addComment = useCallback(async (postId: string, content: string, parentId?: string | null) => {
    const uid = requireUser();
    if (!content.trim()) return;
    await supabase.from('comments').insert({
      post_id: postId,
      author_id: uid,
      content: content.trim(),
      parent_id: parentId ?? null,
    });
    await loadPosts();
  }, [loadPosts]);

  const toggleFollow = useCallback(async (targetId: string) => {
    const uid = requireUser();
    if (targetId === uid) return;
    if (followingIds.includes(targetId)) {
      await supabase.from('follows').delete().eq('follower_id', uid).eq('following_id', targetId);
    } else {
      await supabase.from('follows').insert({ follower_id: uid, following_id: targetId });
    }
    await loadProfilesAndFollows();
  }, [followingIds, loadProfilesAndFollows]);

  const toggleCircle = useCallback(async (circleId: string) => {
    const uid = requireUser();
    const circle = circles.find((c) => c.id === circleId);
    if (circle?.isJoined) {
      await supabase.from('circle_members').delete().eq('circle_id', circleId).eq('user_id', uid);
    } else {
      await supabase.from('circle_members').insert({ circle_id: circleId, user_id: uid });
    }
    await loadCircles();
  }, [circles, loadCircles]);

  const createCircle = useCallback(
    async (input: { name: string; description: string; category: string; cover?: string }) => {
      const uid = requireUser();
      const { data } = await supabase
        .from('circles')
        .insert({
          name: input.name,
          description: input.description,
          category: input.category,
          cover: input.cover ?? null,
          created_by: uid,
        })
        .select('id')
        .single();
      if (data?.id) await supabase.from('circle_members').insert({ circle_id: data.id, user_id: uid });
      await loadCircles();
    },
    [loadCircles],
  );

  const addStory = useCallback(
    async (input: { content: string; type: 'text' | 'image'; bgColor?: string; image?: string }) => {
      const uid = requireUser();
      await supabase.from('stories').insert({
        author_id: uid,
        content: input.content,
        type: input.type,
        bg_color: input.bgColor ?? null,
        image: input.image ?? null,
      });
      await loadStories();
    },
    [loadStories],
  );

  const viewStory = useCallback(async (storyId: string) => {
    const uid = userIdRef.current;
    if (!uid) return;
    setStories((prev) => prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s)));
    await supabase.from('story_views').upsert({ story_id: storyId, user_id: uid });
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    const uid = requireUser();
    if (!content.trim()) return;
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: uid,
      content: content.trim(),
      type: 'text',
    });
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);
    await loadConversations();
  }, [loadConversations]);

  const startConversation = useCallback(async (otherId: string) => {
    const uid = requireUser();
    const existing = conversations.find((c) => c.participant.id === otherId);
    if (existing) {
      setActiveConversation(existing.id);
      return existing.id;
    }
    const { data } = await supabase.from('conversations').insert({}).select('id').single();
    if (!data?.id) return null;
    await supabase.from('conversation_participants').insert([
      { conversation_id: data.id, user_id: uid },
      { conversation_id: data.id, user_id: otherId },
    ]);
    await loadConversations();
    setActiveConversation(data.id);
    return data.id;
  }, [conversations, loadConversations]);

  const markNotificationsRead = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from('notifications').update({ read: true }).eq('user_id', uid).eq('read', false);
  }, []);

  const updateProfile = useCallback(async (patch: Record<string, unknown>) => {
    const uid = requireUser();
    await supabase.from('profiles').update(patch).eq('id', uid);
    await loadProfilesAndFollows();
  }, [loadProfilesAndFollows]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setPosts([]);
    setNotifications([]);
    setConversations([]);
    setStories([]);
  }, []);

  const toggleLightMode = useCallback(() => {
    setLightMode((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') document.body.classList.toggle('light-mode', next);
      return next;
    });
  }, []);

  const setSelectedPost = useCallback((post: Post | null) => {
    setSelectedPostState(post);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }, []);

  const isFollowing = useCallback((id: string) => followingIds.includes(id), [followingIds]);

  const value: AppContextType = {
    session,
    authReady,
    isAuthenticated: !!userId,
    loading,
    currentUser,
    users,
    posts,
    stories,
    notifications,
    circles,
    conversations,
    trendingTopics,
    mindsToFollow,
    onlineUsers,
    unreadCount,
    followingIds,
    isFollowing,
    activeView,
    setActiveView,
    lightMode,
    toggleLightMode,
    selectedPost,
    setSelectedPost,
    showComposer,
    setShowComposer,
    activeConversation,
    setActiveConversation,
    refresh,
    createPost,
    deletePost,
    toggleBookmark,
    reactToPost,
    addComment,
    toggleFollow,
    toggleCircle,
    createCircle,
    addStory,
    viewStory,
    sendMessage,
    startConversation,
    markNotificationsRead,
    updateProfile,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
