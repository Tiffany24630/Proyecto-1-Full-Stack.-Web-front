const API = "";

async function loadSeries() {
    const q = document.getElementById("search").value;
    try {
        const res = await fetch(`${API}/series?q=${q}`);
        
        if (!res.ok) throw new Error("Error al cargar las series");

        const data = await res.json();
        const list = document.getElementById("list");
        
        list.innerHTML = "";

        data.forEach(s => {
            const percent = s.total ? (s.progress / s.total) * 100 : 0;

            list.innerHTML += `
            <div class="card">
                <img src="${s.image}" alt="${s.title}" style="width:100%">
                <h3>${s.title}</h3>
                <p>Progreso: ${s.progress} / ${s.total}</p>

                <div class="progress-bar" style="background: #eee; width: 100%; height: 10px;">
                    <div class="progress-fill" style="width:${percent}%; background: green; height: 10px;"></div>
                </div>

                <input type="number" id="p-${s.id}" placeholder="Nuevo progreso">
                <button onclick="updateProgress(${s.id})">Actualizar</button>
                <button onclick="deleteSeries(${s.id})" style="color: red;">Eliminar</button>
            </div>`;
        });
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

async function addSeries() {
    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    const total = document.getElementById("total").value;
    const image = document.getElementById("image").value;

    try {
        const res = await fetch(`${API}/series`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, type, total: Number(total), progress: 0, image })
        });

        if (res.ok) {
            loadSeries();
        }
    } catch (error) {
        console.error("Error al añadir:", error);
    }
}

async function updateProgress(id) {
    const progressInput = document.getElementById(`p-${id}`);
    const progress = progressInput.value;

    try {
        const res = await fetch(`${API}/series/${id}`, {
            method: "PATCH", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ progress: Number(progress) })
        });

        if (res.ok) {
            loadSeries();
        } else {
            alert("Error al actualizar el progreso");
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
    }
}

async function deleteSeries(id) {
    if (!confirm("¿Seguro que quieres eliminar esta serie?")) return;

    try {
        const res = await fetch(`${API}/series/${id}`, { method: "DELETE" });
        if (res.ok) loadSeries();
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

loadSeries();