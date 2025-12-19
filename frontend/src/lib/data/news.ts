import type { NewsArticle, HighlightNews } from '$lib/types/news';

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'PjBL: Belajar Seru Sambil Berkreasi di Kelas Minggu',
    category: 'Program',
    categoryColor: 'primary',
    icon: 'school',
    date: '20 Okt 2023',
    author: 'Admin',
    excerpt: 'Metode Project Based Learning membawa semangat baru bagi adik-adik binaan dalam memahami pelajaran sekolah dengan cara yang menyenangkan.',
    image: 'https://miro.medium.com/v2/resize:fit:720/format:webp/1*2TnNWmvRzHExewgrSk0pdg.jpeg',
    alt: 'Children learning in a classroom with colorful drawings'
  },
  {
    id: 2,
    title: 'Open Recruitment Volunteer Jambore 2024',
    category: 'Event',
    categoryColor: 'accent-orange',
    icon: 'calendar_month',
    date: '18 Okt 2023',
    author: 'Event Team',
    excerpt: 'Panggilan untuk kakak-kakak yang berjiwa sosial! Mari bergabung menjadi bagian dari keseruan Jambore Sahabat Anak tahun ini.',
    image: 'https://i.pinimg.com/1200x/5a/d9/fc/5ad9fc132fccd7160cff106405f9edde.jpg',
    alt: 'Group of volunteers organizing supplies outdoors'
  },
  {
    id: 3,
    title: 'Terima Kasih Kakak Asuh: Cerita dari Bintang',
    category: 'Cerita Anak',
    categoryColor: 'pink-500',
    icon: 'sentiment_satisfied',
    date: '15 Okt 2023',
    author: 'Bintang',
    excerpt: '"Dulu aku takut bermimpi, tapi sekarang aku ingin jadi dokter." Sebuah surat kecil yang menyentuh hati dari salah satu adik binaan.',
    image: 'https://i.pinimg.com/1200x/c7/fc/46/c7fc465d4b041fc9c02169d52e0a2cd9.jpg',
    alt: 'Close up of a child smiling brightly holding a book'
  },
  {
    id: 4,
    title: 'Donasi Buku untuk Perpustakaan Keliling',
    category: 'Relawan',
    categoryColor: 'green-600',
    icon: 'volunteer_activism',
    date: '10 Okt 2023',
    author: 'Admin',
    excerpt: 'Bantu kami memenuhi rak buku perpustakaan keliling yang akan menjangkau area pinggiran Jakarta. Setiap buku sangat berarti.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGH3iJb_oTtGcTlmnsjP7-uBocXcVqdaJL06WCoVfSaStyopRMsFLQHCALGlPNMpQfDRYBOXp3n1TVlzcEpiyuth6E1bXGA_OmLTkysYcTsy_WKxCpbr6mnDG0vV26rGNolmULdq3IDWiHL2jMfICXS1AHyH-abAa4Yz7_HrQ3sOf1iXlmz18yU6hZQ0ByV-f3dMUWY1cr0cxn3ukhFptkZJz8eqGnQjTXhOupqSz-hY-glAP_UQYNprM5mKNEd3aJ6OEHEG_dhJfl',
    alt: 'Stack of colorful children\'s books on a wooden table'
  },
  {
    id: 5,
    title: 'Serunya Kegiatan Outbound di Ragunan',
    category: 'Program',
    categoryColor: 'purple-600',
    icon: 'hiking',
    date: '05 Okt 2023',
    author: 'Ragunan Team',
    excerpt: 'Melihat tawa lepas anak-anak saat berinteraksi dengan alam dan satwa di Kebun Binatang Ragunan akhir pekan lalu.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtnL0u6tvJRZZl5V8lWaySYPjkULXTU3WkV8oHYu_V3MBqRyOzDWCaUGLkCSgeE88is8Ig48E-cacYxvJ3iZFts2BVEthHh6YgVuPiqlyLeNzkKhNb7Dx7TRvFkWPLfcNyFBXR3lfhqgQMIf0OKbAeY-I-ZgJZ18dug52CSOcMZK0yoPHu_muncV16GB8DJOzccuv2ejSxHmc5BD36zJljJsloItSoEf60fnfOZgrJv-V28wghdu2yZ9tuQPfVuixijWjKWdZgWmiv',
    alt: 'Children playing games in a grassy park under the sun'
  },
  {
    id: 6,
    title: 'Workshop Kreativitas Daur Ulang',
    category: 'Program',
    categoryColor: 'teal-600',
    icon: 'brush',
    date: '01 Okt 2023',
    author: 'Kreatif',
    excerpt: 'Mengubah sampah menjadi karya seni! Anak-anak belajar pentingnya menjaga lingkungan sambil mengasah kreativitas mereka.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuwWRDyhrlVSeQt-fmeGAZxzIGW_37-MoOcQnULtaFruQjDBITADRp4xPDUu049725P7iEkCSRYuPS4C6ZGKUaH5SufWCj-YJBpdrPNqWXUn0cqgFmFj0bi6cg90j0lHIMC0lqk-7XoP7nDOz-7GzOTh94gmVeTxNY0sdzU0lFEwKKykvscGX5qld01YYVzPvaQVH6zrIb8QO9gN5EZFX4l7L4n5ylSncdUKNOEg7pUMdjV3ZqHXyfWMpmssaY4pGDxAgr4A91ZseH',
    alt: 'Hands of children painting on recycled paper'
  }
];

export const categories = [
  { name: 'Semua Berita', icon: 'grid_view', value: 'all' },
  { name: 'Program', icon: 'school', value: 'Program' },
  { name: 'Event', icon: 'calendar_month', value: 'Event' },
  { name: 'Cerita Anak', icon: 'sentiment_satisfied', value: 'Cerita Anak' },
  { name: 'Relawan', icon: 'volunteer_activism', value: 'Relawan' }
];

export const highlightNews: HighlightNews = {
  title: 'Membangun Mimpi Bersama: Recap Kegiatan Jambore Nasional 2023',
  category: 'Highlight',
  image: 'https://i.pinimg.com/736x/e2/1e/f8/e21ef83da6a67566141cd7f404aba0e2.jpg',
  alt: 'Group of happy children volunteering outdoors with bright smiles'
};
