from flask import Flask, send_from_directory, jsonify, request
import psutil
import platform
import os

app = Flask(__name__)

# Serve index.html
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# Serve CSS
@app.route('/style.css')
def css():
    return send_from_directory('.', 'style.css')

# Serve JS
@app.route('/script.js')
def js():
    return send_from_directory('.', 'script.js')


# API: System Info
@app.route('/api/system')
def system_info():
    info = {
        "os": platform.system(),
        "os_version": platform.version(),
        "cpu_usage": psutil.cpu_percent(),
        "ram_total": round(psutil.virtual_memory().total / (1024 ** 3), 2),
        "ram_used": round(psutil.virtual_memory().used / (1024 ** 3), 2),
        "ram_percent": psutil.virtual_memory().percent
    }
    return jsonify(info)


# API: List Processes
@app.route('/api/processes')
def get_processes():
    processes = []
    for p in psutil.process_iter(['pid', 'name', 'cpu_percent']):
        processes.append(p.info)
    return jsonify(processes)


# API: Kill Process
@app.route('/api/kill', methods=['POST'])
def kill_process():
    pid = request.json.get('pid')
    try:
        p = psutil.Process(pid)
        p.terminate()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
