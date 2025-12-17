// Global variable to store all processes
let allProcesses = [];

// Load System Info
function loadSystemInfo() {
    fetch("/api/system")
        .then(res => res.json())
        .then(data => {
            document.getElementById("os").innerText = data.os;
            document.getElementById("os_version").innerText = data.os_version;
            document.getElementById("cpu").innerText = data.cpu_usage;
            document.getElementById("ram_used").innerText = data.ram_used;
            document.getElementById("ram_total").innerText = data.ram_total;
            document.getElementById("ram_percent").innerText = data.ram_percent;
        });
}

// Load Process List
function loadProcesses() {
    fetch("/api/processes")
        .then(res => res.json())
        .then(data => {
            allProcesses = data;      // store all processes
            displayProcesses(data);   // display all initially
        });
}

// Display processes in table
function displayProcesses(processes) {
    let table = document.getElementById("processTable");

    table.innerHTML = `
        <tr>
            <th>PID</th>
            <th>Name</th>
            <th>CPU %</th>
            <th>Action</th>
        </tr>
    `;

    processes.forEach(proc => {
        let row = `
            <tr>
                <td>${proc.pid}</td>
                <td>${proc.name}</td>
                <td>${proc.cpu_percent}</td>
                <td>
                    <button 
                        onclick="killProcess(${proc.pid})"
                        style="color:white;font-weight:600;font-size:15px;border:none;background-color:red;padding:8px 20px;border-radius:3px;cursor:pointer;">
                        Kill
                    </button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// Search / Filter Processes
function filterProcesses() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();

    let filteredProcesses = allProcesses.filter(proc =>
        proc.name.toLowerCase().includes(searchValue) ||
        proc.pid.toString().includes(searchValue)
    );

    displayProcesses(filteredProcesses);
}

// Kill Process
function killProcess(pid) {
    fetch("/api/kill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid })
    }).then(() => loadProcesses());
}

// Initial Load
loadSystemInfo();
loadProcesses();
