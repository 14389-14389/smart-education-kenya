export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/programs', label: 'Our Programs' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
  { href: '/donate', label: 'Donate' },
];

export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/254742180636',
  twitter: 'https://twitter.com/smarteducation',
  facebook: 'https://facebook.com/smarteducation',
};

export const PROGRAMS_DATA = [
  {
    id: 'mentorship-career-guidance',
    imageSrc: '/assets/mentorship and carer guidance.jpg',
    title: 'Mentorship & Career Guidance',
    shortDescription:
      'Connecting students with role models and equipping them with knowledge about future career paths.',
    longDescription:
      "Our Mentorship & Career Guidance program is the cornerstone of our mission. We connect students in underserved areas with successful professionals, university students, and community leaders who serve as role models and mentors. Through one-on-one sessions, group workshops, and inspiring talks, we aim to build confidence, broaden horizons, and instill a sense of ambition. The program also equips students with practical knowledge about various career paths, effective study skills, and the tools needed to set and achieve their long-term goals.",
    objectives: [
      'To provide students with positive role models.',
      'To expose students to a wide range of career opportunities.',
      'To develop essential life skills like communication and goal-setting.',
      'To build self-esteem and motivation to pursue higher education.',
    ],
  },
  {
    id: 'student-awards-recognition',
    imageSrc: '/assets/student awards.jpg',
    title: 'Student Awards & Recognition',
    shortDescription:
      'Awarding top-performing and committed students to foster a spirit of excellence and keep them motivated.',
    longDescription:
      'To foster a spirit of healthy competition, dedication, and academic excellence, we have established the Student Awards & Recognition program. In partnership with local schools, we identify and award the most committed, improved, and top-performing students at the end of each term. This recognition, which often includes certificates, school supplies, and trophies, serves as a powerful motivator.',
    objectives: [
      'To motivate students to achieve academic excellence.',
      'To recognize and reward hard work and commitment.',
      'To foster a positive and competitive learning environment.',
      'To reduce dropout rates by keeping students engaged.',
    ],
  },
  {
    id: 'girls-dignity-project',
    imageSrc: '/assets/girls dignity project.jpg',
    title: 'Girls’ Dignity Project',
    shortDescription:
      'Providing sanitary pads to ensure girls can attend school with dignity and without interruption.',
    longDescription:
      "We are fiercely committed to keeping girls in school by tackling the widespread issue of period poverty. The Girls' Dignity Project distributes sanitary pads to school-going girls, ensuring that menstruation never becomes a barrier to their education. Beyond distribution, the program includes sessions on menstrual health and hygiene, empowering girls with knowledge and breaking down stigmas.",
    objectives: [
      'To reduce absenteeism among schoolgirls due to menstruation.',
      'To provide essential sanitary products to girls in need.',
      'To educate girls on menstrual health and hygiene.',
      'To boost the confidence and self-esteem of female students.',
    ],
  },
  {
    id: 'scholarship-assistance-program',
    imageSrc: '/assets/scholarships.jpg',
    title: 'Scholarship Assistance Program',
    shortDescription:
      'Connecting deserving students with scholarship opportunities to remove financial barriers to education.',
    longDescription:
      'Financial constraints should never be the reason a brilliant and determined student is denied an education. Our Scholarship Assistance Program identifies vulnerable, focused, and committed students who have academic potential but lack resources. We help them find and apply for scholarships and guide them through the application process.',
    objectives: [
      'To identify high-potential students from low-income backgrounds.',
      'To connect students with available scholarship opportunities.',
      'To guide students through the scholarship application process.',
      'To remove financial barriers to higher education for deserving students.',
    ],
  },
];

export const GALLERY_IMAGES = [
  // Keep original flat images
  {
    id: 1,
    src: '/assets/kyeni5.jpg',
    alt: 'Students attentively listening during a mentorship and career guidance session at Kyeni Secondary School.',
  },
  {
    id: 2,
    src: '/assets/kyeni4.jpg',
    alt: 'Top-performing students receiving awards and recognition for their hard work and academic achievements.',
  },
  {
    id: 3,
    src: '/assets/kyeni2.jpg',
    alt: 'Smart Education team distributing sanitary pads under the Girls’ Dignity Project to empower schoolgirls.',
  },
  {
    id: 4,
    src: '/assets/kyeni3.jpg',
    alt: 'A student receiving personalized scholarship assistance from Smart Education volunteers.',
  },
  {
    id: 5,
    src: '/assets/kyeni2.jpg',
    alt: 'Community members and students gathered during a Smart Education awareness event promoting learning and empowerment.',
  },
  {
    id: 6,
    src: '/assets/kyeni6.jpg',
    alt: 'Dedicated Smart Education volunteers engaging directly with students during an outreach program.',
  },
  {
    id: 7,
    src: '/assets/kyeni6.jpg',
    alt: 'Motivational speaker Lucky Kitonyi addressing a group of attentive students during a mentorship talk.',
  },
  {
    id: 8,
    src: '/assets/kyeni6.jpg',
    alt: 'A cheerful group of students posing with new learning materials provided by Smart Education.',
  },

  // New structured gallery grouped by school
  {
    schoolGroups: [
      {
        school: "Ikalaasa juniour secondary",
        photos: [
          { src: '/assets/c1 (1).jpg', alt: 'Students in classroom' },
          { src: '/assets/c1 (4).jpg', alt: 'School playground' },
          { src: '/assets/c1 (12).jpg', alt: 'School playground' },
          { src: '/assets/c1 (19).jpg', alt: 'School playground' },
          
        ],
      },
      {
        school: "Kyeni primary school",
        photos: [
          { src: '/assets/c1 (14).jpg', alt: 'Science lab session' },
          { src: '/assets/c1 (22).jpg', alt: 'Library' },
          { src: '/assets/c1 (16).jpg', alt: 'Library' },
        ],
      },
       {
        school: "Mwangoni primary school",
        photos: [
          { src: '/assets/c1 (17).jpg', alt: 'Science lab session' },
          { src: '/assets/c1 (18).jpg', alt: 'Library' },
          { src: '/assets/c1 (19).jpg', alt: 'Library' },
        ],
      },
    ],
  },
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Ripple Effect: How Mentorship Transforms a Community',
    image: '/assets/kyeni5.jpg',
    date: 'October 26, 2024',
    excerpt:
      "Mentorship is more than just guidance; it's a transformative force that creates a ripple effect of positive change. This post explores how empowering one student can uplift an entire community.",
  },
  {
    id: 2,
    title: 'Education as the Great Equalizer in Rural Kenya',
    image: '/assets/kyeni4.jpg',
    date: 'October 15, 2024',
    excerpt:
      'In many parts of Kenya, the gap between potential and opportunity is vast. Education remains the most powerful tool to bridge this divide and foster equality.',
  },
  {
    id: 3,
    title: 'Why Keeping Girls in School is a National Priority',
    image: '/assets/kyeni6.jpg',
    date: 'September 30, 2024',
    excerpt:
      "When a girl is educated, she transforms her life, her family, and her community. Learn why the Girls’ Dignity Project is vital in breaking educational barriers for girls.",
  },
];
