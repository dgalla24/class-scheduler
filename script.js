let allCourses = [];
let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses")) || [];;

function syncToLocalStorage(){
    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
}

function renderCourses(courseList){
    const container = document.getElementById("courseContainer");
    const message = document.getElementById("noResultsMessage");
    container.innerHTML = '';

    if(courseList.length === 0){
        message.style.display = "block";
        return;
    } else{
        message.style.display = "none";
    }

    courseList.forEach(course =>{
        const card = document.createElement("div");
        card.className = "courseCard";

        card.innerHTML =`
            <div class = "cardContent">
                <h3>${course.name}</h3>
                <p><strong>Instructor: </strong>${course.instructor}</p>
                <p><strong>Time: </strong>${course.time}</p>
                <p><strong>Days: </strong>${course.days}</p>
                <p><strong>Location: </strong>${course.location}</p>
            </div>
            <button class = "selectButton">Select</button>
            <div class = "priorityDropdown" style = "display: none;">
                <label>Select Priority</label>
                <select>
                    <option value = "">-- Choose -- </option>
                    <option value = "Required">Required</option>
                    <option value = "High Priority">High Priority</option>
                    <option value = "Low Priority">Low Priority</option>
                </select>
            </div>
        `;

        container.appendChild(card);

        const selectBtn = card.querySelector(".selectButton");
        const dropdown = card.querySelector(".priorityDropdown");
        const dropdownSelect = card.querySelector("select");
        const alreadySelected = selectedCourses.some(c => c.id === course.id);

        if(alreadySelected){
            selectBtn.disabled = true;
            selectBtn.textContent = "Selected";
        } else{
            selectBtn.addEventListener("click", () => {
                dropdown.style.display = "block";
            })

            dropdownSelect.addEventListener("change", () => {
                const selectedPriority = dropdownSelect.value;
                if(selectedPriority) {
                    selectedCourses.push({
                        id: course.id,
                        name: course.name,
                        priority: selectedPriority,
                    });
                    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
                    console.log(selectedCourses);

                    dropdown.style.display = "none";
                    selectBtn.disabled = true;
                    selectBtn.textContent = "Selected";
                    updateSelectedCoursesSidebar();
                }
            })
        }
    })
}

//creates department dropdown search
function populateDepartmentDropdown(courses){
    const dropDown = document.getElementById("searchDepartment");

    const departments = [... new Set(courses.map(course => course.department))]

    departments.forEach(dept =>{
        const option = document.createElement("option")
        option.value = dept;
        option.textContent = dept;
        dropDown.appendChild(option);
    });
}
//filters the courses based on search and department
function filterCourses(){
    console.log("Filtering...");
    const selectedDept = document.getElementById("searchDepartment").value.toLowerCase();
    const keyword = document.getElementById("searchKeyword").value.toLowerCase();

    const filtered = allCourses.filter(course => {
        const deptMatches = selectedDept === "" || course.department.toLowerCase() === selectedDept;
        const keywordMatches = 
            keyword === "" ||
            course.name.toLowerCase().includes(keyword) ||
            course.instructor.toLowerCase().includes(keyword) ||
            course.time.toLowerCase().includes(keyword) ||
            Array.isArray(course.days) && course.days.join(" ").toLowerCase().includes(keyword) ||
            course.location.toLowerCase().includes(keyword);
        return deptMatches && keywordMatches;
    })

    renderCourses(filtered);
}

function updateSelectedCoursesSidebar(){
    const sideBarList = document.getElementById("selectedCoursesList");
    sideBarList.innerHTML = '';
    
    selectedCourses.forEach((course, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${course.name}</strong> - 
            <select data-index = "${index}">
                <option value = "Required" ${course.priority === "Required" ? "selected" : ""}>Required</option>
                <option value = "High Priority" ${course.priority === "High Priority" ? "selected" : ""}>High Priority</option>
                <option value = "Low Priority" ${course.priority === "Low Priority" ? "selected" : ""}>Low Priority</option>
            </select>
            <button data-index = "${index}" class = "removeBtn">Remove</button>
        `;
        sideBarList.appendChild(li);
    })
    syncToLocalStorage();
}

document.getElementById("selectedCoursesList").addEventListener("click", (e) => {
    if(e.target.classList.contains("removeBtn")){
        const index = e.target.getAttribute("data-index");
        selectedCourses.splice(index, 1);
        updateSelectedCoursesSidebar();
        renderCourses(allCourses);
        filterCourses();
    }
})

document.getElementById("selectedCoursesList").addEventListener("change", (e) => {
    if(e.target.tagName === "SELECT"){
        const index = e.target.getAttribute("data-index");
        selectedCourses[index].priority = e.target.value;
        updateSelectedCoursesSidebar();
        renderCourses(allCourses);
    }
})

window.addEventListener("load", () => {
    const saved = localStorage.getItem("selectedCourses");
    if(saved){
        selectedCourses = JSON.parse(saved);
        updateSelectedCoursesSidebar();
    }
});

fetch('courses.json')
    .then(response => response.json())
    .then(data => {
        allCourses = data
        populateDepartmentDropdown(data);
        renderCourses(data);

        const dropdown = document.getElementById("searchDepartment");
        const keywordInput = document.getElementById("searchKeyword");

        dropdown.addEventListener("change", filterCourses);
        keywordInput.addEventListener("input", filterCourses);

    })
    .catch(error => console.error('Error loading courses:', error));