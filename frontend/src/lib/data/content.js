import belajar from '$lib/assets/belajar.jpg';
import kegiatan2 from '$lib/assets/kegiatan2.jpg';

export const programs = [
    {
        id: 1,
        title: 'Bimbingan Belajar',
        category: 'Pendidikan',
        categoryColor: 'text-primary',
        description: 'Menyediakan akses pendidikan tambahan gratis bagi anak-anak prasejahtera untuk meningkatkan prestasi akademik.',
        image: belajar,
        imageAlt: 'Children learning in a classroom setting'
    },
    {
        id: 2,
        title: 'Posyandu Keliling',
        category: 'Kesehatan',
        categoryColor: 'text-green-500',
        description: 'Layanan kesehatan dasar dan pemberian gizi tambahan untuk memastikan tumbuh kembang fisik yang optimal.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD361rBgAAqmXPeTrm8-xvo4-0ebgGM2Q3cwbr5MCuESE8BkywhOi4-EM30VHpx0ugIs_jm4xNjudRvd9PewvFMsryVC6hkPAM49nZeMmkEJWZxdvuOzeA73HYP8Mwk-UrXP-GAN9bNhLMPBiJaLh77U9w6EYYYog63G-UWBvr4AKUeZNJ8bqqH6Gg9mAYNEAw9OEw7z3-qiTIrmuw2ZWhCLSwCXp4qpvS0dWP9QN2ePJLhCpmIf1CPLtXYgStIUisCGIbl7TlcsMr',
        imageAlt: 'Doctor checking up a child'
    },
    {
        id: 3,
        title: 'Kelas Kreativitas',
        category: 'Seni & Budaya',
        categoryColor: 'text-orange-500',
        description: 'Ruang ekspresi seni, musik, dan kerajinan tangan untuk mengasah bakat dan kepercayaan diri anak.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdODtxPxd9p34L3fWdQmuDvRZ4SXzkavYIL1GaPMmgNrjvaNpYjQ7T4zGZI9L9jkBA6h8uOqQOGB9yTCvvjv-S89CApwEbzMFTQzgaa6cegkPuCog7TFDGKchO4YG5VhHa_jtBiYBGNhf2oEHI6vwQVpF8MZ93EPzgAVGciH7JK00QfRSqWbPa9fbe5jvSC1NGvqb-0Ly1r6AGyKicBjrw98KvBqBK8u8zOfBfn7leGwQs59U56G_mdyHcYJP77nxvlRJoU4KvRxvE',
        imageAlt: 'Children playing outdoors creatively'
    }
];

export const testimonials = [
    {
        id: 1,
        quote: 'Bergabung sebagai relawan di Sahabat Anak membuka mata saya bahwa kebahagiaan itu sederhana. Melihat senyum mereka saat bisa membaca adalah bayaran termahal.',
        name: 'Sarah Anindya',
        role: 'Relawan Pengajar',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU-2zh_dHh40E0R-lITkGCLV3UF0vYu9BCKnMLrIlYHJLgGh55VYx396p2j25ay7rCbIe1mIYy9cmJ-NaTwq1Tds9d_wccFNlGe7NZYWSK9Tn42iCHrM4hLscsmP3SeWlSzpanQDRAITVtyUlzvdLaQjXDvQJMhoye5JiuvtUwI6rHxYW3sNZlCeHMXr9D2b3J_S43mmUHpox0hFW52EUw9GRAva9gx8kOI2UrYVnUm-_8JKOKwAsG-xs3roEP1keXHUF8ywAmr71S'
    },
    {
        id: 2,
        quote: 'Terima kasih Sahabat Anak, berkat bimbingan kakak-kakak, aku jadi lebih semangat belajar matematika dan berani bermimpi jadi insinyur.',
        name: 'Budi Santoso',
        role: 'Anak Asuh (Kelas 5 SD)',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVbhoVAvg-mYPZH7RY0DSTw5HGqEVUEByzV2eKwzKzfo1T8gBics9inei-7kIZBShemRFtccFgoxIE6bxkmm-unYg_ENNg1PNHV_ikjWTE9GfbQBpnVbGB2T-OnJqpcNjAE_zygsvH4_lY8N6QniPIC0r_FB4ZiUh8l5jkWP_HfhtF8LhqxAuFApdcNdIXqyYE16N1EdXpRVVejvnEUw8ps6Nuh-z_68c81I-MIdfW41mqdNSIrbTaShOwLtkcztzFmbOIvH6uKJaS'
    }
];

export const events = [
    {
        id: 1,
        title: 'Lari Amal Untuk Pendidikan',
        date: { month: 'Okt', day: '15' },
        time: '07:00 WIB',
        location: 'Jakarta',
        locationType: 'location_on',
        description: 'Mengumpulkan donasi sambil berolahraga bersama komunitas pelari Jakarta.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYFEP0-WVJMpSh2OHDkJwwLxcQGPwuwnf18cOnUESVIcPEduUHjXJKLI86euHBxdlSY51VPHDK4mZfAiD7KyrQFsfiWHPu4jyOdh1dJsLScveNhosxbd-LByjd9a_Fg_lSD87ZoWMvCTlGE54bn9YDYeq3tWoo_N6CxAe5EKpFHLskNDinLm6To3RVy02lLro38eL1X41RUhsavpsdAckrlxfdnV3cGwnQSojvZEHq7tUBZmBvp7cIxt5ozvWiM4vGWe1Sma3JPLz1'
    },
    {
        id: 2,
        title: 'Webinar: Menjadi Kakak Asuh',
        date: { month: 'Nov', day: '02' },
        time: '09:00 WIB',
        location: 'Online',
        locationType: 'videocam',
        description: 'Pembekalan bagi calon relawan baru mengenai psikologi anak dan metode pengajaran.',
        image: kegiatan2
    },
    {
        id: 3,
        title: 'Pesta Sahabat Anak',
        date: { month: 'Des', day: '20' },
        time: '08:00 WIB',
        location: 'Monas',
        locationType: 'location_on',
        description: 'Perayaan akhir tahun bersama 1000 anak asuh dengan berbagai wahana permainan.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSimeS-x7XSnKXILvJ2Qio3cSF4wzlxaQiMYBXvJgd1SaqIkXmiZ9-bBu-CItgYoApKGBuXm69LDpyMvuYS9gyXKol43WDdy1QL2jlG4wBAu-vMhM6WQ7_hFtpcKqEe4Sgju4XNAln-YpigeZ2FVZZFWOBcHmWy_R4omHvZccO2TCd3OO5orSQZdgjiIq-O9t0Q_DBQi46znaNLOVlGBuxvvxAvTudVnwtqRMT6zFtTnGLqACgvS4YCX3-Ooqqlj5KpEUugfShb6VK'
    }
];

export const stats = [
    { icon: 'child_care', value: '1500+', label: 'Anak Terbantu', color: 'primary' },
    { icon: 'diversity_3', value: '500+', label: 'Relawan Aktif', color: 'secondary' },
    { icon: 'history_edu', value: '25', label: 'Tahun Mengabdi', color: 'purple' }
];
