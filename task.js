const tasks = {
    "2024-01-17": [{ time: "11:00", description: "Planning for the crop rotation." }],
    "2024-01-18": [{ time: "11:00", description: "Preparing the land for sowing." }],
    "2024-01-19": [{ time: "11:00", description: "Seed selection and treatment." }],
    "2024-01-20": [
        { time: "11:00", description: "Sowing seeds or transplanting seedlings according to the crop rotation plan." },
        { time: "11:45", description: "Sowing seeds or transplanting seedlings according to the crop rotation plan." }
    ],
    "2024-01-21": [{ time: "12:00", description: "Setting up irrigation systems such as drip lines or sprinklers." }],
    "2024-01-22": [{ time: "13:00", description: "Fertilizing the crops with organic fertilizer." }],
    "2024-01-23": [
        { time: "14:00", description: "Inspecting crops for pests and diseases." },
        { time: "15:00", description: "Watering the crops." }
    ],
};

let currentDate = new Date(); // Initialize currentDate
let today = currentDate.toISOString().slice(0, 10);

function generateCalendar(date) {
    // ... (calendar generation code - same as before)
    // Add active class to current day
    const days = document.querySelectorAll('.day');
    days.forEach(day => {
        if (parseInt(day.textContent) === date.getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            day.classList.add('active');
        } else {
            day.classList.remove('active');
        }
    });

    document.getElementById("currentMonth").textContent = date.toLocaleString('default', { month: 'long' });
    updateTasks();
}

function updateTasks() {
    const tasksTable = document.getElementById("tasksTable").getElementsByTagName('tbody')[0];
    tasksTable.innerHTML = "";

    const filteredTasks = tasks[today] ? [...tasks[today]] : [];
    const now = new Date();

    const currentTasks = filteredTasks.filter(task => {
        const [hours, minutes] = task.time.split(':').map(Number);
        const taskDate = new Date();
        taskDate.setFullYear(currentDate.getFullYear());
        taskDate.setMonth(currentDate.getMonth());
        taskDate.setDate(currentDate.getDate());
        taskDate.setHours(hours, minutes, 0, 0);

        return taskDate > now;
    });

    currentTasks.forEach(task => {
        const row = tasksTable.insertRow();
        const timeCell = row.insertCell();
        const descriptionCell = row.insertCell();
        const checkboxCell = row.insertCell();

        timeCell.textContent = task.time;
        descriptionCell.textContent = task.description;
        checkboxCell.innerHTML = '<input type="checkbox" class="task-checkbox">';
    });

    if (currentTasks.length > 0) {
        document.getElementById('upcomingTaskTime').textContent = `Upcoming task Today, ${currentTasks[0].time}`;
        document.getElementById('upcomingTaskDescription').textContent = currentTasks[0].description;
    } else {
        document.getElementById('upcomingTaskTime').textContent = `No task for today`;
        document.getElementById('upcomingTaskDescription').textContent = ``;
    }

    const totalTasks = Object.values(tasks).flat().length;
    let completedTasks = 0;
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            completedTasks++;
        }
    });
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('tasksCompleted').textContent = `${percentage.toFixed(0)}% Tasks Completed`;
    document.querySelector('.progress').style.width = `${percentage}%`;
}

setInterval(() => {
    today = currentDate.toISOString().slice(0, 10); //Update today every minute
    updateTasks();
}, 60000);

generateCalendar(currentDate);