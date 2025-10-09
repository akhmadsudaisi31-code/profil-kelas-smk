// Data siswa (akan digantikan dengan data dari JSON)
const studentsData = [
    {
        id: 1,
        name: "Ahmad Rizki",
        jurusan: "tkj",
        photo: "assets/images/student1.jpg",
        bio: "Siswa TKJ yang tertarik dengan jaringan komputer dan cybersecurity.",
        skills: ["Networking", "Linux", "Cybersecurity"]
    },
    {
        id: 2,
        name: "Budi Santoso",
        jurusan: "tsm",
        photo: "assets/images/student2.jpg",
        bio: "Siswa TSM dengan minat pada modifikasi mesin motor sport.",
        skills: ["Engine Tuning", "Electrical System", "Brake System"]
    }
    // Data lainnya akan dimuat dari JSON
];

// Data mading
const madingData = [
    {
        id: 1,
        title: "Workshop Jaringan Komputer",
        content: "Kelas TKJ akan mengadakan workshop jaringan komputer dasar pada tanggal 15 November 2023.",
        image: "assets/images/mading1.jpg",
        date: "2023-11-01"
    },
    {
        id: 2,
        title: "Lomba Tune Up Motor",
        content: "Siswa TSM berhasil meraih juara 2 dalam lomba tune up motor se-kota.",
        image: "assets/images/mading2.jpg",
        date: "2023-10-25"
    }
];

// Data galeri
const galleryData = [
    "assets/images/gallery1.jpg",
    "assets/images/gallery2.jpg",
    "assets/images/gallery3.jpg",
    "assets/images/gallery4.jpg",
    "assets/images/gallery5.jpg",
    "assets/images/gallery6.jpg"
];

// Fungsi untuk memuat data siswa
function loadStudents(filter = 'all') {
    const container = document.getElementById('students-container');
    container.innerHTML = '';
    
    const filteredStudents = filter === 'all' 
        ? studentsData 
        : studentsData.filter(student => student.jurusan === filter);
    
    filteredStudents.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        
        studentCard.innerHTML = `
            <img src="${student.photo}" alt="${student.name}" class="student-img">
            <div class="student-info">
                <h3>${student.name}</h3>
                <span class="student-jurusan jurusan-${student.jurusan}">
                    ${student.jurusan.toUpperCase()}
                </span>
                <p>${student.bio}</p>
                <div class="student-skills">
                    ${student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(studentCard);
    });
}

// Fungsi untuk memuat mading
function loadMading() {
    const container = document.getElementById('mading-container');
    container.innerHTML = '';
    
    madingData.forEach(item => {
        const madingCard = document.createElement('div');
        madingCard.className = 'mading-card';
        
        madingCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="mading-img">
            <div class="mading-content">
                <div class="mading-date">${formatDate(item.date)}</div>
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            </div>
        `;
        
        container.appendChild(madingCard);
    });
}

// Fungsi untuk memuat galeri
function loadGallery() {
    const container = document.getElementById('gallery-container');
    container.innerHTML = '';
    
    galleryData.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        galleryItem.innerHTML = `
            <img src="${image}" alt="Gallery Image">
        `;
        
        container.appendChild(galleryItem);
    });
}

// Format tanggal
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Filter siswa
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        loadStudents(filter);
    });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth scroll untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Tutup mobile menu jika terbuka
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Form kontak
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Pesan telah terkirim! Terima kasih atas pesannya.');
    this.reset();
});

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    loadMading();
    loadGallery();
    
    // Tambahkan class active pada nav link yang sesuai dengan section yang sedang dilihat
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});