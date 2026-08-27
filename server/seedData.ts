import { Task, FAQItem, SponsorItem, PlatformSettings, MainCategory } from '../src/types';

// The 10 official monochrome sponsor assets from the prompt
export const INITIAL_SPONSORS: SponsorItem[] = [
  {
    id: 'sp-1',
    name: 'Penerbit Digital',
    logoUrl: 'https://i.ibb.co.com/1SFXSHN/images-5.jpg',
    websiteUrl: 'https://wejobs.work/publishers/digital',
    description: 'Jaringan penerbitan digital dan distribusi e-book terkemuka.',
    category: 'Penerbit Digital',
    order: 1,
    active: true,
  },
  {
    id: 'sp-2',
    name: 'Pendidikan Digital',
    logoUrl: 'https://i.ibb.co.com/zVCgkNpn/images-4.jpg',
    websiteUrl: 'https://wejobs.work/education',
    description: 'Pengembangan modul kurikulum dan literatur akademik digital.',
    category: 'Pendidikan Digital',
    order: 2,
    active: true,
  },
  {
    id: 'sp-3',
    name: 'Media Kreatif',
    logoUrl: 'https://i.ibb.co.com/5gXnJT35/images-3.jpg',
    websiteUrl: 'https://wejobs.work/creative-media',
    description: 'Sindikasi konten kreatif, penulisan naratif, dan esai budaya.',
    category: 'Media Kreatif',
    order: 3,
    active: true,
  },
  {
    id: 'sp-4',
    name: 'Jaringan Konten',
    logoUrl: 'https://i.ibb.co.com/TM7bCMwG/images-3.png',
    websiteUrl: 'https://wejobs.work/content-network',
    description: 'Jaringan distribusi artikel SEO dan publikasi multi-platform.',
    category: 'Jaringan Konten',
    order: 4,
    active: true,
  },
  {
    id: 'sp-5',
    name: 'Penerbit',
    logoUrl: 'https://i.ibb.co.com/7tYdJWpG/images-2.jpg',
    websiteUrl: 'https://wejobs.work/publishers',
    description: 'Rumah publikasi karya fiksi dan naskah literatur komersial.',
    category: 'Penerbit',
    order: 5,
    active: true,
  },
  {
    id: 'sp-6',
    name: 'Grup Media Digital',
    logoUrl: 'https://i.ibb.co.com/N2CCZtvZ/images-1.jpg',
    websiteUrl: 'https://wejobs.work/media-group',
    description: 'Grup media berita, jurnalisme investigatif, dan opini editorial.',
    category: 'Grup Media Digital',
    order: 6,
    active: true,
  },
  {
    id: 'sp-7',
    name: 'Agensi Kreatif',
    logoUrl: 'https://i.ibb.co.com/tSKP0ys/images.jpg',
    websiteUrl: 'https://wejobs.work/creative-agency',
    description: 'Agensi strategi copywriting, kampanye merek, dan siaran pers.',
    category: 'Agensi Kreatif',
    order: 7,
    active: true,
  },
  {
    id: 'sp-8',
    name: 'Mitra Berita & Media',
    logoUrl: 'https://i.ibb.co.com/nXPfd0W/images-2.png',
    websiteUrl: 'https://wejobs.work/news-partners',
    description: 'Kemitraan peliputan berita internasional dan transkripsi wawancara.',
    category: 'Mitra Berita & Media',
    order: 8,
    active: true,
  },
  {
    id: 'sp-9',
    name: 'Platform E-Learning',
    logoUrl: 'https://i.ibb.co.com/6JV2HzMX/images-1.png',
    websiteUrl: 'https://wejobs.work/elearning',
    description: 'Platform kursus digital dan materi pembelajaran interaktif global.',
    category: 'Platform E-Learning',
    order: 9,
    active: true,
  },
  {
    id: 'sp-10',
    name: 'Komunitas Penulis',
    logoUrl: 'https://i.ibb.co.com/LdXcg3Gp/images.png',
    websiteUrl: 'https://wejobs.work/writers-community',
    description: 'Komunitas penulis freelance dan asosiasi kurator naskah independen.',
    category: 'Komunitas Penulis',
    order: 10,
    active: true,
  },
];

export const INITIAL_SETTINGS: PlatformSettings = {
  minWithdrawalAmount: 100.0,
  maintenanceMode: false,
  requireCaptcha: true,
  sponsorTrustText: 'dan website kami di percaya oleh ribuan penerbit lainnya',
  autoApprovePayouts: false,
  plagiarismThresholdPercent: 15,
};

// 50+ Real Comprehensive FAQ items across 10 categories
export const INITIAL_FAQS: FAQItem[] = [
  // 1. Account
  {
    id: 'faq-1',
    category: 'Account',
    question: 'How do I create a verified WEJOBS freelancer account?',
    answer: 'Click on the Register button on the top right. Fill in your Full Name, Residential Address, Active Phone Number, and Email Address. Complete the interactive security CAPTCHA, agree to our Terms & Privacy Policy, and click Create Account. Once registered, your account is immediately ready to browse and accept tasks.',
    isPopular: true,
    isFeatured: true,
    order: 1,
    helpfulCount: 342,
    notHelpfulCount: 4,
    published: true,
  },
  {
    id: 'faq-2',
    category: 'Account',
    question: 'Can I have multiple accounts on WEJOBS?',
    answer: 'No. WEJOBS strictly enforces a one-account-per-person policy to maintain integrity and prevent slot hoarding. Creating duplicate or bot accounts will result in immediate suspension of all associated profiles and forfeiture of unverified balances.',
    isPopular: false,
    order: 2,
    helpfulCount: 189,
    notHelpfulCount: 8,
    published: true,
  },
  {
    id: 'faq-3',
    category: 'Account',
    question: 'What should I do if I forget my password?',
    answer: 'On the login page, click "Forgot Password". Enter your registered email address to receive a secure password reset token. Follow the link to establish a new strong password.',
    isPopular: false,
    order: 3,
    helpfulCount: 95,
    notHelpfulCount: 2,
    published: true,
  },
  {
    id: 'faq-4',
    category: 'Account',
    question: 'How do I update my personal information or address?',
    answer: 'Navigate to your Profile & Settings tab from the top navigation. You can update your Full Name, Phone Number, Residential Address, and Bio. Email changes require re-verification through a confirmation token.',
    isPopular: false,
    order: 4,
    helpfulCount: 78,
    notHelpfulCount: 1,
    published: true,
  },
  {
    id: 'faq-5',
    category: 'Account',
    question: 'Why does WEJOBS require my real phone and physical address?',
    answer: 'As a regulated micro-freelance platform paying in real USD, anti-money laundering (AML) and fraud prevention guidelines require us to verify legitimate human identity before processing monetary payouts.',
    isPopular: false,
    order: 5,
    helpfulCount: 134,
    notHelpfulCount: 9,
    published: true,
  },

  // 2. Profile & Avatar
  {
    id: 'faq-6',
    category: 'Profile & Avatar',
    question: 'What built-in avatars are available on WEJOBS?',
    answer: 'WEJOBS provides 7 beautifully styled built-in avatars: Cat, Panda, Bear, Rabbit, Fox, Penguin, and Hamster. You can switch between them at any time in your Profile settings with zero upload hassle.',
    isPopular: true,
    order: 6,
    helpfulCount: 210,
    notHelpfulCount: 3,
    published: true,
  },
  {
    id: 'faq-7',
    category: 'Profile & Avatar',
    question: 'Can I upload my own custom profile photo?',
    answer: 'Yes. You can upload a photo from your device (JPG, JPEG, PNG, or WebP). The system validates MIME signatures, provides an instant crop and visual preview tool, and stores it securely. You can replace, delete, or revert back to a built-in avatar whenever you wish.',
    isPopular: false,
    order: 7,
    helpfulCount: 164,
    notHelpfulCount: 5,
    published: true,
  },
  {
    id: 'faq-8',
    category: 'Profile & Avatar',
    question: 'What is the maximum allowed image upload size?',
    answer: 'The maximum allowed avatar upload size is 5 Megabytes (MB). Images are sanitized and compressed server-side to ensure rapid load times across all devices.',
    isPopular: false,
    order: 8,
    helpfulCount: 88,
    notHelpfulCount: 2,
    published: true,
  },
  {
    id: 'faq-9',
    category: 'Profile & Avatar',
    question: 'How is my freelancer rating calculated?',
    answer: 'Your freelancer rating is a 5-star weighted average computed exclusively from real client reviews and successfully accepted submissions. It appears on your profile and unlocks higher-tier task categories.',
    isPopular: false,
    order: 9,
    helpfulCount: 204,
    notHelpfulCount: 6,
    published: true,
  },

  // 3. Jobs & Tasks
  {
    id: 'faq-10',
    category: 'Jobs',
    question: 'What writing categories and micro-tasks are offered on WEJOBS?',
    answer: 'WEJOBS focuses strictly on 4 core disciplines: 1. Writing (Articles, Blog posts, Essays, Copywriting, Product Descriptions, Captions, Press Releases, Proposals), 2. Creative Writing (Fiction, Short Stories, Poetry, Screenplays, Drama Scripts, Storytelling, Character Profiles), 3. Editing (Proofreading, Grammar Correction, Structural Editing, Rewriting, Simplification), and 4. Research & Writing (Academic Summaries, Literature Reviews, Research Digests, Informational Articles).',
    isPopular: true,
    isFeatured: true,
    order: 10,
    helpfulCount: 450,
    notHelpfulCount: 11,
    published: true,
  },
  {
    id: 'faq-11',
    category: 'Jobs',
    question: 'How do task capacity and slot allocation work?',
    answer: 'Each job posted by a verified client has a fixed capacity (e.g. 20, 35, 50, 74, 100, or 150 worker slots). When you click "Take Job", our database atomically reserves 1 slot for you. Once all slots are claimed, the job automatically shifts to FULL status.',
    isPopular: true,
    order: 11,
    helpfulCount: 318,
    notHelpfulCount: 7,
    published: true,
  },
  {
    id: 'faq-12',
    category: 'Jobs',
    question: 'How many tasks can I take simultaneously?',
    answer: 'To ensure timely delivery and high editorial quality, standard accounts can hold up to 3 active "In Progress" tasks at one time. Once you submit a completed task for review, an active slot re-opens.',
    isPopular: false,
    order: 12,
    helpfulCount: 197,
    notHelpfulCount: 12,
    published: true,
  },
  {
    id: 'faq-13',
    category: 'Jobs',
    question: 'What happens if I miss the task submission deadline?',
    answer: 'Each job specifies an allotted deadline (e.g. 24 to 72 hours from acceptance). If a task expires without submission, the reserved slot is automatically released back to the marketplace and the task is marked Expired.',
    isPopular: false,
    order: 13,
    helpfulCount: 145,
    notHelpfulCount: 6,
    published: true,
  },
  {
    id: 'faq-14',
    category: 'Jobs',
    question: 'Can I cancel a job after taking it?',
    answer: 'Yes. If you realize you cannot fulfill the project requirements or word count, you can click "Abandon / Cancel Task" in your My Tasks panel. The slot will be promptly returned to the public pool.',
    isPopular: false,
    order: 14,
    helpfulCount: 112,
    notHelpfulCount: 8,
    published: true,
  },

  // 4. Submission & Versioning
  {
    id: 'faq-15',
    category: 'Submission',
    question: 'What file formats are accepted for job submissions?',
    answer: 'WEJOBS accepts .DOCX (Microsoft Word), .PDF (Portable Document Format), and .TXT (Plain Text) files. Submissions must adhere to the word count and structural guidelines defined on the job detail page.',
    isPopular: true,
    order: 15,
    helpfulCount: 289,
    notHelpfulCount: 5,
    published: true,
  },
  {
    id: 'faq-16',
    category: 'Submission',
    question: 'How does the submission versioning system work (v1, v2, v3)?',
    answer: 'Your first upload is logged as Version 1 (Initial). If a client or editor requests modifications, you can submit Version 2 (Revision) alongside revision notes. Version 3 represents the Final polish. All past versions remain permanently archived in your history for complete transparency.',
    isPopular: true,
    order: 16,
    helpfulCount: 265,
    notHelpfulCount: 4,
    published: true,
  },
  {
    id: 'faq-17',
    category: 'Submission',
    question: 'How long does editorial review take?',
    answer: 'Client editors and QA reviewers review submissions within 24 to 48 hours. You will receive an immediate in-app notification when your submission is Accepted, Rejected, or Marked for Revision.',
    isPopular: false,
    order: 17,
    helpfulCount: 178,
    notHelpfulCount: 3,
    published: true,
  },
  {
    id: 'faq-18',
    category: 'Submission',
    question: 'Can I include external reference links or research sources?',
    answer: 'Yes! The submission modal includes a dedicated "Reference Links & Research Citations" field where you can paste Google Docs, Drive references, or bibliography sources.',
    isPopular: false,
    order: 18,
    helpfulCount: 130,
    notHelpfulCount: 2,
    published: true,
  },

  // 5. Payment & Balances
  {
    id: 'faq-19',
    category: 'Payment',
    question: 'What currency does WEJOBS use for payments?',
    answer: 'All rewards, task compensations, and withdrawal balances on WEJOBS are denominated and settled strictly in US Dollars (USD $).',
    isPopular: true,
    isFeatured: true,
    order: 19,
    helpfulCount: 412,
    notHelpfulCount: 5,
    published: true,
  },
  {
    id: 'faq-20',
    category: 'Payment',
    question: 'What is the difference between Available Balance and Pending Balance?',
    answer: 'Pending Balance represents funds from submitted tasks currently undergoing editorial verification. Once the client or QA reviewer clicks "Accept", the funds instantly transfer into your Available Balance, ready for withdrawal.',
    isPopular: true,
    order: 20,
    helpfulCount: 388,
    notHelpfulCount: 8,
    published: true,
  },
  {
    id: 'faq-21',
    category: 'Payment',
    question: 'What are typical payment ranges for writing tasks?',
    answer: 'Payments scale with complexity, research depth, and word count: Microtasks range from $0.50 to $3.00, Short Articles/Editing $3.00 to $12.00, In-depth Essays & Stories $15.00 to $40.00, and Comprehensive Research Papers up to $85.00+ USD.',
    isPopular: false,
    order: 21,
    helpfulCount: 220,
    notHelpfulCount: 7,
    published: true,
  },
  {
    id: 'faq-22',
    category: 'Payment',
    question: 'Does WEJOBS charge any hidden platform commissions on my earnings?',
    answer: 'No. The USD payment displayed on the job card is the exact amount credited to your balance upon task acceptance. There are no hidden deductions from task rewards.',
    isPopular: false,
    order: 22,
    helpfulCount: 301,
    notHelpfulCount: 4,
    published: true,
  },

  // 6. Withdrawal & Recipient Verification
  {
    id: 'faq-23',
    category: 'Withdrawal',
    question: 'What is the minimum withdrawal threshold on WEJOBS?',
    answer: 'The minimum withdrawal amount is strictly $100.00 USD. You must have at least $100.00 in your Available Balance to submit a withdrawal request. Requests below $100.00 are automatically prevented.',
    isPopular: true,
    isFeatured: true,
    order: 23,
    helpfulCount: 520,
    notHelpfulCount: 14,
    published: true,
  },
  {
    id: 'faq-24',
    category: 'Withdrawal',
    question: 'What payout methods are supported?',
    answer: 'WEJOBS supports Direct Bank Wire Transfer, PayPal, Wise, Payoneer, and Crypto (USDT TRC20/ERC20). All payouts are disbursed directly in USD.',
    isPopular: true,
    order: 24,
    helpfulCount: 360,
    notHelpfulCount: 10,
    published: true,
  },
  {
    id: 'faq-25',
    category: 'Withdrawal',
    question: 'Why do I need to verify my payout recipient account before withdrawing?',
    answer: 'Recipient verification protects your earnings from unauthorized account hijacking and ensures payout accuracy. Submit your bank or payment provider details in the Withdrawals tab; our compliance team validates the recipient within 12-24 business hours.',
    isPopular: false,
    order: 25,
    helpfulCount: 275,
    notHelpfulCount: 6,
    published: true,
  },
  {
    id: 'faq-26',
    category: 'Withdrawal',
    question: 'How long does a withdrawal payout take to reach my account?',
    answer: 'Once approved by the finance team, PayPal, Wise, and USDT transfers typically arrive within 1 to 24 hours. International bank transfers may take 2 to 4 business days depending on intermediary banks.',
    isPopular: false,
    order: 26,
    helpfulCount: 240,
    notHelpfulCount: 7,
    published: true,
  },
  {
    id: 'faq-27',
    category: 'Withdrawal',
    question: 'Can I edit or cancel a withdrawal request once submitted?',
    answer: 'Once submitted, a withdrawal request is immutable to preserve accounting audit trails. If you made an error in your payout details, contact Help Center support immediately before the request reaches "Processing" status.',
    isPopular: false,
    order: 27,
    helpfulCount: 154,
    notHelpfulCount: 5,
    published: true,
  },

  // 7. Security & Privacy
  {
    id: 'faq-28',
    category: 'Security',
    question: 'How does WEJOBS protect user passwords and personal data?',
    answer: 'We utilize Argon2id salted password hashing—passwords are never stored in plaintext. All traffic is encrypted via TLS/HTTPS, cookies are hardened with HttpOnly flags, and client private contact information is never exposed to public viewers.',
    isPopular: false,
    order: 28,
    helpfulCount: 198,
    notHelpfulCount: 3,
    published: true,
  },
  {
    id: 'faq-29',
    category: 'Security',
    question: 'What is the purpose of the security CAPTCHA on login and registration?',
    answer: 'Interactive CAPTCHA validation prevents automated bots, scrapers, and credential stuffing attacks from overwhelming the platform and claiming task slots unfairly from legitimate human writers.',
    isPopular: false,
    order: 29,
    helpfulCount: 167,
    notHelpfulCount: 4,
    published: true,
  },
  {
    id: 'faq-30',
    category: 'Security',
    question: 'Are my submitted files kept private?',
    answer: 'Yes. All uploaded writing drafts and attachments are stored in private, access-controlled repositories. Only the task owner client and authorized editorial reviewers have permission to inspect your work.',
    isPopular: false,
    order: 30,
    helpfulCount: 182,
    notHelpfulCount: 2,
    published: true,
  },

  // 8. Rules & Guidelines
  {
    id: 'faq-31',
    category: 'Rules',
    question: 'What is WEJOBS’ policy on plagiarism and AI-generated content?',
    answer: 'All writing submissions must be 100% original human work. Submissions with uncredited copying or uncurated raw AI generation exceeding client tolerances will be rejected. Repeated plagiarism will trigger immediate account suspension.',
    isPopular: true,
    order: 31,
    helpfulCount: 395,
    notHelpfulCount: 12,
    published: true,
  },
  {
    id: 'faq-32',
    category: 'Rules',
    question: 'Can I communicate with clients outside of WEJOBS?',
    answer: 'No. Off-platform contact requests, sharing personal contact numbers, or attempting off-platform payment arrangements is strictly prohibited to safeguard both parties against fraud.',
    isPopular: false,
    order: 32,
    helpfulCount: 140,
    notHelpfulCount: 9,
    published: true,
  },
  {
    id: 'faq-33',
    category: 'Rules',
    question: 'What happens if a revision is requested on my submission?',
    answer: 'Clients are permitted up to 2 structured revision requests if the initial draft missed explicit instructions or word count targets. You have 24 hours to submit Version 2 addressing the specified points.',
    isPopular: false,
    order: 33,
    helpfulCount: 215,
    notHelpfulCount: 6,
    published: true,
  },

  // 9. Technical Issues
  {
    id: 'faq-34',
    category: 'Technical Issues',
    question: 'What should I do if a file upload fails or times out?',
    answer: 'Ensure your file is under 15MB and saved in .DOCX, .PDF, or .TXT format. Clear browser cache or disable aggressive ad-blockers that might intercept file data payloads. If the issue persists, reach out via the Help Center.',
    isPopular: false,
    order: 34,
    helpfulCount: 110,
    notHelpfulCount: 3,
    published: true,
  },
  {
    id: 'faq-35',
    category: 'Technical Issues',
    question: 'Does WEJOBS work seamlessly on mobile smartphones and tablets?',
    answer: 'Yes! WEJOBS features a fully responsive interface with dedicated mobile navigation, quick task claiming, and mobile-friendly document upload and dashboard tools.',
    isPopular: false,
    order: 35,
    helpfulCount: 185,
    notHelpfulCount: 2,
    published: true,
  },
  {
    id: 'faq-36',
    category: 'Technical Issues',
    question: 'How is the WEJOBS interface optimized for reading and writing?',
    answer: 'WEJOBS uses a dedicated high-contrast Editorial design system with custom typography pairing (Playfair Display & Plus Jakarta Sans) and balanced spacing to ensure maximum reading comfort across all devices.',
    isPopular: false,
    order: 36,
    helpfulCount: 156,
    notHelpfulCount: 1,
    published: true,
  },

  // 10. Clients & Task Owners
  {
    id: 'faq-37',
    category: 'Clients/Task Owners',
    question: 'Who posts writing jobs on the WEJOBS platform?',
    answer: 'Jobs are posted by verified publishers, digital marketing agencies, academic researchers, media syndicates, and corporate content teams looking for high-quality distributed writing contributions.',
    isPopular: true,
    order: 37,
    helpfulCount: 245,
    notHelpfulCount: 5,
    published: true,
  },
  {
    id: 'faq-38',
    category: 'Clients/Task Owners',
    question: 'Are client funds held in escrow before jobs are published?',
    answer: 'Yes. Every task posted on WEJOBS is fully backed by pre-funded escrow deposits for every available slot. Freelancers are 100% guaranteed to receive payment upon accepted submission.',
    isPopular: true,
    order: 38,
    helpfulCount: 370,
    notHelpfulCount: 6,
    published: true,
  },
  {
    id: 'faq-39',
    category: 'Clients/Task Owners',
    question: 'How do clients review and accept work?',
    answer: 'Task owners inspect submissions through their client dashboard, verify word count and guidelines compliance, and click Accept to trigger automatic USD balance disbursement.',
    isPopular: false,
    order: 39,
    helpfulCount: 160,
    notHelpfulCount: 4,
    published: true,
  },
  {
    id: 'faq-40',
    category: 'Clients/Task Owners',
    question: 'What happens if a client unfairly rejects my work?',
    answer: 'If you believe your submission met all stated acceptance criteria but was improperly rejected, you can open a dispute ticket in the Help Center. A WEJOBS editorial moderator will review both versions and issue a binding resolution.',
    isPopular: false,
    order: 40,
    helpfulCount: 290,
    notHelpfulCount: 7,
    published: true,
  },
];

// Helper to generate the exact 4421 tasks with rich real data across diverse categories and subtypes
export function generateSeedTasks(): Task[] {
  const tasks: Task[] = [];

  const subtypesByCategory: Record<MainCategory, string[]> = {
    Writing: [
      'Articles & Insights',
      'Blog Posts & Listicles',
      'Essays & Thought Leadership',
      'Copywriting & Ad Headlines',
      'Product Descriptions',
      'Social Media Captions',
      'Press Releases & Media Alerts',
      'Business Proposals & Pitches',
      'SEO Content & Topic Clusters',
      'Technical Writing & Documentation',
      'Weekly Industry Newsletters',
      'Case Studies & Customer Stories',
      'Executive Bios & Brand Stories',
      'Email Marketing Sequences',
    ],
    'Creative Writing': [
      'Novel Fiksi Sihir & Fantasi Tinggi',
      'Horor Supernatural & Legenda Urban',
      'Romantis Kontemporer & Drama Emosional',
      'Misteri, Kriminal & Detektif Thriller',
      'Fiksi Ilmiah Cyberpunk & Artificial Intelligence',
      'Cerita Pendek Sastra Kontemporer',
      'Space Opera & Eksplorasi Antariksa',
      'Naskah Drama & Dialog Karakter',
      'Puisi, Soneta & Lirik Tematik',
      'Worldbuilding & Panduan Lore Kerajaan',
      'Dystopia & Revolusi Masa Depan',
      'Kisah Petualangan Mitologi & Epik Kuno',
      'Cerita Horor Psikologis Ruang Tertutup',
      'Slice-of-Life & Narasi Realisme Magis',
    ],
    Editing: [
      'Proofreading & Typo Correction',
      'Grammar, Syntax & Punctuation Polish',
      'Structural & Developmental Editing',
      'Line-by-Line Prose Refinement',
      'Simplification & Plain Language Conversion',
      'Fact-Checking & Source Citation Audit',
      'Academic Formatting (APA 7, MLA 9, Chicago)',
      'Tone Alignment & Brand Voice Consistency',
      'Medical & Scientific Document Proofreading',
      'Legal Disclaimer & Privacy Policy Review',
    ],
    'Research & Writing': [
      'Literature Reviews & Meta-Synthesis',
      'Executive Tech & Industry Summaries',
      'Comparative Market & Competitor Briefs',
      'Deep-Dive Whitepapers',
      'Clinical Trial & Medical Research Digests',
      'ESG, Climate & Sustainability Reports',
      'Fintech & Monetary Policy Briefs',
      'Urban Planning & Smart Infrastructure Studies',
      'Cognitive Neuroscience & AI Ethics Reviews',
      'International Relations & Trade Policy Briefs',
    ],
    Translation: [
      'English to Indonesian Localization',
      'Indonesian to English Academic Translation',
      'Corporate Contract & Legal Localization',
      'Software UI & Mobile App String Localization',
      'Documentary Subtitling & Audiovisual Translation',
      'Technical User Manual & SDK Translation',
      'Creative Fiction & Novel Translation',
      'Marketing Campaign Transcreation',
    ],
    Transcription: [
      'Audio Podcast Transcription with Timestamps',
      'Video Interview & Panel Discussion Minutes',
      'Investor Earnings Call & AGM Transcripts',
      'Medical Diagnosis & Clinical Consultation Notes',
      'Legal Deposition & Courtroom Audio Records',
      'Academic Keynote & University Lecture Minutes',
      'Focus Group Qualitative Research Transcription',
    ],
    'Data Annotation': [
      'Sentiment Analysis & Customer Intent Tagging',
      'Named Entity Recognition (NER) in Financial News',
      'Content Safety, Toxicity & Policy Moderation',
      'Multi-turn AI Dialogue Evaluation & Scoring',
      'Question-Answering Factuality Verification',
      'Semantic Search Query Relevance Labeling',
      'Editorial Dataset Cleaning & Taxonomy Tagging',
    ],
  };

  const clientPool = [
    { name: 'Aurora Media Network', rating: 4.9, jobsPosted: 642 },
    { name: 'Horizon Press Syndicate', rating: 4.8, jobsPosted: 598 },
    { name: 'Veritas Publishing House', rating: 5.0, jobsPosted: 715 },
    { name: 'OmniContent Digital Group', rating: 4.7, jobsPosted: 476 },
    { name: 'Nexus Academic Labs', rating: 4.9, jobsPosted: 680 },
    { name: 'Prism Creative Agency', rating: 4.8, jobsPosted: 510 },
    { name: 'Lumina Literary Studio', rating: 4.9, jobsPosted: 589 },
    { name: 'Global Insight Review', rating: 5.0, jobsPosted: 664 },
    { name: 'Apex Tech Digest', rating: 4.8, jobsPosted: 467 },
    { name: 'Starlight Fiction Guild', rating: 4.9, jobsPosted: 633 },
    { name: 'BlueWave Editorial Collective', rating: 4.7, jobsPosted: 492 },
    { name: 'Solaria Educational Trust', rating: 5.0, jobsPosted: 654 },
    { name: 'Arcadia Story Studio', rating: 4.9, jobsPosted: 445 },
    { name: 'Vanguard Media Group', rating: 4.8, jobsPosted: 612 },
    { name: 'Chronicle Bookworks', rating: 5.0, jobsPosted: 720 },
    { name: 'Pacific Research Institute', rating: 4.9, jobsPosted: 525 },
    { name: 'Helios Science & Tech Press', rating: 5.0, jobsPosted: 615 },
    { name: 'Mythos & Lore Guild', rating: 4.9, jobsPosted: 490 },
    { name: 'Quantum Digital Media', rating: 4.8, jobsPosted: 445 },
    { name: 'Atlas Localization & Transmedia', rating: 4.9, jobsPosted: 680 },
    { name: 'Meridian Financial Review', rating: 5.0, jobsPosted: 570 },
    { name: 'Echo Sound & Audio Transcription', rating: 4.8, jobsPosted: 495 },
    { name: 'CyberCore Tech Briefs', rating: 4.9, jobsPosted: 540 },
    { name: 'Nusantara Literary Circle', rating: 5.0, jobsPosted: 690 },
    { name: 'Astraea Academic Publishing', rating: 4.9, jobsPosted: 585 },
    { name: 'Velocity Copywriting Studio', rating: 4.8, jobsPosted: 510 },
    { name: 'Silverleaf Nature & ESG Review', rating: 4.9, jobsPosted: 460 },
    { name: 'Griffin Mystery & Thriller Press', rating: 5.0, jobsPosted: 570 },
    { name: 'Zenith Linguistic Intelligence', rating: 4.9, jobsPosted: 710 },
    { name: 'Alpha Omega Publications', rating: 4.8, jobsPosted: 480 },
    { name: 'Elysium Interactive Fiction', rating: 4.9, jobsPosted: 515 },
    { name: 'Beacon Health & Medical Digest', rating: 5.0, jobsPosted: 630 },
  ];

  const slotCapacities = [15, 25, 30, 45, 60, 80, 100, 120, 150];

  const topicMatrices: Record<MainCategory, string[]> = {
    Writing: [
      'Transformasi Cloud Native & Arsitektur Microservices Modern',
      'Strategi Pemasaran Konten B2B SaaS dengan Konversi Tertinggi',
      'Penerapan Energi Terbarukan & Efisiensi Baterai Solid-State',
      'Manajemen Waktu dan Produktivitas Kerja Hybrid bagi Freelancer',
      'Keamanan Siber: Mengamankan Endpoint di Era Remote Work',
      'Tren Investasi FinTech dan Inklusi Keuangan Digital di Asia Tenggara',
      'Panduan Membangun Brand Persona Autentik di Media Sosial',
      'Analisis Pertumbuhan E-Commerce D2C dan Logistik Terpadu',
      'Optimalisasi SEO Berbasis Search Intent dan Entitas Semantik',
      'Pengembangan Startup Teknologi Berkelanjutan Menuju Profitabilitas',
      'Pemanfaatan Data Analytics dalam Pengambilan Keputusan Bisnis',
      'Desain Pengalaman Pengguna (UX) Minimalis pada Aplikasi Keuangan',
      'Strategi Storytelling Korporat untuk Laporan Keberlanjutan Perusahaan',
      'Panduan Praktis Manajemen Risiko Finansial bagi Usaha Kecil',
      'Dampak Automasi dan Robotika pada Rantai Pasok Manufaktur',
      'Revolusi Pendidikan Digital & Pembelajaran Mandiri Adaptif',
      'Evolusi Arsitektur Perangkat Lunak Serverless dan Edge Computing',
      'Pembangunan Komunitas Pelanggan Loyal Melalui Program Advokasi',
    ],
    'Creative Writing': [
      'Pertempuran Menara Kristal dan Segel Kuno Kerajaan Eloria',
      'Misteri Rumah Kosong di Puncak Perbukitan Kabut Hitam',
      'Pertemuan Tak Terduga di Kedai Kopi Hujan Jakarta 2026',
      'Teka-teki Hilangnya Surat Wasiat Pewaris Konglomerat Batavia',
      'Koloni Manusia Pertama di Kubah Es Bawah Tanah Bulan Europa',
      'Perjalanan Pulang Seorang Veteran Perang Menuju Kampung Halaman',
      'Konflik Rahasia Antara Dua Pengacara Terbaik di Pengadilan Kota',
      'Kumpulan Puisi Refleksi Senja, Kerinduan, dan Harapan Baru',
      'Panduan Lore Sejarah Peradaban Kuno Suku Penjaga Api Abadi',
      'Pelarian Agen Rahasia dari Kota Megapolis Cyberpunk Neo-Sunda',
      'Kisah Detektif Supernatural Mengusut Kasus Bayangan Tanpa Tubuh',
      'Persahabatan Dua Astronom Amatir yang Menemukan Sinyal Pulsar Misterius',
      'Dilema Moral Sang Tabib Istana Menghadapi Wabah Sihir Hitam',
      'Kenangan Musim Gugur di Kyoto: Janji yang Tertinggal 10 Tahun',
      'Pemberontakan Awak Kapal Induk Antariksa Melawan AI Otoriter',
      'Misteri Catatan Harian Penjelajah Waktu yang Tertinggal di Perpustakaan Tua',
      'Kisah Cinta Terlarang Dua Pewaris Dinasti Pedagang Sutra Kuno',
      'Ritual Terakhir Penjaga Hutan Lindung Sebelum Gerhana Bulan Merah',
    ],
    Editing: [
      'Naskah Jurnal Medis & Terapi Farmasi Klinis 3.000 Kata',
      'Buku Panduan Strategi Investasi Saham dan Portofolio Bisnis 5.000 Kata',
      'Dokumen Ketentuan Layanan & Kebijakan Privasi Hukum Konsumen',
      'Artikel Ilmiah Arsitektur Komputasi Kuantum Standar IEEE',
      'Bab 1 Sampai 4 Novel Fiksi Sejarah Dinasti Majapahit',
      'Laporan Tahunan Tata Kelola Lingkungan dan Sosial (ESG) Perusahaan',
      'Whitepaper Protokol Konsensus Blockchain Terdesentralisasi',
      'Siaran Pers Peluncuran Produk Perangkat Lunak AI Enterprise',
      'Kumpulan Esai Akademik Psikologi Kognitif Mahasiswa Pascasarjana',
      'Panduan Teknis Integrasi API Pembayaran Multi-Mata Uang',
      'Naskah Memoar Perjalanan Hidup Tokoh Filantropi Nasional',
      'Laporan Riset Geopolitik Perdagangan Bebas Indo-Pasifik',
    ],
    'Research & Writing': [
      'Review Literatur: Pengaruh Ritme Sirkadian terhadap Daya Ingat Manusia',
      'Analisis Komparatif Efisiensi Sel Surya Perovskite vs Silikon Tradisional',
      'Riset Pasar: Perilaku Belanja Konsumen Generasi Z pada Platform Live-Stream',
      'Ringkasan Uji Klinis Terapi Imunoterapi Kanker Fase III',
      'Studi Komparatif Regulasi Keuangan Digital Lintas Yurisdiksi 2026',
      'Tinjauan Akademik Sistem Pengolahan Air Limbah Perkotaan Cerdas',
      'Sintesis Kebijakan Moneter Bank Sentral Global dalam Menekan Inflasi',
      'Panduan Riset Neuroplastisitas Otak Dewasa dan Akuisisi Bahasa Cepat',
      'Analisis Rantai Pasokan Global Bahan Mentah Logam Tanah Jarang (Rare Earth)',
      'Studi Dampak Sosial-Ekonomi Infrastruktur Kereta Cepat Lintas Provinsi',
      'Riset Tata Kelola AI Etis dalam Pengambilan Keputusan Publik',
      'Evaluasi Keberlanjutan Ekosistem Terumbu Karang Akibat Kenaikan Suhu Laut',
    ],
    Translation: [
      'Kontrak Lisensi Perangkat Lunak & Perjanjian Kemitraan Dagang Internasional',
      'Manual Pengoperasian Alat Medis USG Digital Portabel (English ke Indonesia)',
      'Lokalisasi Seluruh Antarmuka Aplikasi Perbankan Digital Mobile (ID ke EN)',
      'Subtitle Naskah Film Dokumenter Konservasi Satwa Liar 45 Menit',
      'Buku Panduan Teknis Arsitektur Keamanan Siber Kubernetes (EN ke ID)',
      'Naskah Cerpen Sastra Kontemporer untuk Antologi Internasional (ID ke EN)',
      'Paket Materi Pemasaran dan Brosur Pariwisata Budaya (English ke Indonesia)',
      'Dokumen Kebijakan Kepatuhan Anti-Pencucian Uang Bank Global (EN ke ID)',
    ],
    Transcription: [
      'Rekaman Wawancara Eksklusif Founder Startup Seri C (60 Menit)',
      'Sesi Diskusi Panel Simposium Internasional Energi Terbarukan (45 Menit)',
      'Laporan Panggilan Pendapatan Keuangan Kuartal IV Emiten Teknologi (35 Menit)',
      'Konsultasi Medis Spesialis Jantung & Pembahasan Diagnostik (30 Menit)',
      'Sidang Arbitrase Bisnis Dagang Internasional dengan Notasi Pembicara (50 Menit)',
      'Kuliah Umum Profesor Tamu tentang Teori Komputasi Terapan (60 Menit)',
      'Focus Group Discussion Riset Preferensi Konsumen Produk Minuman Sehat (40 Menit)',
    ],
    'Data Annotation': [
      'Anotasi Sentimen dan Emosi pada 1.000 Ulasan Pelanggan E-Commerce',
      'Labeling Named Entity Recognition (NER) Entitas Finansial pada Berita Saham',
      'Moderasi Konten & Penilaian Kepatuhan Teks Komunitas Forum Publik',
      'Evaluasi Kualitas Tanggapan Tanya-Jawab Model Bahasa Percakapan',
      'Verifikasi Faktual Pernyataan Berita dengan Sumber Validasi Primer',
      'Pelabelan Relevansi Kata Kunci Pencarian Toko Online (Relevance Ranking)',
      'Klasifikasi Niat Pengguna (Intent Classification) pada Chatbot Layanan Pelanggan',
    ],
  };

  const categories: MainCategory[] = [
    'Writing',
    'Creative Writing',
    'Editing',
    'Research & Writing',
    'Translation',
    'Transcription',
    'Data Annotation',
  ];

  const totalTarget = 4421;
  const fullTarget = 240; // Realistic filled tasks, leaving 4,181 available open tasks

  for (let i = 1; i <= totalTarget; i++) {
    const categoryIndex = (i - 1) % categories.length;
    const category = categories[categoryIndex];
    const subtypes = subtypesByCategory[category];
    const subtype = subtypes[(i - 1) % subtypes.length];
    const topics = topicMatrices[category];
    const topic = topics[(i - 1) % topics.length];
    const client = clientPool[(i - 1) % clientPool.length];
    const capacity = slotCapacities[(i - 1) % slotCapacities.length];

    // Determine batch number & realistic remaining slot distribution
    const batchNum = Math.floor((i - 1) / categories.length) + 1;
    const isFull = i <= fullTarget;
    const remainingSlots = isFull
      ? 0
      : Math.max(1, Math.floor(capacity * (0.15 + ((i * 19) % 72) / 100)));

    // Construct clear, distinct, and professional task title
    let baseAction = 'Tulis';
    if (category === 'Editing') baseAction = 'Sunting & Proofread';
    else if (category === 'Research & Writing') baseAction = 'Susun Riset & Analisis';
    else if (category === 'Translation') baseAction = 'Terjemahkan Dokumen';
    else if (category === 'Transcription') baseAction = 'Transkripsi Audio';
    else if (category === 'Data Annotation') baseAction = 'Anotasi & Validasi Data';

    const title = `${baseAction} ${subtype}: ${topic} (Batch #${batchNum})`;

    // Realistic tiered payment in USD based on discipline and scope
    let payment = 3.50;
    if (category === 'Writing') {
      payment = Number((4.50 + ((i * 7) % 32) * 0.95).toFixed(2));
    } else if (category === 'Creative Writing') {
      payment = Number((8.50 + ((i * 11) % 48) * 1.65).toFixed(2));
    } else if (category === 'Editing') {
      payment = Number((3.50 + ((i * 5) % 28) * 0.80).toFixed(2));
    } else if (category === 'Research & Writing') {
      payment = Number((10.00 + ((i * 13) % 45) * 1.75).toFixed(2));
    } else if (category === 'Translation') {
      payment = Number((6.50 + ((i * 9) % 35) * 1.20).toFixed(2));
    } else if (category === 'Transcription') {
      payment = Number((5.50 + ((i * 8) % 30) * 1.05).toFixed(2));
    } else {
      payment = Number((2.75 + ((i * 4) % 22) * 0.65).toFixed(2));
    }

    let wordCount = '900 - 1.400 kata';
    let estimatedTime = '1.5 jam';
    let submissionFormat = 'DOCX, PDF, TXT';
    let writingStyle = 'Mengalir, profesional, dan lugas dengan tata bahasa baku.';
    let objective = '';
    let targetAudience = '';
    let instructions: string[] = [];
    let structure: string[] = [];
    let requirements: string[] = [];

    if (category === 'Writing') {
      const wOptions = ['700 - 1.100 kata', '1.000 - 1.500 kata', '1.500 - 2.400 kata'];
      wordCount = wOptions[i % wOptions.length];
      estimatedTime = ['1 jam', '1.5 jam', '2 jam'][i % 3];
      writingStyle = 'Informatif, engaging, ramah pembaca, dan teroptimasi SEO secara alami tanpa keyword stuffing.';
      objective = `Menghasilkan artikel atau materi tulisan komprehensif mengenai "${topic}" yang mengedukasi pembaca dengan argumen berbobot, data mutakhir, serta tata bahasa profesional yang mudah dicerna.`;
      targetAudience = 'Pembaca umum terpelajar, profesional muda, praktisi bisnis, atau komunitas industri terkait.';
      instructions = [
        `Tulis naskah dengan panjang target ${wordCount} yang berfokus pada inti topik "${topic}".`,
        'Buka tulisan dengan pengantar (hook) yang menarik perhatian pembaca dan perkenalkan masalah utama.',
        'Bagi pembahasan menjadi minimal 3 hingga 5 sub-judul terstruktur (H2/H3) dengan penjelasan konkret dan contoh aplikatif.',
        'Gunakan bahasa Indonesia baku yang mengalir sesuai kaidah EYD/PUEBI tanpa typo atau kalimat rancu.',
        'Sertakan kesimpulan atau ringkasan aksi nyata di akhir tulisan.',
      ];
      structure = [
        '1. Judul Utama Menarik & Relevan',
        '2. Paragraf Pembuka (Hook, Latar Belakang & Pernyataan Masalah)',
        '3. Sub-bagian 1: Penjelasan Konsep & Kondisi Terkini',
        '4. Sub-bagian 2: Analisis Mendalam & Contoh Kasus / Solusi Nyata',
        '5. Sub-bagian 3: Dampak & Manfaat Praktis bagi Audiens',
        '6. Penutup (Kesimpulan Rangkuman & Rekomendasi Aksi)',
      ];
      requirements = [
        '100% karya orisinal bebas dari plagiarisme (skor orisinalitas di atas 90%).',
        `Jumlah kata memenuhi ambang batas target (${wordCount}).`,
        'Format teks rapi dengan heading, bullet points, dan paragraf tidak lebih dari 4-5 kalimat per blok.',
        'Dikirim tepat waktu sebelum batas deadline habis setelah klaim slot.',
      ];
    } else if (category === 'Creative Writing') {
      const cwOptions = ['1.500 - 2.500 kata', '2.500 - 4.000 kata', '4.000 - 6.000 kata'];
      wordCount = cwOptions[i % cwOptions.length];
      estimatedTime = ['2 jam', '3 jam', '4 jam'][i % 3];
      writingStyle = 'Deskriptif, menggugah emosi, kaya majas, dengan dialog karakter yang hidup dan dinamis.';
      objective = `Membangun karya fiksi kreatif bertema "${topic}" dengan narasi mendalam, penokohan yang kuat, latar suasana imersif, serta alur cerita yang memikat dari awal hingga resolusi akhir.`;
      targetAudience = 'Penikmat fiksi sastra, pembaca novel digital, komunitas kreatif, atau audiens buku antologi.';
      instructions = [
        `Kembangkan cerita pendek atau bab novel dengan panjang ${wordCount} berpusat pada premis "${topic}".`,
        'Ciptakan konflik utama yang jelas dengan motivasi tokoh yang beralasan dan dapat dipercaya.',
        'Gunakan teknik "show, don\'t tell" untuk mendeskripsikan emosi, suasana lingkungan, dan ketegangan aksi.',
        'Susun dialog percakapan antar tokoh dengan tanda baca percakapan naskah yang benar dan natural.',
        'Berikan penyelesaian atau klimaks yang memuaskan dan berkesan bagi pembaca.',
      ];
      structure = [
        '1. Judul Karya Fiksi & Sinopsis Pendek (1-2 Paragraf)',
        '2. Babak 1: Pengenalan Latar (Worldbuilding), Tokoh Utama & Pemicu Cerita (Inciting Incident)',
        '3. Babak 2: Eskalasi Konflik, Rintangan, dan Dilema Internal/Eksternal',
        '4. Babak 3: Titik Puncak Ketegangan (Klimaks Cerita)',
        '5. Babak 4: Penurunan & Resolusi Akhir (Ending/Epilog)',
      ];
      requirements = [
        'Karya fiksi murni orisinal dan tidak meniru karya yang telah berhak cipta.',
        `Panjang naskah cerita memenuhi rentang kuota (${wordCount}).`,
        'Penulisan dialog menggunakan kaidah tanda petik dan tanda baca dialog yang tepat.',
        'Konsistensi sudut pandang (Point of View - POV) dari awal hingga akhir naskah.',
      ];
    } else if (category === 'Editing') {
      const eOptions = ['1.500 - 2.800 kata naskah', '3.000 - 5.000 kata naskah', '5.000 - 8.000 kata naskah'];
      wordCount = eOptions[i % eOptions.length];
      estimatedTime = ['1 jam', '1.5 jam', '2.5 jam'][i % 3];
      submissionFormat = 'DOCX (Track Changes), PDF Anotasi, atau Teks Perbandingan';
      writingStyle = 'Presisi, teliti, mempertahankan suara asli penulis dengan penyempurnaan struktur & tata bahasa.';
      objective = `Melakukan penyuntingan menyeluruh (proofreading, grammar, ejaan, konsistensi istilah, dan kelancaran alur) pada dokumen bertopik "${topic}" agar siap terbit tanpa kesalahan teknis.`;
      targetAudience = 'Penerbit, penulis profesional, akademisi, atau lembaga korporat pemilik naskah.';
      instructions = [
        `Periksa dan koreksi seluruh naskah (${wordCount}) terkait topik "${topic}".`,
        'Koreksi kesalahan ketik (typo), ejaan kata baku sesuai KBBI/EYD, dan tanda baca.',
        'Perbaiki kalimat ambigu, kalimat berulang, atau struktur sintaksis yang tidak efektif.',
        'Pastikan konsistensi istilah teknis, nama tokoh, format penulisan angka, dan kapitalisasi.',
        'Sertakan ringkasan catatan editor (Editorial Summary) berisi poin perbaikan yang telah dilakukan.',
      ];
      structure = [
        '1. Ringkasan Catatan Editor (Overview Perubahan Utama & Catatan Kualitas)',
        '2. Naskah Hasil Suntingan Bersih (Clean Final Version)',
        '3. Lampiran Catatan Khusus / Glosarium Istilah yang Diseragamkan (Opsional)',
      ];
      requirements = [
        'Nol toleransi salah ketik dan kesalahan tata bahasa pada versi akhir.',
        'Mempertahankan maksud dan pesan orisinal penulis tanpa mengubah makna esensial.',
        'Dokumen dikirim dalam format rapi dengan penjelasan catatan perubahan jika diperlukan.',
      ];
    } else if (category === 'Research & Writing') {
      const rOptions = ['1.500 - 2.500 kata', '2.500 - 4.000 kata', '4.000 - 6.000 kata'];
      wordCount = rOptions[i % rOptions.length];
      estimatedTime = ['2.5 jam', '3.5 jam', '5 jam'][i % 3];
      writingStyle = 'Akademik, analitis, objektif, berbasis bukti empiris, dan terstruktur ketat.';
      objective = `Menyusun laporan riset mendalam atau sintesis akademik mengenai "${topic}" yang mengkaji latar belakang masalah, tinjauan literatur kredibel, analisis komparatif, serta rekomendasi strategis.`;
      targetAudience = 'Peneliti, pembuat kebijakan, eksekutif industri, analis investasi, atau akademisi.';
      instructions = [
        `Lakukan tinjauan literatur dan analisis data mengenai "${topic}" sepanjang ${wordCount}.`,
        'Gunakan minimal 3-5 sumber referensi kredibel (jurnal ilmiah, laporan lembaga resmi, data statistik).',
        'Sajikan data fakta dengan tabel, poin komparasi, atau penjelasan tren yang valid.',
        'Tuliskan sitasi dan daftar pustaka dengan format standar (misal APA 7th edition).',
        'Berikan kesimpulan berbasis bukti dengan rekomendasi langkah strategis ke depan.',
      ];
      structure = [
        '1. Ringkasan Eksekutif (Executive Summary / Abstract)',
        '2. Latar Belakang & Rumusan Masalah Riset',
        '3. Tinjauan Literatur & Metodologi Analisis',
        '4. Temuan Utama & Analisis Data Empiris',
        '5. Implikasi Kebijakan / Rekomendasi Strategis Industri',
        '6. Daftar Pustaka & Sumber Referensi Lengkap',
      ];
      requirements = [
        'Data dan klaim fakta harus dapat diverifikasi dengan sumber yang sah.',
        'Bebas plagiarisme dan bukan ringkasan asal-asalan.',
        `Panjang dokumen memenuhi kuota riset (${wordCount}).`,
        'Format penulisan sitasi konsisten dan baku.',
      ];
    } else if (category === 'Translation') {
      const tOptions = ['800 - 1.400 kata naskah', '1.500 - 2.500 kata naskah', '2.500 - 4.500 kata naskah'];
      wordCount = tOptions[i % tOptions.length];
      estimatedTime = ['1 jam', '2 jam', '3 jam'][i % 3];
      writingStyle = 'Akurat, idiomatik, kontekstual, dan mengalir secara alami dalam bahasa target.';
      objective = `Menerjemahkan dokumen resmi bertema "${topic}" dari bahasa sumber ke bahasa target secara presisi, mempertahankan nuansa makna, istilah teknis industri, serta keindahan gaya bahasa.`;
      targetAudience = 'Klien korporat, pengguna aplikasi internasional, pembaca multibahasa, atau lembaga legal.';
      instructions = [
        `Terjemahkan materi naskah (${wordCount}) mengenai "${topic}".`,
        'Pahami konteks keseluruhan dokumen sebelum mulai menerjemahkan kalimat per kalimat.',
        'Gunakan padanan istilah yang lazim dan baku di industri terkait.',
        'Hindari terjemahan harfiah kaku (machine-like) yang merusak kelancaran baca.',
        'Periksa kembali konsistensi istilah teknis di seluruh halaman dokumen.',
      ];
      structure = [
        '1. Tabel Glosarium Istilah Kunci (Source Term -> Target Term)',
        '2. Teks Hasil Terjemahan Lengkap (Bilingual / Target Only)',
        '3. Catatan Penerjemah (Translator Notes) untuk Bagian Kontekstual Khusus',
      ];
      requirements = [
        'Akurasi terjemahan 100% tanpa ada kalimat atau paragraf yang terlewat (omission).',
        'Gaya bahasa mengalir wajar bagi penutur asli bahasa target.',
        'Format tata letak naskah tetap konsisten dengan dokumen sumber.',
      ];
    } else if (category === 'Transcription') {
      const trOptions = ['20 - 35 Menit Audio', '35 - 55 Menit Audio', '55 - 80 Menit Audio'];
      wordCount = trOptions[i % trOptions.length];
      estimatedTime = ['1.5 jam', '2.5 jam', '3.5 jam'][i % 3];
      submissionFormat = 'DOCX, TXT, SRT (jika bersubtitle)';
      writingStyle = 'Verbatim akurat, notasi penutur jelas, dengan tanda waktu (timestamp) teratur.';
      objective = `Mentranskripsikan rekaman audio/video bertema "${topic}" ke dalam teks tertulis yang bersih, akurat hingga 99%, dengan pembedaan pembicara (Speaker Diarization) dan penanda waktu.`;
      targetAudience = 'Produser media, peneliti kualitatif, lembaga hukum, atau tim dokumentasi acara.';
      instructions = [
        `Dengarkan rekaman audio berdurasi ${wordCount} mengenai "${topic}".`,
        'Tuliskan ucapan setiap pembicara dengan label jelas (misal: Speaker 1, Speaker 2, atau Nama Narasumber).',
        'Sertakan penanda waktu (timestamp) setiap 2-3 menit atau setiap terjadi pergantian pembicara.',
        'Gunakan format tanda [inaudible 00:12:34] jika terdapat kata yang tidak terdengar jelas karena gangguan suara.',
        'Lakukan proofreading kembali sambil memutar ulang audio untuk memastikan tidak ada kata yang terlewat.',
      ];
      structure = [
        '1. Informasi Header: Judul Rekaman, Total Durasi, Daftar Nama Narasumber',
        '2. Transkrip Utuh Lengkap dengan Format [HH:MM:SS] Speaker Name: Dialog',
        '3. Ringkasan 3-5 Poin Inti Pembahasan (Executive Highlights)',
      ];
      requirements = [
        'Tingkat akurasi transkrip di atas 98%.',
        'Pemberian timestamp yang tepat dan sinkron.',
        'Ejaan nama orang, istilah teknis, dan lokasi ditulis dengan benar.',
      ];
    } else {
      // Data Annotation
      const daOptions = ['300 - 600 Baris Data', '600 - 1.000 Baris Data', '1.000 - 1.500 Baris Data'];
      wordCount = daOptions[i % daOptions.length];
      estimatedTime = ['1 jam', '2 jam', '3 jam'][i % 3];
      submissionFormat = 'JSON, CSV, XLSX';
      writingStyle = 'Ketat mengikuti panduan taksonomi, teliti, dan konsisten antar baris data.';
      objective = `Melakukan anotasi, pelabelan kategori, ekstraksi entitas, atau validasi fakta pada dataset bertema "${topic}" sesuai panduan anotasi (guideline) resmi untuk pelatihan model AI.`;
      targetAudience = 'Tim AI / Machine Learning, data scientist, dan pengembang sistem kecerdasan buatan.';
      instructions = [
        `Buka lembar dataset (${wordCount}) terkait topik "${topic}".`,
        'Baca teliti setiap baris sampel teks dan tentukan label kelas / entitas sesuai kriteria taksonomi.',
        'Pastikan tidak ada baris data yang terlewat atau dikosongkan tanpa anotasi.',
        'Gunakan format nilai label yang seragam (case-sensitive sesuai panduan).',
        'Ekspor hasil anotasi dalam format file yang diminta (.CSV atau .JSON valid).',
      ];
      structure = [
        '1. Ringkasan Statistik Anotasi (Total Baris, Distribusi Label)',
        '2. Dataset Lengkap Teranotasi (ID, Input Text, Label/Annotation, Confidence Note)',
        '3. Catatan Kasus Ambigu / Edge Cases yang Ditemukan',
      ];
      requirements = [
        'Tingkat kesesuaian anotasi (Inter-Annotator Agreement) di atas 95%.',
        'Format file data valid dan tidak ada korupsi karakter encoding (UTF-8).',
        'Diselesaikan sebelum batas waktu berakhir.',
      ];
    }

    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 48)}-task-${i}`;

    tasks.push({
      id: `task-${i}`,
      title,
      slug,
      category,
      subtype,
      payment,
      estimatedTime,
      wordCount,
      totalSlots: capacity,
      remainingSlots,
      deadlineHours: 24 + ((i * 6) % 72),
      clientName: client.name,
      clientRating: client.rating,
      clientJobsPosted: client.jobsPosted,
      description: `Klien resmi ${client.name} membuka komisi pekerjaan ${category} (${subtype}) terverifikasi di WEJOBS dengan topik spesifik: "${topic}". Pekerjaan ini wajib diselesaikan secara profesional, orisinal, dan memenuhi standar editorial ketat. Dana kompensasi sebesar $${payment.toFixed(2)} USD telah diamankan di sistem escrow WEJOBS.`,
      objective,
      targetAudience,
      instructions,
      structure,
      writingStyle,
      submissionFormat,
      requirements,
      restrictions: [
        'Dilarang keras menyalin atau menduplikasi karya pihak lain tanpa izin resmi (Plagiarisme 0%).',
        'Dilarang mencantumkan kontak pribadi (email, nomor WhatsApp, rekening bank) di dalam naskah.',
        'Dilarang mengirimkan teks acak atau placeholder yang tidak bermakna dan menyimpang dari topik naskah.',
        'Dilarang membagikan materi naskah klien ke pihak ketiga tanpa izin kerahasiaan (NDA).',
      ],
      acceptanceCriteria: [
        'Panjang naskah atau volume output memenuhi ambang batas kuota yang ditentukan.',
        'Mengikuti struktur pembahasan, petunjuk teknis, dan nada tulisan yang diminta klien.',
        'Skor kemiripan plagiarisme di bawah 10% (100% karya orisinal).',
        'Naskah selesai secara utuh, rapi, dan siap dipublikasikan atau diintegrasikan langsung.',
      ],
      revisionPolicy:
        'Tersedia 2 kali kesempatan revisi gratis jika editor klien memerlukan penyesuaian detail dalam waktu 24 jam setelah penyerahan naskah.',
      status: remainingSlots > 0 ? 'available' : 'full',
      featured: i % 25 === 0,
      createdAt: new Date(Date.now() - (totalTarget - i) * 600000).toISOString(),
    });
  }

  return tasks;
}
