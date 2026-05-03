const state = {
  gong: [],
  guo: [],
  pendingType: null,
  sealed: false,
  archive: window.GONGGUO_COPY.archive,
};

const copy = window.GONGGUO_COPY;
const tokenCopy = copy.token;
const judgementCopies = copy.judgement;

const tokenLayer = document.getElementById("tokenLayer");
const paperToken = document.getElementById("paperToken");
const tokenTitle = document.getElementById("tokenTitle");
const tokenText = document.getElementById("tokenText");
const submitToken = document.getElementById("submitToken");
const flyingToken = document.getElementById("flyingToken");
const statusText = document.getElementById("statusText");
const judgementTitle = document.getElementById("judgementTitle");
const judgementCopy = document.getElementById("judgementCopy");
const cardDialog = document.getElementById("cardDialog");
const archiveDialog = document.getElementById("archiveDialog");
const detailDialog = document.getElementById("detailDialog");

function pick(list, seed = 0) {
  return list[Math.abs(seed) % list.length];
}

function openToken(type) {
  if (state.sealed) {
    statusText.textContent = copy.ui.sealedLocked;
    return;
  }
  state.pendingType = type;
  const copy = tokenCopy[type];
  paperToken.classList.remove("is-sending", "token-gong", "token-guo");
  paperToken.classList.add(`token-${type}`);
  tokenTitle.textContent = copy.title;
  tokenText.placeholder = pick(copy.placeholders, Date.now());
  submitToken.textContent = copy.submit;
  tokenText.value = "";
  tokenLayer.classList.add("is-open");
  setTimeout(() => tokenText.focus(), 120);
}

function closeToken() {
  tokenLayer.classList.remove("is-open");
  state.pendingType = null;
}

function makeStoredSlip(type, text, index) {
  const slip = document.createElement("span");
  slip.className = "stored-slip";
  const row = Math.floor(index / 4);
  const col = index % 4;
  const x = (col - 1.5) * 34 + Math.random() * 10 - 5;
  const y = row * 21 + Math.random() * 10 - 5;
  const rotate = Math.random() * 18 - 9;
  slip.style.setProperty("--slip-x", `${x.toFixed(1)}px`);
  slip.style.setProperty("--slip-y", `${y.toFixed(1)}px`);
  slip.style.setProperty("--slip-rotate", `${rotate.toFixed(1)}deg`);
  slip.textContent = text || tokenCopy[type].emptySlip;
  return slip;
}

function render() {
  const gongStack = document.getElementById("gongStack");
  const guoStack = document.getElementById("guoStack");
  gongStack.replaceChildren();
  guoStack.replaceChildren();

  state.gong.forEach((entry, index) => {
    gongStack.append(makeStoredSlip("gong", entry.text, index));
  });
  state.guo.forEach((entry, index) => {
    guoStack.append(makeStoredSlip("guo", entry.text, index));
  });

  document.getElementById("gongCount").textContent = String(state.gong.length);
  document.getElementById("guoCount").textContent = String(state.guo.length);
  document.getElementById("gongBox").classList.toggle("is-sealed", state.sealed);
  document.getElementById("guoBox").classList.toggle("is-sealed", state.sealed);
  document.getElementById("openGong").disabled = state.sealed;
  document.getElementById("openGuo").disabled = state.sealed;
  renderJudgement();
  syncTodayCard();
  renderArchive();
}

function todayArchiveEntry() {
  return {
    date: "今日封存",
    gong: state.gong.map((entry) => entry.text || tokenCopy.gong.emptySlip),
    guo: state.guo.map((entry) => entry.text || tokenCopy.guo.emptySlip),
  };
}

function getJudgement(gongCount = state.gong.length, guoCount = state.guo.length, seed = gongCount * 7 + guoCount * 11) {
  const diff = gongCount - guoCount;
  if (gongCount === 0 && guoCount === 0) {
    return pick(judgementCopies.empty, seed);
  }
  if (diff >= 3) {
    return pick(judgementCopies.strongGong, seed);
  }
  if (diff > 0) {
    return pick(judgementCopies.lightGong, seed);
  }
  if (diff === 0) {
    return pick(judgementCopies.balanced, seed);
  }
  if (diff <= -3) {
    return pick(judgementCopies.strongGuo, seed);
  }
  return pick(judgementCopies.lightGuo, seed);
}

function renderJudgement() {
  const judgement = getJudgement();
  judgementTitle.textContent = judgement.title;
  judgementCopy.textContent = judgement.copy;
}

function syncTodayCard() {
  const judgement = getJudgement();
  document.getElementById("cardTitle").textContent = judgement.title;
  document.getElementById("cardCopy").textContent = judgement.copy;
  document.getElementById("cardGong").textContent = String(state.gong.length);
  document.getElementById("cardGuo").textContent = String(state.guo.length);
}

function getArchiveSummary(day) {
  return getJudgement(day.gong.length, day.guo.length, day.date.length + day.gong.length * 13 + day.guo.length * 17);
}

function renderArchive() {
  const archiveList = document.getElementById("archiveList");
  archiveList.replaceChildren();
  state.archive.forEach((day, index) => {
    const summary = getArchiveSummary(day);
    const button = document.createElement("button");
    button.className = "archive-item";
    button.innerHTML = `
      <strong>${day.date} · ${summary.title}</strong>
      <span>${day.gong.length} 功符 · ${day.guo.length} 过符</span>
      <span>${summary.copy}</span>
    `;
    button.addEventListener("click", () => openArchiveDetail(index));
    archiveList.append(button);
  });
}

function openArchiveDetail(index) {
  const day = state.archive[index];
  const summary = getArchiveSummary(day);
  document.getElementById("detailDate").textContent = day.date;
  document.getElementById("detailTitle").textContent = summary.title;
  renderDetailList("detailGong", day.gong);
  renderDetailList("detailGuo", day.guo);
  if (archiveDialog.open) {
    archiveDialog.close();
  }
  detailDialog.showModal();
}

function renderDetailList(targetId, entries) {
  const target = document.getElementById(targetId);
  target.replaceChildren();
  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = copy.ui.emptyDetail;
    target.append(empty);
    return;
  }
  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    target.append(item);
  });
}

function flashBox(type) {
  const box = document.getElementById(type === "gong" ? "gongBox" : "guoBox");
  box.classList.remove("is-receiving");
  requestAnimationFrame(() => {
    box.classList.add("is-receiving");
    setTimeout(() => box.classList.remove("is-receiving"), 660);
  });
}

function flyTokenToBox(type, text, sourceRect, afterFlight) {
  const targetRect = document.getElementById(type === "gong" ? "gongStack" : "guoStack").getBoundingClientRect();
  const startX = sourceRect.left + sourceRect.width / 2 - 54;
  const startY = sourceRect.top + sourceRect.height / 2 - 34;
  const endX = targetRect.left + targetRect.width / 2 - 54;
  const endY = targetRect.top + targetRect.height / 2 - 34;

  flyingToken.textContent = text || tokenCopy[type].emptySlip;
  flyingToken.style.opacity = "1";
  flyingToken.style.transform = `translate(${startX}px, ${startY}px) rotate(-4deg) scale(1)`;

  requestAnimationFrame(() => {
    flyingToken.animate(
      [
        { transform: `translate(${startX}px, ${startY}px) rotate(-6deg) scale(1.04)`, opacity: 1 },
        { transform: `translate(${(startX + endX) / 2}px, ${Math.min(startY, endY) - 120}px) rotate(16deg) scale(0.88)`, opacity: 0.96 },
        { transform: `translate(${endX}px, ${endY}px) rotate(-10deg) scale(0.34)`, opacity: 0 },
      ],
      {
        duration: 920,
        easing: "cubic-bezier(.2,.76,.22,1)",
      },
    ).onfinish = () => {
      flyingToken.style.opacity = "0";
      flyingToken.style.transform = "translate(-999px, -999px)";
      afterFlight();
    };
  });
}

function submitRecord() {
  const type = state.pendingType;
  if (!type) {
    return;
  }

  const text = tokenText.value.trim();
  const sourceRect = paperToken.getBoundingClientRect();
  paperToken.classList.add("is-sending");
  setTimeout(() => {
    tokenLayer.classList.remove("is-open");
    flyTokenToBox(type, text, sourceRect, () => {
      state[type].push({ text, at: Date.now() });
      statusText.textContent = pick(tokenCopy[type].statuses, state[type].length + Date.now());
      flashBox(type);
      render();
      state.pendingType = null;
      paperToken.classList.remove("is-sending");
    });
  }, 220);
}

function sealToday() {
  if (state.sealed) {
    cardDialog.showModal();
    return;
  }

  state.sealed = true;
  statusText.textContent = copy.ui.sealedStatus;
  state.archive = [todayArchiveEntry(), ...state.archive];
  render();
  syncTodayCard();
  setTimeout(() => {
    cardDialog.showModal();
  }, 560);
}

document.getElementById("openGong").addEventListener("click", () => openToken("gong"));
document.getElementById("openGuo").addEventListener("click", () => openToken("guo"));
document.getElementById("cancelToken").addEventListener("click", closeToken);
document.getElementById("openCard").addEventListener("click", () => {
  syncTodayCard();
  cardDialog.showModal();
});
document.getElementById("sealToday").addEventListener("click", sealToday);
document.getElementById("openArchive").addEventListener("click", () => {
  renderArchive();
  archiveDialog.showModal();
});
document.getElementById("shareCard").addEventListener("click", () => {
  statusText.textContent = copy.ui.shareReady;
  cardDialog.close();
});
submitToken.addEventListener("click", submitRecord);
tokenLayer.addEventListener("click", (event) => {
  if (event.target === tokenLayer) {
    closeToken();
  }
});
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.close).close();
  });
});

render();
