// EDIT ME: change the questions/answers so they're true about you!
// Mark exactly one answer per question with correct: true.

const questions = [
  {
    q: "What's my go-to comfort meal?",
    answers: [
      { text: "Tacos. Every day is Taco Tuesday.", correct: true },
      { text: "Pizza", correct: false },
      { text: "Cereal for dinner", correct: false },
      { text: "Gas station sushi", correct: false }
    ]
  },
  {
    q: "What's my drink order?",
    answers: [
      { text: "Pumpkin Spice Latte", correct: true },
      { text: "Iced vanilla latte", correct: false },
      { text: "Caramel macchiato", correct: false },
      { text: "Chai latte", correct: false }
    ]
  },
  {
    q: "What am I most likely doing on a free weekend?",
    answers: [
      { text: "Dancing like nobody is watching", correct: true },
      { text: "Binge-watching shows", correct: false },
      { text: "Going to the gym", correct: false },
      { text: "Playing video games", correct: false }
    ]
  },
  {
    q: "What's my favorite season?",
    answers: [
      { text: "Spring", correct: true },
      { text: "Fall, obviously. Pumpkin spice, right?", correct: false },
      { text: "Winter. I live in a blanket.", correct: false },
      { text: "Summer. Sweat is a lifestyle.", correct: false }
    ]
  },
  {
    q: "Which of these have I actually done?",
    note: "Plot twist: I'm terrified of the ocean. 🌊",
    answers: [
      { text: "Scuba diving", correct: true },
      { text: "Won a hot dog eating contest", correct: false },
      { text: "Wrestled an alligator", correct: false },
      { text: "Performed stand-up on a cruise ship", correct: false }
    ]
  },
  {
    q: "What's my guilty-pleasure watch?",
    answers: [
      { text: "Reality TV, no shame", correct: true },
      { text: "True crime documentaries", correct: false },
      { text: "Superhero movies", correct: false },
      { text: "Cooking competition shows", correct: false }
    ]
  }
];

// Ranks by number of correct answers (checked top to bottom).
const ranks = [
  { min: 6, emoji: "🏆", title: "Certified Bestie", desc: "You know me better than I know me. Please never leave." },
  { min: 4, emoji: "😎", title: "Solid Classmate", desc: "Not bad at all! You've clearly been paying attention." },
  { min: 2, emoji: "🤔", title: "Casual Acquaintance", desc: "You got a couple! Come say hi at break and fix that." },
  { min: 0, emoji: "🕵️", title: "Total Stranger", desc: "Zero or one?! We have basically never met. Let's grab a pumpkin spice latte." }
];

// ---- Single Page App: hash router + view functions ----
// Routes:  #/            intro
//          #/question/N  question N (1-based)
//          #/result      final score

const app = document.getElementById("app");
const ADVANCE_MS = 900;

let picks = []; // picks[i] = index of the answer chosen for question i
let timer = null;

const score = () => picks.filter((p, i) => questions[i].answers[p].correct).length;

function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

function render() {
  clearTimeout(timer);
  const [, route = "", arg] = location.hash.slice(1).split("/");

  if (route === "question") {
    const n = parseInt(arg, 10);
    if (!(n >= 1 && n <= questions.length)) return go("#/");
    // Can't skip ahead: send them to the first unanswered question.
    if (n - 1 > picks.length) return go(`#/question/${picks.length + 1}`);
    return showQuestion(n - 1);
  }
  if (route === "result") {
    if (picks.length < questions.length) return go(`#/question/${Math.min(picks.length + 1, questions.length)}`);
    return showResult();
  }
  if (route === "") return showIntro();
  go("#/"); // unknown route
}

function mount(title, html) {
  document.title = title;
  app.innerHTML = `<section class="screen active">${html}</section>`;
  window.scrollTo(0, 0);
}

function showIntro() {
  mount("How Well Do You Know Me?", `
    <div class="emoji-big">🕵️</div>
    <h1>How Well Do You Know Me?</h1>
    <p class="sub">${questions.length} questions about your instructor. Be honest, no cheating (we'll know).</p>
    <button id="start" class="btn">Let's find out!</button>`);
  document.getElementById("start").addEventListener("click", () => {
    picks = [];
    go("#/question/1");
  });
}

function showQuestion(i) {
  const item = questions[i];
  const answered = picks[i] !== undefined;
  mount(`Question ${i + 1} - Quiz`, `
    <div class="progress"><div id="bar" style="width:${(i / questions.length) * 100}%"></div></div>
    <p class="count">Question ${i + 1} of ${questions.length}</p>
    <h2></h2>
    <div id="answers" class="answers"></div>`);
  app.querySelector("h2").textContent = item.q;

  const box = document.getElementById("answers");
  item.answers.forEach((a, idx) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = a.text;
    btn.addEventListener("click", () => choose(i, idx));
    box.appendChild(btn);
  });

  if (answered) reveal(i); // came back via the Back button
}

function reveal(i) {
  const buttons = [...document.getElementById("answers").children];
  questions[i].answers.forEach((a, idx) => {
    if (a.correct) buttons[idx].classList.add("right");
  });
  const picked = picks[i];
  if (!questions[i].answers[picked].correct) buttons[picked].classList.add("wrong");
  buttons.forEach((b) => (b.disabled = true));
  if (questions[i].note) {
    const p = document.createElement("p");
    p.className = "note";
    p.textContent = questions[i].note;
    document.getElementById("answers").after(p);
  }
}

function choose(i, idx) {
  if (picks[i] !== undefined) return;
  picks[i] = idx;
  reveal(i);
  timer = setTimeout(() => {
    go(i + 1 < questions.length ? `#/question/${i + 2}` : "#/result");
  }, ADVANCE_MS);
}

function showResult() {
  const total = score();
  const r = ranks.find((x) => total >= x.min);
  mount(`${r.title} - Quiz`, `
    <p class="count">Your score</p>
    <p class="score">${total} / ${questions.length}</p>
    <div class="emoji-big">${r.emoji}</div>
    <h1>${r.title}</h1>
    <p class="sub">${r.desc}</p>
    <button id="restart" class="btn">Take it again</button>`);
  document.getElementById("restart").addEventListener("click", () => {
    picks = [];
    go("#/");
  });
}

window.addEventListener("hashchange", render);
render();
