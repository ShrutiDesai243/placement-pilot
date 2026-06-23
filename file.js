// =====================================================
// REGISTER PAGE
// =====================================================

let registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event){

        event.preventDefault();

        let fullName = document.getElementById("fullName").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        if(password !== confirmPassword){
            alert("Passwords do not match");
            return;
        }

        let allUsers = JSON.parse(localStorage.getItem("users")) || [];

        let existingUser = allUsers.find(function(user){
            return user.email === email;
        });

        if(existingUser){
            alert("User already exists");
            return;
        }

        let newUser = {
            name: fullName,
            email: email,
            password: password
        };

        allUsers.push(newUser);

        localStorage.setItem("users", JSON.stringify(allUsers));

        alert("Registration Successful");

        window.location.href = "login.html";
    });

}



// =====================================================
// LOGIN PAGE
// =====================================================

let loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit", function(event){

        event.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        let allUsers = JSON.parse(localStorage.getItem("users")) || [];

        let currentUser = allUsers.find(function(user){

            return user.email === email &&
                    user.password === password;

        });

        if(!currentUser){
            alert("Invalid Email or Password");
            return;
        }

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(currentUser)
        );

        alert("Login Successful");

        let userPlan = localStorage.getItem("userPlan");

        if(userPlan){
            window.location.href = "prep.html";
        }
        else{
            window.location.href = "setup.html";
        }

    });

}

// =====================================================
// SETUP PAGE
// =====================================================

let setupForm = document.getElementById("setupForm");

if(setupForm){

    setupForm.addEventListener("submit", function(event){

        event.preventDefault();

        let role = document.getElementById("role").value;

        let months = parseInt(
            document.getElementById("months").value
        );

        let days = parseInt(
            document.getElementById("days").value
        );

        let hours = parseInt(
            document.getElementById("hours").value
        );

        let totalWeeks = months * 4;

        let totalHours = totalWeeks * days * hours;

        let plan = {

            role: role,
            months: months,
            daysPerWeek: days,
            hoursPerDay: hours,
            totalHours: totalHours,
            startDate: getTodayDate()

        };

        localStorage.setItem(
            "userPlan",
            JSON.stringify(plan)
        );

        alert("Plan Generated Successfully");

        window.location.href = "prep.html";

    });

}


// =====================================================
// PREPARATION PAGE
// =====================================================
let taskListElement =
document.getElementById("taskList");

if(taskListElement){

    
    const roleSubjects = {

        "Data Analyst": [
            "SQL",
            "Excel",
            "Python",
            "Power BI",
            "Statistics",
            "Git/GitHub",
            "Projects",
            "Job Applications"
        ],

        "Python Full Stack Developer": [
            "Python",
            "OOP",
            "DSA",
            "SQL",
            "HTML/CSS",
            "JavaScript",
            "Bootstrap",
            "Django",
            "REST API",
            "Git/GitHub",
            "Projects",
            "Aptitude",
            "Job Applications"
        ],

        "Java Full Stack Developer": [
            "Java",
            "OOP",
            "DSA",
            "SQL",
            "HTML/CSS",
            "JavaScript",
            "Bootstrap",
            "Spring Boot",
            "REST API",
            "Git/GitHub",
            "Projects",
            "Aptitude",
            "Job Applications"
        ]
    };

    const taskBank = {

        SQL: [
            "Practice SQL Queries",
            "Solve SQL Joins",
            "Solve SQL Interview Questions"
        ],

        Excel: [
            "Practice Pivot Tables",
            "Create Dashboard",
            "Practice Lookup Functions"
        ],

        Python: [
            "Solve Python Problems",
            "Revise Python Concepts",
            "Build Mini Python Project"
        ],

        "Power BI": [
            "Build Power BI Dashboard",
            "Practice DAX",
            "Create Visual Reports"
        ],

        Statistics: [
            "Probability Revision",
            "Descriptive Statistics",
            "Hypothesis Testing"
        ],

        DSA: [
            "Solve Array Problems",
            "Practice Linked List",
            "Solve Leetcode Questions"
        ],

        Java: [
            "OOP Revision",
            "Java Coding Practice",
            "Collections Framework"
        ],

        OOP: [
            "Practice Class Design",
            "Implement OOP Concepts",
            "Solve OOP Interview Questions"
        ],

        "HTML/CSS": [
            "Build Responsive Web Page",
            "Practice CSS Flexbox/Grid",
            "Clone Landing Page"
        ],

        JavaScript: [
            "Practice JavaScript Problems",
            "Build DOM Project",
            "Learn ES6 Features"
        ],

        "Spring Boot": [
            "Build REST API",
            "Practice JPA Queries",
            "Implement Authentication"
        ],

        Django: [
            "Build Django Module",
            "Practice ORM Queries",
            "Authentication Practice"
        ],

        "REST API": [
            "Create API Endpoint",
            "Test APIs Using Postman",
            "Implement CRUD Operations"
        ],

        Bootstrap: [
            "Build Responsive Layout",
            "Practice Bootstrap Components",
            "Convert Static Page To Bootstrap"
        ],

        "Git/GitHub": [
            "Practice Git Commands",
            "Push Project To GitHub",
            "Resolve Merge Conflicts"
        ],

        Projects: [
            "Work On Project",
            "Project Documentation",
            "Add New Feature"
        ],

        Aptitude: [
            "Quantitative Aptitude",
            "Logical Reasoning",
            "Verbal Ability"
        ],

        "Job Applications": [
            "Apply To Jobs",
            "Update Resume",
            "LinkedIn Networking"
        ]
    };

    const roleAllocation = {

        "Data Analyst": {
            SQL:20,
            Excel:20,
            Python:15,
            "Power BI":15,
            Statistics:10,
            "Git/GitHub":5,
            Projects:10,
            "Job Applications":5
        },

        "Python Full Stack Developer": {
            Python:15,
            OOP:8,
            DSA:15,
            SQL:10,
            "HTML/CSS":8,
            JavaScript:12,
            Bootstrap:5,
            Django:12,
            "REST API":5,
            "Git/GitHub":3,
            Projects:5,
            Aptitude:1,
            "Job Applications":1
        },

        "Java Full Stack Developer": {
            Java:15,
            OOP:8,
            DSA:15,
            SQL:10,
            "HTML/CSS":8,
            JavaScript:10,
            Bootstrap:4,
            "Spring Boot":15,
            "REST API":5,
            "Git/GitHub":3,
            Projects:5,
            Aptitude:1,
            "Job Applications":1
        }

    };

    function generateTasks(plan){

        let role = plan.role;

        let totalMinutes = plan.hoursPerDay * 60;

        let taskList = [];

        const allocation = roleAllocation[role];


        for(let subject in allocation){

            let subjectMinutes =
                Math.round(
                    totalMinutes *
                    allocation[subject] / 100
                );

            let subjectTasks =
                taskBank[subject];

            let randomIndex =
                Math.floor(
                    Math.random() *
                    subjectTasks.length
                );

            taskList.push({
                task:subjectTasks[randomIndex],
                duration:subjectMinutes + " mins",
                subject:subject,
                completed:false
            });

        }

        return taskList;
    }


    function displayTasks(tasks){

        let taskList = document.getElementById("taskList");

        taskList.innerHTML = "";

        tasks.forEach(function(item,index){

            let taskCard = document.createElement("article");

            taskCard.classList.add("task");

            taskCard.innerHTML = `

                <div class="task-left">

                    <input type="checkbox" class="taskCheck" ${item.completed ? "checked" : ""}>

                    <span>${item.task}</span>

                </div>

                <div class="task-right">

                    <span class="duration">
                        ${item.duration}
                    </span>

                    <span class="tag">
                        ${item.subject}
                    </span>

                </div>

            `;

            let checkbox =
            taskCard.querySelector(".taskCheck");

            checkbox.addEventListener("change",function(){

                checkedTask(index);

            });

            taskList.appendChild(taskCard);

        });

    }

    function updateProgress(){

        let tasks =
        JSON.parse(
            localStorage.getItem("todayTasks")
        );

        let completed =
        tasks.filter(
            task => task.completed
        ).length;

        let total =
        tasks.length;

        document.getElementById(
            "taskProgress"
        ).innerText =
        `${completed} / ${total} tasks completed`;

        let percentage =
        (completed / total) * 100;

        document.querySelector(
            ".progress-fill"
        ).style.width =
        percentage + "%";
    }


    // function updateStreak(){

    //     let tasks =
    //     JSON.parse(
    //         localStorage.getItem("todayTasks")
    //     );

    //     let completedCount =
    //     tasks.filter(
    //         task => task.completed
    //     ).length;

    //     let streak =
    //     parseInt(
    //         localStorage.getItem("streak")
    //     ) || 0;

    //     let streakDate =
    //     localStorage.getItem("streakDate");

    //     let today =
    //     getTodayDate();

    //     if(
    //         completedCount >= 3 &&
    //         streakDate !== today
    //     ){

    //         streak++;

    //         localStorage.setItem(
    //             "streak",
    //             streak
    //         );

    //         localStorage.setItem(
    //             "streakDate",
    //             today
    //         );
    //     }

    //     let streakElement =
    //     document.querySelector(
    //         ".streak-count"
    //     );

    //     if(streakElement){

    //         streakElement.innerText =
    //         streak + " Days";
    //     }

    // }

    function updateStreak(){

        let history =
        JSON.parse(
            localStorage.getItem("dailyHistory")
        ) || [];

        let streak = 0;

        for(
            let i = history.length - 1;
            i >= 0;
            i--
        ){

            if(
                history[i].completedTasks >= 3
            ){
                streak++;
            }
            else{
                break;
            }
        }

        let streakElement =
        document.querySelector(
            ".streak-count"
        );

        if(streakElement){

            streakElement.innerText =
            streak + " Days";
        }

        localStorage.setItem(
            "streak",
            streak
        );
    }

    function saveTodayHistory(){

        let tasks =
        JSON.parse(
            localStorage.getItem("todayTasks")
        );

        let completed =
        tasks.filter(
            task => task.completed
        ).length;

        let history =
        JSON.parse(
            localStorage.getItem("dailyHistory")
        ) || [];

        let today =
        getTodayDate();

        let dayFound =
        history.find(
            item => item.date === today
        );

        if(dayFound){

            dayFound.completedTasks =
            completed;
        }
        else{

            history.push({

                date: today,
                completedTasks: completed

            });
        }

        localStorage.setItem(
            "dailyHistory",
            JSON.stringify(history)
        );
    }

    function checkedTask(index){

        let tasks =
        JSON.parse(
            localStorage.getItem("todayTasks")
        );

        tasks[index].completed =
        !tasks[index].completed;

        localStorage.setItem(
            "todayTasks",
            JSON.stringify(tasks)
        );

        saveTodayHistory();

        updateProgress();
        updateStreak();
        updateWeeklyConsistency();

        updateAllSubjectProgress();

        displayTasks(tasks);
    }

    function updateWeeklyConsistency(){

        let history =
        JSON.parse(
            localStorage.getItem("dailyHistory")
        ) || [];

        history.sort((a,b)=>{

            return new Date(a.date) -
                new Date(b.date);

        });

        let lastSevenDays =
        history.slice(-7);

        let completedDays = 0;

        lastSevenDays.forEach((day)=>{

            if(day.completedTasks >= 3){
                completedDays++;
            }

        });

        let percentage =
        Math.round(
            (completedDays / 7) * 100
        );

        if(percentage > 100){
            percentage = 100;
        }

        document.getElementById(
            "weekProgressText"
        ).innerText =
        percentage + "%";

        document.getElementById(
            "weekProgressBar"
        ).style.width =
        percentage + "%";
    }

    function updateAllSubjectProgress(){

        let tasks =
        JSON.parse(
            localStorage.getItem("todayTasks")
        );

        let progress = {};

        tasks.forEach((task)=>{

            if(!progress[task.subject]){
                progress[task.subject] = 0;
            }

            if(task.completed){
                progress[task.subject] += 100;
            }
        });

        localStorage.setItem(
            "subjectProgress",
            JSON.stringify(progress)
        );

        loadSubjectProgress();
    }    

    function getTodayDate(){

        let today = new Date();

        return today.getDate() + "-"
            + (today.getMonth() + 1) + "-"
            + today.getFullYear();
    }

    function checkForNewDay(){

        let currentDate =
        getTodayDate();

        let savedDate =
        localStorage.getItem("taskDate");

        if(savedDate !== currentDate){

            generateNewDayTasks();

        }
    }

    function generateNewDayTasks(){

        let plan =
        JSON.parse(
            localStorage.getItem("userPlan")
        );

        let oldTasks =
        JSON.parse(
            localStorage.getItem("todayTasks")
        ) || [];

        pendingTasks =
        oldTasks.filter(
            task => !task.completed
        ).slice(0,2);

        let newTasks =
        generateTasks(plan);

        pendingTasks.forEach((task)=>{

            task.duration = "20 mins";

            newTasks.push(task);

        });

        localStorage.setItem(
            "todayTasks",
            JSON.stringify(newTasks)
        );

        localStorage.setItem(
            "taskDate",
            getTodayDate()
        );
    }


    function getFormattedDate(){

        let today = new Date();

        let day = today.getDate();

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let month = months[today.getMonth()];

        let year =
        today.getFullYear();

        return `${day}-${month}-${year}`; //10-Jun-2026
    }

    let currentDateElement =
    document.getElementById("currentDate");

    if(currentDateElement){

        currentDateElement.innerText =
        getFormattedDate();

    }

    checkForNewDay();

    let tasks =
    JSON.parse(
        localStorage.getItem("todayTasks")
    );

    if(tasks){

        displayTasks(tasks);

        updateProgress();

        updateStreak();

        updateWeeklyConsistency();

        loadRoadmapCard();

        loadSubjectProgress();
    }


    function loadRoadmapCard(){

        let plan =
        JSON.parse(
            localStorage.getItem("userPlan")
        );

        if(!plan){
            return;
        }

        document.getElementById(
            "targetRole"
        ).innerText =
        plan.role;

        document.getElementById(
            "studyHours"
        ).innerText =
        plan.hoursPerDay + " hrs/day";

        document.getElementById(
            "weeklyGoal"
        ).innerText =
        plan.daysPerWeek + " Days";

        let daysLeft =
        plan.months * 30;

        document.getElementById(
            "remainingDays"
        ).innerText =
        daysLeft;
    }

    function loadSubjectProgress(){

        let progress =
        JSON.parse(
            localStorage.getItem("subjectProgress")
        ) || {};

        let plan =
        JSON.parse(
            localStorage.getItem("userPlan")
        );

        if(!plan){
            return;
        }

        let subjects =
        roleSubjects[plan.role];

        let container =
        document.getElementById(
            "subjectProgressContainer"
        );

        if(!container){
            return;
        }

        container.innerHTML = "";

        subjects.forEach(function(subject){

            let percent =
            progress[subject] || 0;

            if(percent > 100){
                percent = 100;
            }

            container.innerHTML += `

                <div class="subject-item">

                    <p>${subject}</p>

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${percent}%">
                        </div>

                    </div>

                    <small>${percent}%</small>

                </div>

            `;
        });
    }

}































let logoutBtn = document.querySelector("#logout-btn")
if(logoutBtn){

    logoutBtn.addEventListener("click",()=>{
        console.log("logout clicked");
        
        let confirmed = confirm("Are you sure to Logout?")
        if(confirmed){
            window.location.href = "landing.html"
            // alert("Logged Out Successfully!")

        }

    })
}