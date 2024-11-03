async function loadCourses() {
    try {
        const response = await fetch('models/courses.json');
        const courses = await response.json();

        const container = document.getElementById('course-container');
        container.innerHTML = ''; // Clear existing content

        courses.forEach(course => {
            const courseHTML = `
            <div class="col-md-4 col-sm-6 mb-3">
                <a href="#" class="image-btn" onclick="showCourseModal('${course.subject_id}', '${course.image}')">
                    <img src="${course.image}" alt="${course.name}">
                    <div class="overlay">${course.name}</div>
                </a> 
            </div>
            `;
            container.insertAdjacentHTML('beforeend', courseHTML);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function showCourseModal(subject_id, imageUrl) {
    try {
        const response = await fetch('models/courses.json');
        const courses = await response.json();
        
        const course = courses.find(c => c.subject_id === subject_id);
        if (course) {
            document.getElementById('modalImage').src = imageUrl;
            document.getElementById('modalName').innerText = course.name;
            document.getElementById('modalDescription').innerText = course.description || 'ไม่มีข้อมูล';

            // Clear previous inputs and results in the modal
            document.getElementById('childAge').value = ''; 
            document.getElementById('childCount').value = '';
            document.getElementById('modalPrice').innerText = '';
            document.getElementById('packageResult').innerText = '';

            // Add event listeners for input changes
            document.getElementById('childAge').addEventListener('input', () => calculatePackage(course));
            document.getElementById('childCount').addEventListener('input', () => calculatePackage(course));

            const courseModal = new bootstrap.Modal(document.getElementById('courseModal'));
            courseModal.show();
        }
    } catch (error) {
        console.error('Error loading course details:', error);
    } 
}

function calculatePackage(course) {
    const childAge = parseInt(document.getElementById('childAge').value);
    const childCount = parseInt(document.getElementById('childCount').value);

    let price;
    let packageResult = '';

    // Check if both child age and child count are provided
    if (isNaN(childAge) || isNaN(childCount)) {
        document.getElementById('modalPrice').innerText = ''; // Clear price display
        document.getElementById('packageResult').innerText = 'กรุณากรอกข้อมูลอายุและจำนวนเด็ก'; // Please enter age and number of children
        return; // Exit the function
    }

    // Determine the package based on age and number of children
    if (childAge >= 0 && childAge < 3) {
        // Only Single Package available for ages 0 to 2
        if (childCount === 1) {
            price = course.age_ranges.single['9m_to_2y']; // Adjust according to JSON structure
            packageResult = price ? `แพ็กเกจเดี่ยวสำหรับอายุ ${childAge} ปี` : 'ไม่มีแพ็กเกจสำหรับอายุนี้'; // Package available for age
        } else {
            packageResult = 'ไม่มีแพ็กเกจสำหรับจำนวนเด็กมากกว่าหนึ่งคนในอายุนี้'; // No packages for more than one child in this age
        }
    } else if (childAge >= 3 && childAge <= 12) {
        // Age 3 to 12 handling
        if (childCount === 1) {
            price = course.age_ranges.single['3_to_12']; // Solo package for age 3 to 12
            packageResult = price ? `แพ็กเกจเดี่ยวสำหรับอายุ ${childAge} ปี` : 'ไม่มีแพ็กเกจสำหรับอายุนี้'; // Package available for age
        } else if (childCount === 2) {
            price = course.age_ranges.duo['3_to_12']; // Duo package for age 3 to 12
            packageResult = price ? `แพ็กเกจคู่สำหรับอายุ ${childAge} ปี` : 'ไม่มีแพ็กเกจสำหรับอายุนี้'; // Package available for age
        } else if (childCount >= 3 && childCount <= 4) {
            // Group package for 3-4 children, age does not matter
            packageResult = `แพ็กเกจกลุ่มสำหรับเด็ก ${childCount} คน`; // Group package available
            price = course.age_ranges.group['3_to_4']; // Price for group package
        } else {
            packageResult = "ไม่มีแพ็กเกจที่ว่างสำหรับจำนวนเด็กนี้"; // No available package for this number of children
        }
    } else {
        packageResult = "อายุที่ป้อนไม่ถูกต้อง."; // Invalid age entered
    }

    document.getElementById('modalPrice').innerText = price ? `$${price}` : 'ติดต่อผู้ดูแลสำหรับสอบถามข้อมูล'; // Contact admin for inquiries
    document.getElementById('packageResult').innerText = packageResult; // Show the package result
}

document.addEventListener('DOMContentLoaded', function() {
    loadCourses(); // Call your loadCourses function
    document.getElementById('submitBtn').addEventListener('click', function() {
        alert("ยังไม่ได้ทำจ้า");
    });
});
