const state = {
  gong: 0,
  guo: 0,
  note: "起心动念，都可轻轻记下一笔。",
  pendingType: null,
  recentActions: [],
  history: [
    { date: "四月二十六", result: "偏功", gong: 2, guo: 0 },
    { date: "四月二十五", result: "相抵", gong: 1, guo: 1 },
    { date: "四月二十四", result: "偏过", gong: 0, guo: 2 },
    { date: "四月二十三", result: "偏功", gong: 3, guo: 1 },
    { date: "四月二十二", result: "相抵", gong: 1, guo: 1 },
    { date: "四月二十一", result: "偏功", gong: 2, guo: 1 },
    { date: "四月二十", result: "偏过", gong: 0, guo: 1 },
  ],
};

const copyMap = {
  gong: ["善念记下了。", "此行可记一功。", "心有向善，已见分明。"],
  guo: ["此过已知。", "这一念，记下了。", "知其所失，已是起点。"],
  neutral: ["功过相抵，仍可再正。", "有得有失，记下便好。", "此日不偏，仍可再明。"],
};

const tokenHints = {
  gong: ["今天做对了什么", "此刻想记住哪一点好", "哪一个念头值得留住"],
  guo: ["哪一句话想提醒自己", "今天哪里失了分寸", "哪一个念头下次想收住"],
  rapidGong: ["连记数功，也留一分平常心", "善行可喜，莫急于求功", "功多时，更宜从容记下"],
  rapidGuo: ["连续记过，先缓一口气", "过多时，记下即可，不必自责", "看见已经是开始，慢慢来"],
  mixed: ["功过相续，先照见这一念", "这一刻起伏很多，轻轻记下", "不急着评判，先把此念收住"],
};

const gongPit = document.getElementById("gongPit");
const guoPit = document.getElementById("guoPit");
const gongCount = document.getElementById("gongCount");
const guoCount = document.getElementById("guoCount");
const netLabel = document.getElementById("netLabel");
const statusNote = document.getElementById("statusNote");
const heartCanvas = document.getElementById("heartCanvas");
const heartCtx = heartCanvas.getContext("2d");
const historyList = document.getElementById("historyList");
const summarySheet = document.getElementById("summarySheet");
const shareSheet = document.getElementById("shareSheet");
const tokenLayer = document.getElementById("tokenLayer");
const recordToken = document.getElementById("recordToken");
const recordText = document.getElementById("recordText");
const tokenKicker = document.getElementById("tokenKicker");
const submitToken = document.getElementById("submitToken");
const flyingSpark = document.getElementById("flyingSpark");
const lightParticles = Array.from({ length: 54 }, (_, index) => ({
  angle: (Math.PI * 2 * index) / 54,
  radius: 34 + Math.random() * 82,
  speed: 0.00045 + Math.random() * 0.0007,
  size: 1.2 + Math.random() * 2.6,
  drift: Math.random() * Math.PI * 2,
}));
const burstParticles = [];
let pulse = { kind: "neutral", value: 0 };

function pickCopy(kind) {
  const group = copyMap[kind];
  return group[Math.floor(Math.random() * group.length)];
}

function createBean(type, shouldDrop = false, index = 0) {
  const bean = document.createElement("span");
  bean.className = `bean bean-${type}${shouldDrop ? " bean-drop" : ""}`;
  const offsetX = ((index % 5) - 2) * 2 + (Math.random() * 4 - 2);
  const offsetY = Math.floor(index / 5) * -2 + (Math.random() * 3 - 1.5);
  const rotate = (Math.random() * 34 - 17).toFixed(1);
  bean.style.setProperty("--bean-x", `${offsetX.toFixed(1)}px`);
  bean.style.setProperty("--bean-y", `${offsetY.toFixed(1)}px`);
  bean.style.setProperty("--bean-rotate", `${rotate}deg`);
  return bean;
}

function renderPit(targetId, count, type) {
  const target = document.getElementById(targetId);
  target.replaceChildren();
  for (let index = 0; index < count; index += 1) {
    target.append(createBean(type, false, index));
  }
}

function rememberAction(type) {
  const now = Date.now();
  state.recentActions = state.recentActions
    .filter((action) => now - action.at < 12000)
    .concat({ type, at: now })
    .slice(-5);
}

function getTokenHint(type) {
  const recent = state.recentActions.filter((action) => Date.now() - action.at < 12000);
  const sameTypeCount = recent.filter((action) => action.type === type).length;
  const hasMixed = recent.length >= 3 && recent.some((action) => action.type !== type);

  if (sameTypeCount >= 3 && type === "gong") {
    return tokenHints.rapidGong[Math.floor(Math.random() * tokenHints.rapidGong.length)];
  }
  if (sameTypeCount >= 3 && type === "guo") {
    return tokenHints.rapidGuo[Math.floor(Math.random() * tokenHints.rapidGuo.length)];
  }
  if (hasMixed) {
    return tokenHints.mixed[Math.floor(Math.random() * tokenHints.mixed.length)];
  }
  return tokenHints[type][Math.floor(Math.random() * tokenHints[type].length)];
}

function currentResult() {
  if (state.gong > state.guo) {
    return { label: "偏功", kind: "gong" };
  }
  if (state.guo > state.gong) {
    return { label: "偏过", kind: "guo" };
  }
  return { label: "相抵", kind: "neutral" };
}

function syncStatus() {
  const result = currentResult();
  netLabel.textContent = result.label;
}

function syncSummary() {
  const result = currentResult();
  document.getElementById("summaryLabel").textContent = result.label;
  document.getElementById("summaryCounts").textContent = `赤豆 ${state.gong} · 青豆 ${state.guo}`;
  document.getElementById("summaryCopy").textContent = state.note;
}

function renderSharePile(targetId, count, type) {
  const target = document.getElementById(targetId);
  target.replaceChildren();
  const maxBeans = Math.min(count, 8);
  for (let index = 0; index < maxBeans; index += 1) {
    target.append(createBean(type));
  }
}

function syncShareCard() {
  const result = currentResult();
  renderSharePile("shareGong", state.gong, "gong");
  renderSharePile("shareGuo", state.guo, "guo");
  document.getElementById("shareResult").textContent = result.label;
  document.getElementById("shareCopy").textContent = state.note === "起心动念，都可轻轻记下一笔。"
    ? "我在这里轻记一日功过。"
    : state.note;
}

function renderHistory() {
  historyList.replaceChildren();
  state.history.forEach((item) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const badgeKind = item.result === "偏功" ? "gong" : item.result === "偏过" ? "guo" : "neutral";
    li.innerHTML = `
      <div class="history-top">
        <span class="history-date">${item.date}</span>
        <span class="history-badge ${badgeKind}">${item.result}</span>
      </div>
      <div class="history-bottom">
        <span>赤豆 ${item.gong}</span>
        <span>青豆 ${item.guo}</span>
      </div>
    `;
    historyList.append(li);
  });
}

function render(options = {}) {
  renderPit("gongPit", state.gong, "gong");
  renderPit("guoPit", state.guo, "guo");
  if (options.dropType && options.dropTargetId) {
    const target = document.getElementById(options.dropTargetId);
    const lastBean = target.lastElementChild;
    if (lastBean) {
      lastBean.classList.add("bean-drop");
      flashVessel(options.dropTargetId);
      lastBean.addEventListener("animationend", () => {
        lastBean.classList.remove("bean-drop");
      }, { once: true });
    }
  }
  gongCount.textContent = String(state.gong);
  guoCount.textContent = String(state.guo);
  statusNote.textContent = state.note;
  syncStatus();
  syncSummary();
  syncShareCard();
}

function flashVessel(targetId) {
  const vesselId = targetId === "gongPit" ? "gongVessel" : "guoVessel";
  const vessel = document.getElementById(vesselId);
  vessel.classList.remove("is-lit");
  requestAnimationFrame(() => {
    vessel.classList.add("is-lit");
    setTimeout(() => vessel.classList.remove("is-lit"), 520);
  });
}

function triggerHeartPulse(kind) {
  pulse = { kind, value: 1 };
  for (let index = 0; index < 26; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.4 + Math.random() * 3.2;
    burstParticles.push({
      kind,
      x: heartCanvas.width / 2,
      y: heartCanvas.height / 2 - 8,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (kind === "gong" ? 1.4 : 0.2),
      life: 1,
      size: 1.8 + Math.random() * 3.8,
      spin: Math.random() * Math.PI * 2,
    });
  }
}

function drawGlow(x, y, radius, colorStops) {
  const gradient = heartCtx.createRadialGradient(x, y, 0, x, y, radius);
  colorStops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
  heartCtx.fillStyle = gradient;
  heartCtx.beginPath();
  heartCtx.arc(x, y, radius, 0, Math.PI * 2);
  heartCtx.fill();
}

function fillRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawHeartScene(time = 0) {
  const width = heartCanvas.width;
  const height = heartCanvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const result = currentResult();
  const net = state.gong - state.guo;
  const balance = Math.max(-1, Math.min(1, net / 6));
  const warmPower = Math.max(0.12, 0.46 + balance * 0.48);
  const coldPower = Math.max(0.02, -balance * 0.58);
  const dimPower = Math.max(0, -balance);
  const pulseBoost = pulse.value * 0.45;

  heartCtx.clearRect(0, 0, width, height);

  heartCtx.save();
  heartCtx.translate(cx, cy);
  const rayCount = 12;
  for (let index = 0; index < rayCount; index += 1) {
    const angle = (Math.PI * 2 * index) / rayCount + time * 0.00016;
    const rayAlpha = Math.max(0, warmPower - 0.38) * (0.14 + pulseBoost * 0.18);
    if (rayAlpha > 0.01) {
      heartCtx.rotate(angle);
      const rayGradient = heartCtx.createLinearGradient(0, -18, 0, -150);
      rayGradient.addColorStop(0, `rgba(255, 216, 127, ${rayAlpha})`);
      rayGradient.addColorStop(1, "rgba(255, 216, 127, 0)");
      heartCtx.fillStyle = rayGradient;
      heartCtx.beginPath();
      heartCtx.moveTo(-8, -18);
      heartCtx.lineTo(0, -150 - warmPower * 26);
      heartCtx.lineTo(8, -18);
      heartCtx.closePath();
      heartCtx.fill();
      heartCtx.rotate(-angle);
    }
  }
  heartCtx.restore();

  drawGlow(cx, cy, 154, [
    [0, `rgba(255, 204, 98, ${0.08 + warmPower * 0.22 + pulseBoost * 0.12})`],
    [0.42, `rgba(245, 154, 78, ${0.05 + warmPower * 0.13})`],
    [1, "rgba(243, 195, 103, 0)"],
  ]);
  drawGlow(cx, cy, 138, [
    [0, `rgba(99, 132, 144, ${coldPower * 0.22})`],
    [0.56, `rgba(99, 132, 144, ${coldPower * 0.18})`],
    [1, "rgba(99, 132, 144, 0)"],
  ]);

  heartCtx.save();
  heartCtx.translate(cx, cy);
  lightParticles.forEach((particle, index) => {
    const orbit = particle.angle + time * particle.speed;
    const wave = Math.sin(time * 0.0015 + particle.drift) * 8;
    const x = Math.cos(orbit) * (particle.radius + wave);
    const y = Math.sin(orbit) * (particle.radius * 0.72 + wave * 0.45);
    const isWarm = index % 3 !== 0 || result.kind !== "guo";
    const alphaBase = isWarm ? warmPower : coldPower + 0.16;
    heartCtx.fillStyle = isWarm
      ? `rgba(255, 220, 134, ${0.16 + alphaBase * 0.36})`
      : `rgba(158, 201, 210, ${0.14 + alphaBase * 0.32})`;
    heartCtx.beginPath();
    heartCtx.arc(x, y, particle.size + pulseBoost * 2.2, 0, Math.PI * 2);
    heartCtx.fill();
  });
  heartCtx.restore();

  for (let index = burstParticles.length - 1; index >= 0; index -= 1) {
    const particle = burstParticles[index];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.kind === "gong" ? 0.018 : 0.036;
    particle.vx *= 0.986;
    particle.vy *= 0.986;
    particle.life -= 0.018;
    particle.spin += 0.08;

    if (particle.life <= 0) {
      burstParticles.splice(index, 1);
      continue;
    }

    heartCtx.save();
    heartCtx.translate(particle.x, particle.y);
    heartCtx.rotate(particle.spin);
    heartCtx.globalAlpha = particle.life;
    heartCtx.fillStyle = particle.kind === "gong"
      ? "rgba(255, 220, 129, 0.92)"
      : "rgba(158, 205, 216, 0.72)";
    heartCtx.beginPath();
    heartCtx.ellipse(0, 0, particle.size * 0.72, particle.size, 0, 0, Math.PI * 2);
    heartCtx.fill();
    heartCtx.restore();
  }

  const flameScale = Math.max(0.35, 0.72 + balance * 0.42 + pulseBoost * 0.42);
  const flameHeight = 58 * flameScale;
  const flameWidth = 30 * flameScale;
  const flameBaseY = cy + 22 + dimPower * 10;
  const flameTipY = flameBaseY - flameHeight;
  const flameGradient = heartCtx.createRadialGradient(cx, flameBaseY - flameHeight * 0.58, 2, cx, flameBaseY - flameHeight * 0.45, flameHeight);
  flameGradient.addColorStop(0, "rgba(255, 249, 185, 0.98)");
  flameGradient.addColorStop(0.34, `rgba(245, 184, 77, ${0.82 + warmPower * 0.18})`);
  flameGradient.addColorStop(1, "rgba(181, 79, 50, 0)");

  heartCtx.fillStyle = flameGradient;
  heartCtx.globalAlpha = 1 - dimPower * 0.45;
  heartCtx.beginPath();
  heartCtx.moveTo(cx, flameTipY);
  heartCtx.bezierCurveTo(cx + flameWidth, flameBaseY - flameHeight * 0.44, cx + flameWidth * 0.55, flameBaseY - 4, cx, flameBaseY);
  heartCtx.bezierCurveTo(cx - flameWidth * 0.62, flameBaseY - 10, cx - flameWidth, flameBaseY - flameHeight * 0.38, cx, flameTipY);
  heartCtx.fill();
  if (flameScale > 0.92) {
    heartCtx.globalAlpha = Math.min(0.88, (flameScale - 0.8) * 1.4);
    heartCtx.fillStyle = "rgba(255, 249, 188, 0.78)";
    heartCtx.beginPath();
    heartCtx.ellipse(cx - flameWidth * 0.12, flameBaseY - flameHeight * 0.52, flameWidth * 0.2, flameHeight * 0.22, -0.3, 0, Math.PI * 2);
    heartCtx.fill();
  }
  heartCtx.globalAlpha = 1;

  if (dimPower > 0) {
    drawGlow(cx, cy, 172, [
      [0, `rgba(10, 18, 22, ${dimPower * 0.1})`],
      [0.55, `rgba(10, 18, 22, ${dimPower * 0.22})`],
      [1, `rgba(10, 18, 22, ${dimPower * 0.32})`],
    ]);
    const shade = heartCtx.createRadialGradient(cx, cy, 34, cx, cy, 174);
    shade.addColorStop(0, "rgba(4, 10, 12, 0)");
    shade.addColorStop(0.58, `rgba(4, 10, 12, ${dimPower * 0.22})`);
    shade.addColorStop(1, `rgba(4, 10, 12, ${dimPower * 0.46})`);
    heartCtx.fillStyle = shade;
    heartCtx.fillRect(0, 0, width, height);
  }

  const bowlGradient = heartCtx.createLinearGradient(cx - 58, cy + 25, cx + 58, cy + 78);
  bowlGradient.addColorStop(0, "#dfb777");
  bowlGradient.addColorStop(0.52, "#9a6740");
  bowlGradient.addColorStop(1, "#573520");
  heartCtx.fillStyle = bowlGradient;
  fillRoundRect(heartCtx, cx - 58, cy + 28, 116, 42, 16);
  heartCtx.fillStyle = "rgba(255, 233, 178, 0.28)";
  heartCtx.fillRect(cx - 42, cy + 34, 84, 3);

  if (pulse.value > 0) {
    const pulseColor = pulse.kind === "guo" ? "rgba(137, 190, 205," : "rgba(255, 210, 112,";
    heartCtx.strokeStyle = `${pulseColor} ${pulse.value * 0.6})`;
    heartCtx.lineWidth = 3;
    heartCtx.beginPath();
    heartCtx.arc(cx, cy, 48 + (1 - pulse.value) * 84, 0, Math.PI * 2);
    heartCtx.stroke();
    pulse.value = Math.max(0, pulse.value - 0.025);
  }

  requestAnimationFrame(drawHeartScene);
}

function addGong() {
  if (state.guo > 0) {
    state.guo -= 1;
    state.note = pickCopy("neutral");
    render();
  } else {
    state.gong += 1;
    state.note = pickCopy("gong");
    render({ dropType: "gong", dropTargetId: "gongPit" });
  }
}

function addGuo() {
  if (state.gong > 0) {
    state.gong -= 1;
    state.note = pickCopy("neutral");
    render();
  } else {
    state.guo += 1;
    state.note = pickCopy("guo");
    render({ dropType: "guo", dropTargetId: "guoPit" });
  }
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog.open) {
    dialog.close();
  }
}

function openToken(type) {
  state.pendingType = type;
  recordToken.classList.toggle("token-guo", type === "guo");
  recordToken.classList.remove("is-sealing");
  tokenKicker.textContent = type === "gong" ? "此行记一功" : "此行记一过";
  recordText.placeholder = getTokenHint(type);
  submitToken.textContent = type === "gong" ? "记下此功" : "记下此过";
  recordText.value = "";
  tokenLayer.classList.add("is-open");
  setTimeout(() => recordText.focus(), 120);
}

function closeToken() {
  tokenLayer.classList.remove("is-open");
  state.pendingType = null;
}

function applyPendingRecord() {
  const type = state.pendingType;
  if (!type) {
    return;
  }

  const userText = recordText.value.trim();
  const targetId = type === "gong" ? "gongPit" : "guoPit";
  const updater = type === "gong" ? addGong : addGuo;
  recordToken.classList.add("is-sealing");

  setTimeout(() => {
    tokenLayer.classList.remove("is-open");
    flySparkTo(targetId, type, () => {
      updater();
      rememberAction(type);
      triggerHeartPulse(type);
      if (userText) {
        state.note = userText;
        render();
      }
      state.pendingType = null;
      recordToken.classList.remove("is-sealing");
    });
  }, 210);
}

function flySparkTo(targetId, type, afterFlight) {
  const tokenRect = recordToken.getBoundingClientRect();
  const targetRect = document.getElementById(targetId).getBoundingClientRect();
  const startX = tokenRect.left + tokenRect.width / 2;
  const startY = tokenRect.top + tokenRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  flyingSpark.className = `flying-spark spark-${type}`;
  flyingSpark.style.opacity = "1";
  flyingSpark.style.transform = `translate(${startX}px, ${startY}px) scale(1)`;

  requestAnimationFrame(() => {
    flyingSpark.animate(
      [
        { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 1 },
        { transform: `translate(${(startX + endX) / 2}px, ${Math.min(startY, endY) - 86}px) scale(0.72)`, opacity: 0.9 },
        { transform: `translate(${endX}px, ${endY}px) scale(0.25)`, opacity: 0 },
      ],
      {
        duration: 520,
        easing: "cubic-bezier(.2,.78,.26,1)",
      },
    ).onfinish = () => {
      flyingSpark.style.opacity = "0";
      flyingSpark.style.transform = "translate(-999px, -999px)";
      afterFlight();
    };
  });
}

document.getElementById("addGong").addEventListener("click", () => openToken("gong"));
document.getElementById("addGuo").addEventListener("click", () => openToken("guo"));
document.getElementById("cancelToken").addEventListener("click", closeToken);
submitToken.addEventListener("click", applyPendingRecord);
tokenLayer.addEventListener("click", (event) => {
  if (event.target === tokenLayer) {
    closeToken();
  }
});

document.getElementById("openSummary").addEventListener("click", () => {
  syncSummary();
  summarySheet.showModal();
});

document.getElementById("openShare").addEventListener("click", () => {
  syncShareCard();
  shareSheet.showModal();
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(button.dataset.close));
});

renderHistory();
render();
drawHeartScene();
