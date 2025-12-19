import type { ProgramDetail } from "$lib/types/program"

export const programDetails: ProgramDetail[] = [
  {
    id: 1,
    slug: "empowerment",
    title: "Empowerment",
    category: "education",
    categoryColor: "blue",
    icon: "menu_book",
    description:
      "Memberdayakan anak melalui akses pendidikan berkualitas, bimbingan belajar, dan advokasi hak anak untuk masa depan yang lebih cerah.",
    image:
      "https://i.pinimg.com/1200x/86/8b/f0/868bf00eda80bedf766a5c898bee72ec.jpg",
    alt: "A young girl raising her hand confidently in a classroom setting",
    heroImage:
      "https://i.pinimg.com/1200x/86/8b/f0/868bf00eda80bedf766a5c898bee72ec.jpg",
    fullDescription:
      "Program Empowerment dirancang untuk memberikan akses pendidikan berkualitas kepada anak-anak dari keluarga prasejahtera. Melalui bimbingan belajar intensif, pendampingan akademik, dan advokasi hak anak, kami membantu mereka meraih masa depan yang lebih cerah. Program ini mencakup berbagai kegiatan edukatif yang disesuaikan dengan kebutuhan setiap anak.",
    objectives: [
      "Meningkatkan prestasi akademik anak-anak prasejahtera",
      "Memberikan akses pendidikan berkualitas tanpa biaya",
      "Mengadvokasi hak-hak anak untuk mendapatkan pendidikan layak",
      "Membangun kepercayaan diri dan motivasi belajar anak",
      "Menyediakan mentor dan pendamping belajar yang kompeten",
    ],
    targetAudience: "Anak usia 7-15 tahun dari keluarga prasejahtera di wilayah Jakarta dan sekitarnya",
    schedule: {
      frequency: "3x seminggu (Selasa, Kamis, Sabtu)",
      duration: "2 jam per sesi (15.00 - 17.00 WIB)",
    },
    locations: [
      "Jakarta Utara - Kelurahan Penjaringan",
      "Jakarta Timur - Kelurahan Cipinang",
      "Jakarta Selatan - Kelurahan Tebet",
      "Tangerang - Kelurahan Karawaci",
    ],
    impact: [
      { label: "Anak Terdampak", value: "500+", icon: "school" },
      { label: "Relawan Pengajar", value: "80+", icon: "person" },
      { label: "Lokasi Aktif", value: "4", icon: "location_on" },
      { label: "Tingkat Kelulusan", value: "95%", icon: "verified" },
    ],
    activities: [
      {
        title: "Bimbingan Belajar",
        description: "Bantuan akademik untuk mata pelajaran Matematika, IPA, Bahasa Indonesia, dan Bahasa Inggris",
        icon: "book",
      },
      {
        title: "Pendampingan PR",
        description: "Membantu anak menyelesaikan pekerjaan rumah dan memahami materi pelajaran",
        icon: "assignment",
      },
      {
        title: "Literasi & Numerasi",
        description: "Meningkatkan kemampuan membaca, menulis, dan berhitung dasar",
        icon: "calculate",
      },
      {
        title: "Konseling Pendidikan",
        description: "Bimbingan motivasi dan perencanaan pendidikan ke jenjang lebih tinggi",
        icon: "psychology",
      },
    ],
    testimonials: [
      {
        name: "Siti Nurhaliza",
        role: "Orang Tua Anak Didik",
        quote:
          "Alhamdulillah, sejak ikut program ini nilai anak saya meningkat drastis. Dari yang tadinya hampir tidak naik kelas, sekarang masuk 5 besar di kelasnya. Terima kasih Sahabat Anak!",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      {
        name: "Ahmad Fauzi",
        role: "Anak Didik Kelas 6 SD",
        quote:
          "Kakak-kakak di sini baik banget! Mereka ngajarin dengan sabar dan bikin belajar jadi menyenangkan. Aku sekarang jadi lebih percaya diri di sekolah.",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
    ],
  },
  {
    id: 2,
    slug: "character-building",
    title: "Character Building",
    category: "character",
    categoryColor: "orange",
    icon: "favorite",
    description:
      "Membangun fondasi moral, etika, dan nilai-nilai kebaikan yang kuat melalui pendampingan intensif dan kegiatan rohani.",
    image:
      "https://i.pinimg.com/1200x/55/20/f5/5520f504ec65d8a469217aa98834ae86.jpg",
    alt: "Children sitting in a circle listening to a mentor outdoors",
    heroImage:
      "https://i.pinimg.com/1200x/55/20/f5/5520f504ec65d8a469217aa98834ae86.jpg",
    fullDescription:
      "Program Character Building fokus pada pembentukan karakter anak melalui nilai-nilai moral, etika, dan kebaikan. Kami percaya bahwa karakter yang kuat adalah fondasi untuk kesuksesan jangka panjang. Program ini menggabungkan pendampingan spiritual, kegiatan rohani, dan penanaman nilai-nilai luhur dalam kehidupan sehari-hari.",
    objectives: [
      "Menanamkan nilai-nilai moral dan etika sejak dini",
      "Membangun karakter jujur, disiplin, dan bertanggung jawab",
      "Mengembangkan empati dan kepedulian sosial",
      "Memperkuat fondasi spiritual anak",
      "Membentuk pribadi yang berakhlak mulia",
    ],
    targetAudience: "Anak dan remaja usia 8-17 tahun dari berbagai latar belakang",
    schedule: {
      frequency: "2x seminggu (Rabu & Minggu)",
      duration: "1.5 jam per sesi (09.00 - 10.30 WIB)",
    },
    locations: [
      "Jakarta Pusat - Masjid Al-Ikhlas",
      "Jakarta Barat - Gereja Katedral",
      "Bekasi - Vihara Dharma Bhakti",
      "Tangerang - Musholla An-Nur",
    ],
    impact: [
      { label: "Peserta Aktif", value: "350+", icon: "groups" },
      { label: "Mentor Karakter", value: "25+", icon: "person_celebrate" },
      { label: "Kegiatan per Bulan", value: "8", icon: "event" },
      { label: "Tingkat Kepuasan", value: "98%", icon: "sentiment_satisfied" },
    ],
    activities: [
      {
        title: "Mentoring Karakter",
        description: "Sesi one-on-one dengan mentor untuk membahas pengembangan karakter personal",
        icon: "groups",
      },
      {
        title: "Kegiatan Rohani",
        description: "Kajian, ibadah bersama, dan pembahasan nilai-nilai spiritual",
        icon: "auto_awesome",
      },
      {
        title: "Diskusi Nilai Moral",
        description: "Forum sharing tentang etika, kejujuran, dan tanggung jawab",
        icon: "chat",
      },
      {
        title: "Role Playing",
        description: "Simulasi situasi kehidupan nyata untuk melatih pengambilan keputusan moral",
        icon: "theater_comedy",
      },
    ],
    testimonials: [
      {
        name: "Ratna Sari",
        role: "Wali Murid",
        quote:
          "Program ini mengubah anak saya jadi lebih sopan dan bertanggung jawab. Dia sekarang selalu jujur dan peduli dengan orang lain. Saya sangat bersyukur menemukan program ini.",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      {
        name: "Budi Santoso",
        role: "Peserta Program (15 tahun)",
        quote:
          "Awalnya saya ikut karena disuruh orang tua. Tapi sekarang saya sadar betapa pentingnya punya karakter yang baik. Saya jadi lebih percaya diri dan punya prinsip hidup yang jelas.",
        avatar: "https://i.pravatar.cc/150?img=13",
      },
    ],
  },
  {
    id: 3,
    slug: "community-engagement",
    title: "Community Engagement",
    category: "community",
    categoryColor: "green",
    icon: "handshake",
    description:
      "Membangun jembatan antara masyarakat luas dan anak-anak marjinal melalui piknik edukatif dan bakti sosial.",
    image:
      "https://i.pinimg.com/1200x/55/b8/bb/55b8bbab36185773e32db0c05362cdff.jpg",
    alt: "Volunteers painting a wall with children in a village community",
    heroImage:
      "https://i.pinimg.com/1200x/55/b8/bb/55b8bbab36185773e32db0c05362cdff.jpg",
    fullDescription:
      "Program Community Engagement bertujuan membangun jembatan antara masyarakat luas dengan anak-anak marjinal. Melalui berbagai kegiatan seperti piknik edukatif, bakti sosial, dan program kerja sama komunitas, kami menciptakan lingkungan yang inklusif dan suportif bagi setiap anak.",
    objectives: [
      "Menghubungkan masyarakat dengan anak-anak yang membutuhkan",
      "Meningkatkan kesadaran sosial tentang isu anak marjinal",
      "Menciptakan lingkungan yang inklusif untuk semua anak",
      "Membangun jejaring dukungan komunitas yang kuat",
      "Menggelar kegiatan sosial yang berdampak positif",
    ],
    targetAudience: "Seluruh lapisan masyarakat yang ingin berkontribusi untuk anak Indonesia",
    schedule: {
      frequency: "1x per bulan (Minggu minggu ke-3)",
      duration: "Full day activity (08.00 - 16.00 WIB)",
    },
    locations: [
      "Jakarta - Taman Menteng",
      "Bogor - Kebun Raya Bogor",
      "Bandung - Taman Lalu Lintas",
      "Yogyakarta - Taman Pintar",
    ],
    impact: [
      { label: "Relawan Komunitas", value: "200+", icon: "volunteer_activism" },
      { label: "Kegiatan per Tahun", value: "12+", icon: "event_available" },
      { label: "Anak Terbantu", value: "1000+", icon: "diversity_3" },
      { label: "Mitra Komunitas", value: "15", icon: "apartment" },
    ],
    activities: [
      {
        title: "Piknik Edukatif",
        description: "Kegiatan rekreasi sambil belajar di tempat-tempat bersejarah dan edukatif",
        icon: "park",
      },
      {
        title: "Bakti Sosial",
        description: "Membersihkan lingkungan, menanam pohon, dan aktivitas sosial lainnya",
        icon: "cleaning_services",
      },
      {
        title: "Festival Komunitas",
        description: "Perayaan bersama dengan permainan, lomba, dan pertunjukan seni",
        icon: "celebration",
      },
      {
        title: "Workshop Keluarga",
        description: "Sesi pelatihan untuk orang tua tentang pengasuhan dan pendidikan anak",
        icon: "family_restroom",
      },
    ],
    testimonials: [
      {
        name: "Dewi Kusuma",
        role: "Relawan Komunitas",
        quote:
          "Menjadi bagian dari Community Engagement membuka mata saya tentang realita kehidupan. Setiap kegiatan penuh makna dan memberikan dampak nyata bagi anak-anak.",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        name: "Agus Setiawan",
        role: "Kepala Desa Cipayung",
        quote:
          "Kolaborasi dengan Sahabat Anak membawa perubahan positif di desa kami. Anak-anak jadi lebih semangat belajar dan masyarakat lebih peduli dengan pendidikan.",
        avatar: "https://i.pravatar.cc/150?img=14",
      },
    ],
  },
  {
    id: 4,
    slug: "future-leadership",
    title: "Future Leadership",
    category: "leadership",
    categoryColor: "purple",
    icon: "rocket_launch",
    description:
      "Mempersiapkan remaja dengan keterampilan kepemimpinan, soft skills, dan kewirausahaan untuk masa depan yang mandiri.",
    image:
      "https://i.pinimg.com/1200x/af/3e/96/af3e96fc3fa6a87ea058d773ac2aa23c.jpg",
    alt: "Teenagers discussing a project with papers on a table",
    heroImage:
      "https://i.pinimg.com/1200x/af/3e/96/af3e96fc3fa6a87ea058d773ac2aa23c.jpg",
    fullDescription:
      "Program Future Leadership dirancang khusus untuk remaja yang ingin mengembangkan potensi kepemimpinan mereka. Melalui pelatihan intensif, mentoring, dan praktik langsung, kami mempersiapkan generasi muda yang siap memimpin perubahan dan menciptakan masa depan yang lebih baik.",
    objectives: [
      "Mengembangkan keterampilan kepemimpinan pada remaja",
      "Melatih public speaking dan komunikasi efektif",
      "Membekali soft skills untuk dunia kerja",
      "Menumbuhkan jiwa entrepreneurship dan inovasi",
      "Membangun networking dan kolaborasi antar pemuda",
    ],
    targetAudience: "Remaja usia 15-21 tahun yang memiliki motivasi tinggi untuk berkembang",
    schedule: {
      frequency: "2x seminggu (Sabtu & Minggu)",
      duration: "3 jam per sesi (13.00 - 16.00 WIB)",
    },
    locations: [
      "Jakarta - Co-working Space Gandaria",
      "Bandung - Hub Innovation Center",
      "Surabaya - Youth Center Tunjungan",
      "Yogyakarta - Impact Hub Jogja",
    ],
    impact: [
      { label: "Peserta Program", value: "250+", icon: "group" },
      { label: "Mentor Profesional", value: "30+", icon: "badge" },
      { label: "Proyek Sosial", value: "45", icon: "rocket_launch" },
      { label: "Alumni Berwirausaha", value: "60%", icon: "storefront" },
    ],
    activities: [
      {
        title: "Leadership Training",
        description: "Pelatihan kepemimpinan, team building, dan decision making",
        icon: "military_tech",
      },
      {
        title: "Public Speaking Workshop",
        description: "Melatih kemampuan berbicara di depan umum dan presentasi",
        icon: "campaign",
      },
      {
        title: "Entrepreneurship Bootcamp",
        description: "Belajar membangun bisnis dari ide hingga eksekusi",
        icon: "business_center",
      },
      {
        title: "Social Project",
        description: "Mengerjakan proyek nyata yang memberikan dampak sosial",
        icon: "handshake",
      },
    ],
    testimonials: [
      {
        name: "Rina Marlina",
        role: "Alumni Future Leadership 2023",
        quote:
          "Program ini mengubah hidup saya! Dari yang tadinya pemalu, sekarang saya berani public speaking dan sudah memulai bisnis online sendiri. Thank you Sahabat Anak!",
        avatar: "https://i.pravatar.cc/150?img=10",
      },
      {
        name: "Fajar Pratama",
        role: "Peserta Aktif",
        quote:
          "Ilmu yang didapat di sini sangat applicable. Mentornya juga profesional dan supportive. Saya jadi punya visi jelas untuk masa depan saya.",
        avatar: "https://i.pravatar.cc/150?img=15",
      },
    ],
  },
]

export function getProgramBySlug(slug: string): ProgramDetail | undefined {
  return programDetails.find((program) => program.slug === slug)
}
