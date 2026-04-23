const API = "http://joelsiervas.online:8080";

async function loadSeries() {
    const q = document.getElementById("search").value;
    const res = await fetch(`${API}/series?q=${q}`);
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(s => {
        const percent = s.total ? (s.progress / s.total) * 100 : 0;

        list.innerHTML += `
        <tr>
            <td><img src="${s.image}"></td>
            <td>${s.title}</td>
            <td>${s.type}</td>

            <td>
                ${s.progress}/${s.total}
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${percent}%"></div>
                </div>
            </td>

            <td>
                <input type="number" id="p-${s.id}" style="width:60px;">
                <button onclick="updateProgress(${s.id})">✔</button>
            </td>

            <td>
                <button onclick="deleteSeries(${s.id})">❌</button>
            </td>
        </tr>
        `;
    });
}

async function addSeries() {
    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    const total = document.getElementById("total").value;
    const image = document.getElementById("image").value;

    await fetch(`${API}/series`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            title,
            type,
            total: Number(total),
            progress: 0,
            image
        })
    });

    loadSeries();
}

async function updateProgress(id) {
    const progress = document.getElementById(`p-${id}`).value;

    await fetch(`${API}/series/progress`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, progress: Number(progress)})
    });

    loadSeries();
}

async function deleteSeries(id) {
    await fetch(`${API}/series/${id}`, {method: "DELETE"});
    loadSeries();
}

loadSeries();