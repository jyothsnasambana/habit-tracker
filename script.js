let habits = JSON.parse(localStorage.getItem("habits")) || [];
let weeks = JSON.parse(localStorage.getItem("weeks")) || 2;
const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

monthLabel.innerText =
    new Date().toLocaleString("default",{month:"long",year:"numeric"});

function renderHeader() {
    let h = "<tr><th rowspan='2' class='habit-col'>Daily Habits</th>";
    for (let w = 1; w <= weeks; w++)
        h += `<th colspan='7'>Week ${w}</th>`;
    h += "</tr><tr>";
    for (let i = 0; i < weeks; i++)
        days.forEach(d => h += `<th class='day-cell'>${d[0]}</th>`);
    h += "</tr>";
    tableHead.innerHTML = h;
}

function renderTable() {
    renderHeader();
    tableBody.innerHTML = "";

    habits.forEach((h, hi) => {
        let tr = `<tr>
            <td class="habit-col">
                ${h.name}
                <span class="delete" onclick="deleteHabit(${hi})">❌</span>
            </td>`;

        for (let i = 0; i < weeks*7; i++) {
            tr += `<td class="day-cell">
                <input type="checkbox"
                ${h.days[i] ? "checked":""}
                onchange="toggleCheck(${hi},${i})">
            </td>`;
        }
        tr += "</tr>";
        tableBody.innerHTML += tr;
    });
}

function addHabit() {
    const name = habitName.value.trim();
    if (!name) return;

    habits.push({
        name,
        days: Array(weeks*7).fill(false)
    });
    habitName.value = "";
    save();
}

function deleteHabit(i) {
    habits.splice(i,1);
    save();
}

function addWeek() {
    weeks++;
    habits.forEach(h => h.days.push(...Array(7).fill(false)));
    save();
}

function toggleCheck(h,d) {
    habits[h].days[d] = !habits[h].days[d];
    save();
}

function openProgress() {
    progressBars.innerHTML = "";
    habits.forEach(h => {
        const total = h.days.length;
        const done = h.days.filter(x=>x).length;
        const percent = Math.round((done/total)*100);

        progressBars.innerHTML += `
            <div>${h.name} (${percent}%)</div>
            <div class="bar">
                <div class="bar-fill" style="width:${percent}%"></div>
            </div>`;
    });
    progressModal.style.display = "block";
}

function closeProgress() {
    progressModal.style.display = "none";
}

function save() {
    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("weeks", weeks);
    renderTable();
}

renderTable();
