// EDIT ME: change the questions/answers so they're true about you!
// Mark exactly one answer per question with correct: true.

const questions = [
  {
    q: "What's my go-to comfort meal?",
    answers: [
      { text: "Tacos. Every day is Taco Tuesday.", correct: true },
      { text: "A single sad salad", correct: false },
      { text: "Cereal. For dinner. Every night.", correct: false },
      { text: "Whatever's in a gas station", correct: false }
    ]
  },
  {
    q: "What's my drink order?",
    answers: [
      { text: "Pumpkin Spice Latte", correct: true },
      { text: "Hot water with a lemon. Just vibes.", correct: false },
      { text: "Chocolate milk, I'm 8 at heart", correct: false },
      { text: "Whatever's the weirdest thing on the menu", correct: false }
    ]
  },
  {
    q: "What am I most likely doing on a free weekend?",
    answers: [
      { text: "Dancing like nobody is watching", correct: true },
      { text: "Hiking up a mountain at sunrise", correct: false },
      { text: "Competitive knitting", correct: false },
      { text: "Reorganizing my sock drawer by color", correct: false }
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
    answers: [
      { text: "Scuba diving (yes, I'm also afraid of the ocean)", correct: true },
      { text: "Skydiving out of a plane", correct: false },
      { text: "Wrestled an alligator", correct: false },
      { text: "Run a marathon in flip-flops", correct: false }
    ]
  },
  {
    q: "What's my guilty-pleasure watch?",
    answers: [
      { text: "Reality TV, no shame", correct: true },
      { text: "Documentaries about moss", correct: false },
      { text: "Watching paint dry in 4K", correct: false },
      { text: "Silent black-and-white films", correct: false }
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

const $ = (id) => document.getElementById(id);
const screens = ["intro", "quiz", "result"];
let current = 0;
let score = 0;
let locked = false;

function show(name) {
  screens.forEach((s) => $(s).classList.toggle("active", s === name));
}

function start() {
  current = 0;
  score = 0;
  show("quiz");
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  const item = questions[current];
  $("count").textContent = `Question ${current + 1} of ${questions.length}`;
  $("bar").style.width = `${(current / questions.length) * 100}%`;
  $("question").textContent = item.q;
  $("answers").innerHTML = "";
  item.answers.forEach((a) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = a.text;
    btn.addEventListener("click", () => choose(a, btn));
    $("answers").appendChild(btn);
  });
}

function choose(answer, btn) {
  if (locked) return;
  locked = true;
  if (answer.correct) score++;

  // Flash the result: the picked button goes green/red, and the right one is revealed.
  const buttons = [...$("answers").children];
  questions[current].answers.forEach((a, i) => {
    if (a.correct) buttons[i].classList.add("right");
  });
  if (!answer.correct) btn.classList.add("wrong");

  setTimeout(() => {
    current++;
    if (current < questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 900);
}

function showResult() {
  $("bar").style.width = "100%";
  const r = ranks.find((x) => score >= x.min);
  $("r-score").textContent = `${score} / ${questions.length}`;
  $("r-emoji").textContent = r.emoji;
  $("r-title").textContent = r.title;
  $("r-desc").textContent = r.desc;
  show("result");
}

$("start").addEventListener("click", start);
$("restart").addEventListener("click", () => show("intro"));
