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
            let table = document.getElementById("processTable");
            table.innerHTML = `
                <tr>
                    <th>PID</th>
                    <th>Name</th>
                    <th>CPU %</th>
                    <th>Action</th>
                </tr>
            `;

            data.forEach(proc => {
                let row = `
                    <tr>
                        <td>${proc.pid}</td>
                        <td>${proc.name}</td>
                        <td>${proc.cpu_percent}</td>
                        <td><button onclick="killProcess(${proc.pid})">Kill</button></td>
                    </tr>
                `;
                table.innerHTML += row;
            });
        });
}

// Kill Process
function killProcess(pid) {
    fetch("/api/kill", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({pid})
    }).then(() => loadProcesses());
}

loadSystemInfo();
loadProcesses();
