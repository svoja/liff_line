const apiUrl = 'https://6728186d270bd0b975544d1e.mockapi.io/api/bbm/courses'; // Your actual mock API URL
const courses_type_apiUrl = 'https://6728186d270bd0b975544d1e.mockapi.io/api/bbm/courses_type'; // Your actual mock API URL


async function loadCourses() {
    try {
        // Fetching from the MockAPI endpoint
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const courses = await response.json();

        const container = document.getElementById('course-container');
        const addCourseButton = document.getElementById('addCourseBtn');
        container.innerHTML = ''; // Clear existing content

        courses.forEach(course => {
            const courseHTML = `
            <div class="col-md-4 col-sm-6 mb-3">
                <a href="#" class="image-btn" onclick="showCourseModal('${course.subject_id}', '${course.image}')">
                    <img src="${course.image}" alt="${course.subject_name}">
                    <div class="overlay">${course.subject_name}</div>
                </a> 
            </div>
            `;
            container.insertAdjacentHTML('beforeend', courseHTML);
            container.appendChild(addCourseButton.parentNode);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function showCourseModal(subject_id, imageUrl) {
    try {
        const response = await fetch(apiUrl); // Fetch from the mock API
        const courses = await response.json();
        
        const course = courses.find(c => c.subject_id === parseInt(subject_id)); // Ensure subject_id is compared as a number
        if (course) {
            document.getElementById('modalImage').src = imageUrl;
            document.getElementById('modalName').innerText = course.subject_name; // Updated property name
            document.getElementById('modalDescription').innerText = course.description || 'ไม่มีข้อมูล'; // No data

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

    // Determine the package based on type_id and age/number of children
    if (course.type_id === 1) { // Match by type_id for exercise courses
        if (childAge >= 0 && childAge < 3) {
            // Only Single Package available for ages 0 to 2
            if (childCount === 1) {
                price = course.age_ranges.single['9m_to_2y'];
                packageResult = price ? `แพ็กเกจเดี่ยวสำหรับอายุ ${childAge} ปี` : 'ไม่มีแพ็กเกจสำหรับอายุนี้';
            } else {
                packageResult = 'ไม่มีแพ็กเกจสำหรับจำนวนเด็กมากกว่าหนึ่งคนในอายุนี้'; // No packages for more than one child in this age
            }
        } else if (childAge >= 3 && childAge <= 12) {
            // Age 3 to 12 handling
            if (childCount === 1) {
                price = course.age_ranges.single['3_to_12'];
                packageResult = price ? `แพ็กเกจเดี่ยวสำหรับอายุ ${childAge} ปี` : 'ไม่มีแพ็กเกจสำหรับอายุนี้'; // Package available for age
            } else if (childCount === 2) {
                price = course.age_ranges.duo['3_to_12'];
                packageResult = price ? `แพ็กเกจคู่สำหรับอายุ ${childAge} ปี` : 'ไม่มีแพ็กเกจสำหรับอายุนี้'; // Package available for age
            } else if (childCount >= 3 && childCount <= 4) {
                price = course.age_ranges.group['3_to_4'];
                packageResult = price ? `แพ็กเกจกลุ่มสำหรับเด็ก ${childCount} คน` : 'ไม่มีแพ็กเกจสำหรับอายุนี้'; // Package available for age
            } else {
                packageResult = "ไม่มีแพ็กเกจที่ว่างสำหรับจำนวนเด็กนี้"; // No available package for this number of children
            }
        } else {
            packageResult = "อายุที่ป้อนไม่ถูกต้อง."; // Invalid age entered
        }
    } else if (course.type_id === 2) { // Match by type_id for music courses
        // Handle music packages
        if (childCount === 1) {
            price = course.age_ranges.single['age_unrestricted'];
            packageResult = price ? `แพ็กเกจเดี่ยวสำหรับอายุ ${childAge} ปี` : 'ไม่มีแพ็กเกจสำหรับอายุนี้'; // Package available for age
        } else if (childCount >= 2) {
            price = course.age_ranges.group['age_unrestricted'];
            packageResult = `แพ็กเกจกลุ่มสำหรับเด็ก ${childCount} คน`; // Group package available
        } else {
            packageResult = "ไม่มีแพ็กเกจที่ว่างสำหรับจำนวนเด็กนี้"; // No available package for this number of children
        }
    } else {
        packageResult = "ไม่พบคอร์สที่เลือก."; // Course not found
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

document.addEventListener('DOMContentLoaded', function() {
    // Function to load course types from JSON
    function loadCourseTypes() {
        fetch(courses_type_apiUrl) // Update with the correct path to your JSON file
            .then(response => response.json())
            .then(data => {
                const courseTypeSelect = document.getElementById('courseType');
                data.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type.type_id;
                    option.textContent = type.type_name;
                    courseTypeSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading course types:', error));
    }

    // Call the function to load course types
    loadCourseTypes();
});