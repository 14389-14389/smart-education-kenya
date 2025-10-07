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
      imageSrc: '/assets/program-mentorship.jpg', // User needs to add this image
      title: 'Mentorship & Career Guidance',
      shortDescription: 'Connecting students with role models and equipping them with knowledge about future career paths.',
      longDescription: 'Our Mentorship & Career Guidance program is the cornerstone of our mission. We connect students in underserved areas with successful professionals, university students, and community leaders who serve as role models and mentors. Through one-on-one sessions, group workshops, and inspiring talks, we aim to build confidence, broaden horizons, and instill a sense of ambition. The program also equips students with practical knowledge about various career paths, effective study skills, and the tools needed to set and achieve their long-term goals. We believe that guidance from someone who has walked the path before can be a powerful catalyst for a young person\'s journey to success.',
      objectives: [
        "To provide students with positive role models.",
        "To expose students to a wide range of career opportunities.",
        "To develop essential life skills like communication and goal-setting.",
        "To build self-esteem and motivation to pursue higher education."
      ]
    },
    {
      id: 'student-awards-recognition',
      imageSrc: '/assets/program-awards.jpg', // User needs to add this image
      title: 'Student Awards & Recognition',
      shortDescription: 'Awarding top-performing and committed students to foster a spirit of excellence and keep them motivated.',
      longDescription: 'To foster a spirit of healthy competition, dedication, and academic excellence, we have established the Student Awards & Recognition program. In partnership with local schools, we identify and award the most committed, improved, and top-performing students at the end of each term. This recognition, which often includes certificates, school supplies, and trophies, serves as a powerful motivator. It not only celebrates individual achievement but also inspires the entire student body to strive for greatness. By acknowledging their hard work, we reinforce the value of education and encourage students to remain zealous and focused on their studies.',
       objectives: [
        "To motivate students to achieve academic excellence.",
        "To recognize and reward hard work and commitment.",
        "To foster a positive and competitive learning environment.",
        "To reduce dropout rates by keeping students engaged."
      ]
    },
    {
      id: 'girls-dignity-project',
      imageSrc: '/assets/program-dignity.jpg', // User needs to add this image
      title: 'Girls’ Dignity Project',
      shortDescription: 'Providing sanitary pads to ensure girls can attend school with dignity and without interruption.',
      longDescription: 'We are fiercely committed to keeping girls in school by tackling the widespread issue of period poverty. The Girls\' Dignity Project is our direct response to this challenge. Through this initiative, we distribute sanitary pads to school-going girls, ensuring that menstruation never becomes a barrier to their education. Beyond distribution, the program includes sessions on menstrual health and hygiene, empowering girls with knowledge and breaking down stigmas. By providing these essential resources, we help ensure that girls can attend school with confidence and dignity, allowing them to participate fully and not miss out on crucial learning opportunities.',
       objectives: [
        "To reduce absenteeism among schoolgirls due to menstruation.",
        "To provide essential sanitary products to girls in need.",
        "To educate girls on menstrual health and hygiene.",
        "To boost the confidence and self-esteem of female students."
      ]
    },
    {
      id: 'scholarship-assistance-program',
      imageSrc: '/assets/program-scholarship.jpg', // User needs to add this image
      title: 'Scholarship Assistance Program',
      shortDescription: 'Connecting deserving students with scholarship opportunities to remove financial barriers to education.',
      longDescription: 'Financial constraints should never be the reason a brilliant and determined student is denied an education. Our Scholarship Assistance Program is designed to bridge this gap. We work to identify vulnerable, focused, and committed students who have the academic potential but lack the financial resources to continue their education, particularly into secondary school and beyond. Our team helps these students find and apply for relevant scholarships from government bodies, corporations, and other foundations. We provide guidance on the application process, help them prepare for interviews, and act as advocates to ensure they have the best possible chance of securing the funding they need to pursue their dreams.',
       objectives: [
        "To identify high-potential students from low-income backgrounds.",
        "To connect students with available scholarship opportunities.",
        "To guide students through the scholarship application process.",
        "To remove financial barriers to higher education for deserving students."
      ]
    }
];

export const GALLERY_IMAGES = [
    { id: 1, src: '/assets/gallery-1.jpg', alt: 'Students in a mentorship session' },
    { id: 2, src: '/assets/gallery-2.jpg', alt: 'Award ceremony for top-performing students' },
    { id: 3, src: '/assets/gallery-3.jpg', alt: 'Distribution of sanitary pads for the Girls\' Dignity Project' },
    { id: 4, src: '/assets/gallery-4.jpg', alt: 'A student receiving scholarship assistance guidance' },
    { id: 5, src: '/assets/gallery-5.jpg', alt: 'Community members at a Smart Education event' },
    { id: 6, src: '/assets/gallery-6.jpg', alt: 'Volunteers engaging with students' },
    { id: 7, src: '/assets/gallery-7.jpg', alt: 'Lucky Kitonyi speaking to students' },
    { id: 8, src: '/assets/gallery-8.jpg', alt: 'A group of smiling students with new school supplies' },
];

export const BLOG_POSTS = [
    {
        id: 1,
        title: 'The Ripple Effect: How Mentorship Transforms a Community',
        image: '/assets/blog-1.jpg',
        date: 'October 26, 2024',
        excerpt: 'Mentorship is more than just guidance; it\'s a transformative force that creates a ripple effect of positive change. When one student is empowered, they inspire their peers, uplift their families, and eventually, contribute to a stronger, more resilient community. This post explores the profound, long-term impact of our mentorship programs.'
    },
    {
        id: 2,
        title: 'Education as the Great Equalizer in Rural Kenya',
        image: '/assets/blog-2.jpg',
        date: 'October 15, 2024',
        excerpt: 'In many parts of Kenya, the gap between potential and opportunity is vast. Education stands as the single most powerful tool to bridge this divide. We delve into why investing in the education of rural youth is not just a local issue, but a critical step towards building a more equitable and prosperous nation for all.'
    },
    {
        id: 3,
        title: 'Why Keeping Girls in School is a National Priority',
        image: '/assets/blog-3.jpg',
        date: 'September 30, 2024',
        excerpt: 'When a girl is educated, she is more likely to earn a higher income, have a healthier family, and invest back into her community. Our Girls\' Dignity Project tackles one of the biggest barriers to female education. Learn why this simple intervention is a game-changer for girls and for Kenya at large.'
    }
]
