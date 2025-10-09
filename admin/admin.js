// Data management
let students = JSON.parse(localStorage.getItem('students')) || [];
let mading = JSON.parse(localStorage.getItem('mading')) || [];
let gallery = JSON.parse(localStorage.getItem('gallery')) || [];
let settings = JSON.parse(localStorage.getItem('settings')) || {
    siteTitle: "Kelas 10 TKJ & TSM",
    siteDescription: "SMK Negeri 1 Teknologi - Membangun Generasi Teknisi Profesional dan Berkarakter",
    contactEmail: "kelas10tkjtsm@smknegeri1.sch.id",
    contactPhone: "(021) 1234-5678"
};

// Tab functionality
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Student form handling
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentData = {
        id: document.getElementById('studentId').value || Date.now(),
        name: document.getElementById('studentName').value,
        jurusan: document.getElementById('studentJurusan').value,
        bio: document.getElementById('studentBio').value,
        skills: document.getElementById('studentSkills').value.split(',').map(skill => skill.trim())
    };
    
    // Handle photo upload
    const photoInput = document.getElementById('studentPhoto');
    if (photoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            studentData.photo = e.target.result;
            saveStudent(studentData);
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        // If no new photo, keep existing one for edits
        const existingStudent = students.find(s => s.id == studentData.id);
        if (existingStudent) {
            studentData.photo = existingStudent.photo;
        } else {
            studentData.photo = 'assets/images/default-student.jpg';
        }
        saveStudent(studentData);
    }
});

function saveStudent(studentData) {
    const existingIndex = students.findIndex(s => s.id == studentData.id);
    
    if (existingIndex >= 0) {
        students[existingIndex] = studentData;
    } else {
        students.push(studentData);
    }
    
    localStorage.setItem('students', JSON.stringify(students));
    loadStudentsTable();
    resetStudentForm();
    alert('Data siswa berhasil disimpan!');
}

function loadStudentsTable() {
    const tableBody = document.getElementById('studentsTable');
    tableBody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.jurusan.toUpperCase()}</td>
            <td>${student.bio.substring(0, 50)}...</td>
            <td class="action-buttons">
                <button class="action-btn btn-primary" onclick="editStudent(${student.id})">Edit</button>
                <button class="action-btn btn-danger" onclick="deleteStudent(${student.id})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editStudent(id) {
    const student = students.find(s => s.id == id);
    if (student) {
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentJurusan').value = student.jurusan;
        document.getElementById('studentBio').value = student.bio;
        document.getElementById('studentSkills').value = student.skills.join(', ');
    }
}

function deleteStudent(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
        students = students.filter(s => s.id != id);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudentsTable();
        alert('Data siswa berhasil dihapus!');
    }
}

function resetStudentForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}

document.getElementById('resetStudentForm').addEventListener('click', resetStudentForm);

// Mading form handling
document.getElementById('madingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const madingData = {
        id: document.getElementById('madingId').value || Date.now(),
        title: document.getElementById('madingTitle').value,
        content: document.getElementById('madingContent').value,
        date: document.getElementById('madingDate').value
    };
    
    // Handle image upload
    const imageInput = document.getElementById('madingImage');
    if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            madingData.image = e.target.result;
            saveMading(madingData);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // If no new image, keep existing one for edits
        const existingMading = mading.find(m => m.id == madingData.id);
        if (existingMading) {
            madingData.image = existingMading.image;
        } else {
            madingData.image = 'assets/images/default-mading.jpg';
        }
        saveMading(madingData);
    }
});

function saveMading(madingData) {
    const existingIndex = mading.findIndex(m => m.id == madingData.id);
    
    if (existingIndex >= 0) {
        mading[existingIndex] = madingData;
    } else {
        mading.push(madingData);
    }
    
    localStorage.setItem('mading', JSON.stringify(mading));
    loadMadingTable();
    resetMadingForm();
    alert('Data mading berhasil disimpan!');
}

function loadMadingTable() {
    const tableBody = document.getElementById('madingTable');
    tableBody.innerHTML = '';
    
    mading.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${new Date(item.date).toLocaleDateString('id-ID')}</td>
            <td>${item.content.substring(0, 50)}...</td>
            <td class="action-buttons">
                <button class="action-btn btn-primary" onclick="editMading(${item.id})">Edit</button>
                <button class="action-btn btn-danger" onclick="deleteMading(${item.id})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editMading(id) {
    const item = mading.find(m => m.id == id);
    if (item) {
        document.getElementById('madingId').value = item.id;
        document.getElementById('madingTitle').value = item.title;
        document.getElementById('madingContent').value = item.content;
        document.getElementById('madingDate').value = item.date;
    }
}

function deleteMading(id) {
    if (confirm('Apakah Anda yakin ingin menghapus mading ini?')) {
        mading = mading.filter(m => m.id != id);
        localStorage.setItem('mading', JSON.stringify(mading));
        loadMadingTable();
        alert('Mading berhasil dihapus!');
    }
}

function resetMadingForm() {
    document.getElementById('madingForm').reset();
    document.getElementById('madingId').value = '';
}

document.getElementById('resetMadingForm').addEventListener('click', resetMadingForm);

// Gallery handling
document.getElementById('galleryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const imageInput = document.getElementById('galleryImage');
    if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            gallery.push(e.target.result);
            localStorage.setItem('gallery', JSON.stringify(gallery));
            loadGalleryTable();
            document.getElementById('galleryForm').reset();
            alert('Gambar berhasil ditambahkan!');
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
});

function loadGalleryTable() {
    const container = document.getElementById('galleryTable');
    container.innerHTML = '';
    
    gallery.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item-admin';
        item.innerHTML = `
            <img src="${image}" alt="Gallery Image">
            <button class="btn btn-danger" onclick="deleteGalleryImage(${index})">Hapus</button>
        `;
        container.appendChild(item);
    });
}

function deleteGalleryImage(index) {
    if (confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
        gallery.splice(index, 1);
        localStorage.setItem('gallery', JSON.stringify(gallery));
        loadGalleryTable();
        alert('Gambar berhasil dihapus!');
    }
}

// Settings handling
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    settings = {
        siteTitle: document.getElementById('siteTitle').value,
        siteDescription: document.getElementById('siteDescription').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value
    };
    
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Pengaturan berhasil disimpan!');
});

// Load settings
function loadSettings() {
    document.getElementById('siteTitle').value = settings.siteTitle;
    document.getElementById('siteDescription').value = settings.siteDescription;
    document.getElementById('contactEmail').value = settings.contactEmail;
    document.getElementById('contactPhone').value = settings.contactPhone;
}

// Export/Import data
document.getElementById('exportData').addEventListener('click', function() {
    const data = {
        students,
        mading,
        gallery,
        settings,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kelas-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
});

document.getElementById('importData').addEventListener('click', function() {
    document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('Apakah Anda yakin ingin mengimpor data? Data lama akan digantikan.')) {
                    if (data.students) students = data.students;
                    if (data.mading) mading = data.mading;
                    if (data.gallery) gallery = data.gallery;
                    if (data.settings) settings = data.settings;
                    
                    localStorage.setItem('students', JSON.stringify(students));
                    localStorage.setItem('mading', JSON.stringify(mading));
                    localStorage.setItem('gallery', JSON.stringify(gallery));
                    localStorage.setItem('settings', JSON.stringify(settings));
                    
                    loadStudentsTable();
                    loadMadingTable();
                    loadGalleryTable();
                    loadSettings();
                    
                    alert('Data berhasil diimpor!');
                }
            } catch (error) {
                alert('Error membaca file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
});

// Reset all data
document.getElementById('resetAllData').addEventListener('click', function() {
    if (confirm('PERINGATAN: Ini akan menghapus SEMUA data dan tidak dapat dibatalkan. Apakah Anda yakin?')) {
        localStorage.clear();
        students = [];
        mading = [];
        gallery = [];
        settings = {
            siteTitle: "Kelas 10 TKJ & TSM",
            siteDescription: "SMK Negeri 1 Teknologi - Membangun Generasi Teknisi Profesional dan Berkarakter",
            contactEmail: "kelas10tkjtsm@smknegeri1.sch.id",
            contactPhone: "(021) 1234-5678"
        };
        
        loadStudentsTable();
        loadMadingTable();
        loadGalleryTable();
        loadSettings();
        
        alert('Semua data telah direset!');
    }
});

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadStudentsTable();
    loadMadingTable();
    loadGalleryTable();
    loadSettings();
});