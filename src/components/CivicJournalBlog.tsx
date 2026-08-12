import React, { useState } from 'react';
import { ShareModal } from './ShareModal';
import { getShareableUrl, ShareDataPayload } from '../lib/shareUtils';
import {
  BookOpen,
  Sparkles,
  ThumbsUp,
  Share2,
  Bookmark,
  Clock,
  UserCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Award,
  ArrowRight,
  Flame,
  Building2,
  Leaf,
  ShieldCheck,
  Tag,
  PenTool,
  Mail,
  Copy,
  Send,
  Check,
  ExternalLink,
} from 'lucide-react';

export interface CivicBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  category: 'Urban Planning' | 'Eco Initiatives' | 'Civic Tech' | 'Neighborhood Safety' | 'Small Business';
  readTimeMinutes: number;
  likesCount: number;
  userHasLiked?: boolean;
  coverImageUrl: string;
  publishedAt: string;
  tags: string[];
  isVerifiedAuthor: boolean;
  featured?: boolean;
}

const INITIAL_BLOG_POSTS: CivicBlogPost[] = [
  {
    id: 'post-1',
    title: 'How Revitalizing 3rd Street Park Boosted Local Business Foot Traffic by 34%',
    excerpt: 'A deep dive into community-led urban placemaking, native tree planting, and how clean public spaces create vibrant micro-economies.',
    content: `When our volunteer group first started clearing litter from the 3rd Street Corridor, few anticipated the cascading economic benefits. Over six months, with support from 120 resident volunteers and $4,000 in micro-grants, we installed solar-powered benches, native flower beds, and improved street lighting.

### Key Outcomes:
1. **Foot Traffic Surge:** Nearby coffee shops and local bakeries reported a 34% increase in weekend customers.
2. **Safety Improvement:** Evening incidents dropped by 45% due to enhanced LED lighting and active street presence.
3. **Civic Pride:** Over 200 residents participated in monthly cleanup drives.

Placemaking isn't just about aesthetics — it's a proven catalyst for community cohesion and local commercial growth.`,
    authorName: 'Elena Rostova',
    authorTitle: 'Urban Designer & Civic Activist',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    category: 'Urban Planning',
    readTimeMinutes: 4,
    likesCount: 142,
    coverImageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80',
    publishedAt: 'July 22, 2026',
    tags: ['Placemaking', 'Small Business', 'Green Spaces'],
    isVerifiedAuthor: true,
    featured: true,
  },
  {
    id: 'post-2',
    title: 'Smart Storm Drain Management: Preparing Neighborhoods Before Rainy Season',
    excerpt: 'Practical guides for block captains and homeowners on preventing urban flooding through proactive drainage adoption.',
    content: `Urban flooding costs municipalities millions each year, yet 60% of blocked storm drains can be cleared in under five minutes by informed residents. In this guest guide, we share simple steps for adopting your local corner drain.

- **Clear Debris:** Sweep fallen leaves and litter at least 10 feet back from drain grates.
- **Report Clogs:** Use CITYSCAPE to tag clogged mainlines so municipal vacuum trucks can prioritize critical flood zones.
- **Install Rain Barrels:** Retain runoff water for gardens during dry spells.`,
    authorName: 'Marcus Vance',
    authorTitle: 'Civil Water Resource Engineer',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    category: 'Eco Initiatives',
    readTimeMinutes: 3,
    likesCount: 89,
    coverImageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    publishedAt: 'July 20, 2026',
    tags: ['Infrastructure', 'Flood Prevention', 'Climate Resilience'],
    isVerifiedAuthor: true,
  },
  {
    id: 'post-3',
    title: 'The AI Revolution in Public Works: How Sensor Data Speeds Up Pothole Repairs',
    excerpt: 'An inside look at how computer vision and crowdsourced citizen telemetry are reducing municipal repair backlogs from weeks to hours.',
    content: `Civic infrastructure management is undergoing its biggest transformation in decades. By combining citizen photo uploads with computer vision severity scoring, city crews receive prioritized work orders automatically routed by proximity and urgency.`,
    authorName: 'Dr. Aisha Patel',
    authorTitle: 'Director of Civic Analytics',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    category: 'Civic Tech',
    readTimeMinutes: 5,
    likesCount: 215,
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    publishedAt: 'July 18, 2026',
    tags: ['Civic AI', 'Smart Cities', 'GovTech'],
    isVerifiedAuthor: true,
  },
  {
    id: 'post-4',
    title: 'Building Safer Crosswalks Around Elementary Schools: A Community Action Guide',
    excerpt: 'How parents and local business owners partnered with traffic engineers to install high-visibility paint and pedestrian beacons.',
    content: `School zone safety requires collaboration across parents, teachers, and municipal traffic enforcement. Here is our step-by-step playbook for requesting traffic calming infrastructure in your school district.`,
    authorName: 'David Miller',
    authorTitle: 'Parent Teacher Alliance Chair',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    category: 'Neighborhood Safety',
    readTimeMinutes: 4,
    likesCount: 110,
    coverImageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    publishedAt: 'July 15, 2026',
    tags: ['School Safety', 'Pedestrian First', 'Traffic'],
    isVerifiedAuthor: false,
  },
];

interface CivicJournalBlogProps {
  onAwardKarma?: (amount: number, reason: string) => void;
}

export const CivicJournalBlog: React.FC<CivicJournalBlogProps> = ({ onAwardKarma }) => {
  const [posts, setPosts] = useState<CivicBlogPost[]>(INITIAL_BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<CivicBlogPost | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareDataPayload | null>(null);

  // Pitch Form State
  const [pitchTitle, setPitchTitle] = useState('');
  const [pitchAuthor, setPitchAuthor] = useState('');
  const [pitchCategory, setPitchCategory] = useState<CivicBlogPost['category']>('Urban Planning');
  const [pitchOutline, setPitchOutline] = useState('');

  const categories = ['ALL', 'Urban Planning', 'Eco Initiatives', 'Civic Tech', 'Neighborhood Safety', 'Small Business'];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCat = selectedCategory === 'ALL' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredPost = posts.find((p) => p.featured) || posts[0];

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;

    const newLiked = !targetPost.userHasLiked;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            userHasLiked: newLiked,
            likesCount: newLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );

    if (newLiked && onAwardKarma) {
      onAwardKarma(5, 'Engaging with Civic Guest Journal');
    }
  };

  const handleBookmark = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contact@cityscape.solutions');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendEmailPitch = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`CITYSCAPE Guest Post Pitch: ${pitchTitle || 'Community Article'}`);
    const body = encodeURIComponent(
      `Hello CITYSCAPE Editorial Team,\n\nI would like to submit a guest article pitch for the CITYSCAPE Journal.\n\nAuthor: ${pitchAuthor || 'Anonymous Resident'}\nCategory: ${pitchCategory}\nProposed Title: ${pitchTitle}\n\nArticle Summary / Outline:\n${pitchOutline}\n\nLooking forward to hearing from you!\n`
    );
    window.location.href = `mailto:contact@cityscape.solutions?subject=${subject}&body=${body}`;
    alert(`📧 Pitch draft formatted! Opening your email client to send to contact@cityscape.solutions`);
    setIsContactModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Value Banner */}
      <div className="p-6 sm:p-8 bg-[#0A2540] text-white rounded-3xl shadow-2xl border-2 border-[#006D5B] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-['Montserrat']">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-[#006D5B] text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xs border border-[#006D5B]">
              <Sparkles className="w-3 h-3 text-amber-300" />
              CIVIC JOURNAL & THOUGHT LEADERSHIP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Montserrat'] font-black tracking-tight text-white">
            Community Voices & Guest Journal
          </h1>
          <p className="text-xs sm:text-sm text-black leading-relaxed font-bold bg-white/95 p-3 rounded-xl border border-slate-200 shadow-xs">
            Read inspiring stories, urban placemaking insights, eco-initiatives, and expert articles written by neighborhood leaders, architects, and volunteers.
          </p>
        </div>

        <button
          onClick={() => setIsContactModalOpen(true)}
          className="relative z-10 px-5 py-3.5 bg-[#B45309] hover:bg-amber-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer shrink-0 flex items-center space-x-2 border border-amber-500/30"
        >
          <Mail className="w-4 h-4 text-white" />
          <span>Contact for Guest Posts</span>
        </button>

        {/* Decorative Background Accent */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#006D5B]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* FEATURED EDITORIAL BANNER */}
      {featuredPost && (
        <div
          onClick={() => setSelectedPost(featuredPost)}
          className="group relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 hover:shadow-2xl transition-all font-['Montserrat']"
        >
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden">
            <img
              src={featuredPost.coverImageUrl}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[#008080] text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1">
                <Award className="w-3 h-3 text-[#CCFF00]" />
                Featured Editorial
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2.5 py-0.5 bg-[#008080]/10 text-[#008080] dark:bg-[#008080]/20 dark:text-[#CCFF00] font-bold rounded-lg text-[10px] uppercase tracking-wider">
                  {featuredPost.category}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredPost.readTimeMinutes} min read
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-['Montserrat'] font-black text-[#1A1A1A] dark:text-white group-hover:text-[#008080] transition-colors leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={featuredPost.authorAvatar}
                  alt={featuredPost.authorName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#008080]/30"
                />
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1">
                    {featuredPost.authorName}
                    {featuredPost.isVerifiedAuthor && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008080] fill-[#008080]/20" />
                    )}
                  </p>
                  <p className="text-[10px] text-slate-500">{featuredPost.authorTitle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-[#008080]">
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH ROW */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 ui-kit-card-lvl2 font-['Montserrat']">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
                selectedCategory === cat
                  ? 'ui-kit-chip-active'
                  : 'ui-kit-chip-default'
              }`}
            >
              {cat === 'ALL' ? 'All Articles' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative shrink-0 sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & authors..."
            className="w-full pl-9 pr-4 py-2.5 ui-kit-input text-xs font-bold focus:outline-none min-h-[42px]"
          />
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-['Montserrat']">
        {filteredPosts.map((post) => {
          const isBookmarked = bookmarkedIds.includes(post.id);

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group soft-card pro-card p-4 space-y-4 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer border border-slate-200/80 dark:border-slate-800 active:scale-[0.985]"
            >
              <div className="space-y-3">
                {/* Image & Category Tag */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 bg-slate-900/80 text-white backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleBookmark(post.id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 backdrop-blur-md rounded-xl hover:bg-white transition-colors"
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        isBookmarked ? 'fill-[#008080] text-[#008080]' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Title & Excerpt */}
                <div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-1">
                    <span>{post.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTimeMinutes} min
                    </span>
                  </div>

                  <h3 className="font-['Montserrat'] font-extrabold text-base text-[#1A1A1A] dark:text-white group-hover:text-[#008080] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Interactions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[11px] font-bold text-[#1A1A1A] dark:text-white line-clamp-1">
                      {post.authorName}
                    </p>
                    <p className="text-[9px] text-slate-400 line-clamp-1">{post.authorTitle}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleLikePost(post.id, e)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    post.userHasLiked
                      ? 'bg-[#008080]/10 text-[#008080] dark:bg-[#008080]/20 dark:text-[#CCFF00]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${post.userHasLiked ? 'fill-[#008080] text-[#008080] dark:fill-[#CCFF00] dark:text-[#CCFF00]' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* READ FULL ARTICLE MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto font-['Montserrat']">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto p-6 sm:p-8 space-y-6">
            {/* Header / Close */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-[#008080]/10 dark:bg-[#008080]/20 text-[#008080] dark:text-[#CCFF00] text-[10px] font-black uppercase tracking-wider rounded-xl">
                {selectedPost.category}
              </span>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Title & Author Meta */}
            <div className="space-y-3">
              <h2 className="text-2xl font-['Montserrat'] font-black text-[#1A1A1A] dark:text-white leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <img
                  src={selectedPost.authorAvatar}
                  alt={selectedPost.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#008080]/30"
                />
                <div>
                  <p className="text-xs font-extrabold text-[#1A1A1A] dark:text-white flex items-center gap-1">
                    {selectedPost.authorName}
                    {selectedPost.isVerifiedAuthor && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008080] fill-[#008080]/20" />
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500">{selectedPost.authorTitle}</p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="h-64 w-full rounded-2xl overflow-hidden">
              <img
                src={selectedPost.coverImageUrl}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="text-sm text-slate-700 dark:text-slate-200 space-y-4 leading-relaxed font-sans whitespace-pre-line">
              {selectedPost.content}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400">Tags:</span>
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={(e) => handleLikePost(selectedPost.id, e)}
                className="px-4 py-2 bg-[#008080] text-[#CCFF00] rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-md hover:bg-[#006666]"
              >
                <ThumbsUp className="w-4 h-4 fill-[#CCFF00] text-[#CCFF00]" />
                <span>Endorse Article ({selectedPost.likesCount})</span>
              </button>

              <button
                onClick={() => {
                  setShareData({
                    type: 'article',
                    title: selectedPost.title,
                    text: `${selectedPost.authorName} (${selectedPost.authorTitle}): ${selectedPost.excerpt}`,
                    url: getShareableUrl('article', selectedPost.id),
                    idOrTag: selectedPost.id,
                    category: selectedPost.category,
                  });
                  setIsShareModalOpen(true);
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer hover:bg-slate-200"
              >
                <Share2 className="w-4 h-4 text-[#008080]" />
                <span>Share Story</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUEST POST CONTACT & EMAIL PITCH MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto font-['Montserrat']">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-[#008080]/30 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#008080] text-white flex items-center justify-center font-bold shadow-md">
                  <Mail className="w-5 h-5 text-[#CCFF00]" />
                </div>
                <div>
                  <h3 className="font-['Montserrat'] font-black text-base text-[#1A1A1A] dark:text-white">
                    Guest Post Submissions
                  </h3>
                  <p className="text-[11px] text-slate-500">Contact Editorial Team at contact@cityscape.solutions</p>
                </div>
              </div>

              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 max-h-[calc(92vh-90px)]">
            {/* Direct Contact Callout Box */}
            <div className="p-4 sm:p-5 bg-white text-black rounded-2xl border-2 border-[#006D5B] space-y-3.5 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase text-[#006D5B] tracking-wider flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    Official Submissions Email
                  </div>
                  <div className="text-base sm:text-lg font-mono font-black text-black tracking-wide">
                    contact@cityscape.solutions
                  </div>
                  <p className="text-[11px] text-slate-800 font-medium mt-1 leading-relaxed">
                    Direct online publishing is disabled. Please submit your guest article pitch or draft to our editorial team via email.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href="mailto:contact@cityscape.solutions?subject=CITYSCAPE%20Guest%20Post%20Pitch"
                  className="px-3.5 py-2 bg-[#006D5B] hover:bg-[#004d40] text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email to contact@cityscape.solutions</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="px-3.5 py-2 bg-[#004d4d] hover:bg-[#006666] text-teal-100 font-bold text-xs rounded-xl border border-[#008080] transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied Email!' : 'Copy Email Address'}</span>
                </button>
              </div>
            </div>

            {/* Pitch Assistant Form */}
            <form onSubmit={handleSendEmailPitch} className="space-y-4 pt-1">
              <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Or Draft & Format Your Pitch Below:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Author Name / Bio
                  </label>
                  <input
                    type="text"
                    required
                    value={pitchAuthor}
                    onChange={(e) => setPitchAuthor(e.target.value)}
                    placeholder="e.g. Marcus Vance (Urban Architect)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Article Category
                  </label>
                  <select
                    value={pitchCategory}
                    onChange={(e) => setPitchCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="Urban Planning">Urban Planning</option>
                    <option value="Eco Initiatives">Eco Initiatives</option>
                    <option value="Civic Tech">Civic Tech</option>
                    <option value="Neighborhood Safety">Neighborhood Safety</option>
                    <option value="Small Business">Small Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Proposed Article Headline / Topic
                </label>
                <input
                  type="text"
                  required
                  value={pitchTitle}
                  onChange={(e) => setPitchTitle(e.target.value)}
                  placeholder="e.g. How Solar Street Benches Boost Nighttime Community Safety"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Brief Pitch / Summary or Key Takeaways
                </label>
                <textarea
                  required
                  rows={4}
                  value={pitchOutline}
                  onChange={(e) => setPitchOutline(e.target.value)}
                  placeholder="Provide a short overview of your article topic, case study details, or community experience..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#008080] hover:bg-[#006666] text-[#CCFF00] rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <Send className="w-4 h-4 text-[#CCFF00]" />
                <span>Send Email Pitch to contact@cityscape.solutions</span>
              </button>
            </form>
            </div>
          </div>
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={shareData}
      />
    </div>
  );
};
