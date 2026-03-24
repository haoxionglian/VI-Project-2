let chart;
let currentEpisodes = [];
let currentType = "line";

async function searchAnime() {
  const query = document.getElementById("animeInput").value;
  const status = document.getElementById("status");
  status.innerText = "Loading...";

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await res.json();

    if (!data.data.length) {
      status.innerText = "No results found.";
      return;
    }

    const anime = data.data[0];

    const epRes = await fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/episodes`);
    const epData = await epRes.json();

    currentEpisodes = epData.data.slice(0, 20);

    updateUI(currentEpisodes);

    status.innerText = `Showing: ${anime.title}`;

  } catch (err) {
    status.innerText = "Error loading data.";
  }
}

function updateUI(episodes) {
  displayEpisodes(episodes);
  createChart(episodes);
}

function displayEpisodes(episodes) {
  const container = document.getElementById("episodeList");
  container.innerHTML = "";

  episodes.forEach(ep => {
    const div = document.createElement("div");
    div.className = "episode";
    div.innerHTML = `
      <strong>Ep ${ep.mal_id}</strong> - ${ep.title} 
      | ⭐ ${ep.score || "N/A"}
    `;
    container.appendChild(div);
  });
}

function createChart(episodes) {
  const labels = episodes.map(ep => ep.mal_id);
  const scores = episodes.map(ep => ep.score || 0);

  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: currentType,
    data: {
      labels: labels,
      datasets: [{
        label: "Episode Score",
        data: scores,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true
        }
      }
    }
  });
}

// 🎛️ 切换图表类型
function toggleChartType() {
  currentType = currentType === "line" ? "bar" : "line";
  createChart(currentEpisodes);
}

// 🎛️ 过滤高分
function filterHighScore() {
  const filtered = currentEpisodes.filter(ep => ep.score >= 7);
  updateUI(filtered);
}

// 🎛️ 重置
function resetData() {
  updateUI(currentEpisodes);
}
