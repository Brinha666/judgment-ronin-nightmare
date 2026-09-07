(() => {
  "use strict";

  // Evita inicialização duplicada.
  if (window.__JR_EASTER_SCRIPT_LOADED__) return;
  window.__JR_EASTER_SCRIPT_LOADED__ = true;

  /* =====================================================
     CONFIGURAÇÃO
  ===================================================== */

  const page =
    window.location.pathname
      .split("/")
      .pop()
    ||
    "index.html";

  const STORY_PAGES = [
    "historia.html",
    "capitulo1.html",
    "capitulo2.html",
    "capitulo3.html",
    "capitulo4.html",
    "capitulo5.html",
    "capitulo6.html",
    "capitulo7.html",
    "capitulo8.html"
  ];

  const isHome =
    page === "index.html";

  const isStory =
    STORY_PAGES.includes(page);

  const isExtras =
    page === "extras.html";

  const isMusic =
    page === "musicas.html";

  const isRoom666 =
    page === "room.html";

  const finePointer =
    window
      .matchMedia(
        "(pointer: fine)"
      )
      .matches;

  const reducedMotion =
    window
      .matchMedia(
        "(prefers-reduced-motion: reduce)"
      )
      .matches;

  const TEMPO_CURTO = 2500;
  const TEMPO_NORMAL = 4500;
  const TEMPO_LONGO = 6000;

  /* =====================================================
     STORAGE + SEGREDOS
  ===================================================== */

  function safeSet(key, value) {
    try {
      localStorage.setItem(
        key,
        value
      );
    } catch {
      // O site continua funcionando
      // mesmo se o storage estiver bloqueado.
    }
  }

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function unlockSecret(id) {
    safeSet(
      `jr_secret_${id}`,
      "true"
    );

    updateSecretCounter();
  }

  function countSecrets() {
    try {
      let total = 0;

      for (
        let i = 0;
        i < localStorage.length;
        i++
      ) {
        const key =
          localStorage.key(i);

        if (
          key
          &&
          key.startsWith(
            "jr_secret_"
          )
          &&
          localStorage.getItem(key)
          ===
          "true"
        ) {
          total++;
        }
      }

      return total;
    } catch {
      return 0;
    }
  }

  function updateSecretCounter() {
    const counter =
      document.querySelector(
        ".jr-secret-counter"
      );

    if (counter) {
      counter.textContent =
        `SEGREDOS ENCONTRADOS: ${countSecrets()} / ??`;
    }
  }

  /* =====================================================
     TOAST
  ===================================================== */

  const toast =
    document.createElement(
      "div"
    );

  toast.className =
    "jr-toast";

  toast.setAttribute(
    "role",
    "status"
  );

  toast.setAttribute(
    "aria-live",
    "polite"
  );

  document.body.appendChild(
    toast
  );

  let toastTimer = null;

  function showToast(
    text,
    duration = TEMPO_NORMAL
  ) {
    if (toastTimer) {
      clearTimeout(
        toastTimer
      );
    }

    toast.textContent =
      text;

    toast.classList.add(
      "visible"
    );

    toastTimer =
      setTimeout(
        () => {
          toast.classList.remove(
            "visible"
          );
        },
        duration
      );
  }

  /* =====================================================
     CORES DA BARRA
  ===================================================== */

  function mixColor(
    a,
    b,
    amount
  ) {
    return a.map(
      (
        value,
        index
      ) =>
        Math.round(
          value
          +
          (
            b[index]
            -
            value
          )
          *
          amount
        )
    );
  }

  function progressColor(
    progress
  ) {
    const blue = [
      131,
      223,
      255
    ];

    const white = [
      235,
      249,
      255
    ];

    const red = [
      182,
      38,
      49
    ];

    if (
      progress <= 0.5
    ) {
      return mixColor(
        blue,
        white,
        progress * 2
      );
    }

    return mixColor(
      white,
      red,
      (
        progress - 0.5
      )
      *
      2
    );
  }

  /* =====================================================
     PROGRESSO DE LEITURA
  ===================================================== */

  if (isStory) {
    const progress =
      document.createElement(
        "div"
      );

    progress.className =
      "jr-read-progress";

    progress.setAttribute(
      "aria-hidden",
      "true"
    );

    progress.innerHTML = `
      <div class="jr-read-progress-bar"></div>
      <div class="jr-progress-dot"></div>
    `;

    document.body.appendChild(
      progress
    );

    const bar =
      progress.querySelector(
        ".jr-read-progress-bar"
      );

    const dot =
      progress.querySelector(
        ".jr-progress-dot"
      );

    let queued = false;

    function updateProgress() {
      const maxScroll =
        Math.max(
          document
            .documentElement
            .scrollHeight
          -
          window.innerHeight,
          1
        );

      const amount =
        Math.max(
          0,
          Math.min(
            1,
            window.scrollY
            /
            maxScroll
          )
        );

      bar.style.transform =
        `scaleX(${amount})`;

      dot.style.left =
        `${amount * 100}%`;

      const [
        r,
        g,
        b
      ] =
        progressColor(
          amount
        );

      dot.style.setProperty(
        "--jr-progress-color",
        `rgb(${r}, ${g}, ${b})`
      );

      queued = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!queued) {
          queued = true;

          requestAnimationFrame(
            updateProgress
          );
        }
      },
      {
        passive: true
      }
    );

    window.addEventListener(
      "resize",
      updateProgress
    );

    updateProgress();
  }

  /* =====================================================
     TIMELINE 666
  ===================================================== */

  let timelineElement = null;

  function refreshTimeline() {
    if (!timelineElement) return;

    timelineElement.textContent =
      safeGet(
        "jr_story_complete"
      )
      ===
      "true"
      ?
      "TIMELINE 666: FINAL"
      :
      "TIMELINE: 666";
  }

  if (isStory) {
    timelineElement =
      document.createElement(
        "div"
      );

    timelineElement.className =
      "jr-timeline";

    document.body.appendChild(
      timelineElement
    );

    refreshTimeline();
  }

  /* =====================================================
     MARCAR CAPÍTULOS COMO LIDOS
  ===================================================== */

  const readKeys = {
    "historia.html":
      "jr_read_prologue",

    "capitulo1.html":
      "jr_read_cap1",

    "capitulo2.html":
      "jr_read_cap2",

    "capitulo3.html":
      "jr_read_cap3",

    "capitulo4.html":
      "jr_read_cap4",

    "capitulo5.html":
      "jr_read_cap5",

    "capitulo6.html":
      "jr_read_cap6",

    "capitulo7.html":
      "jr_read_cap7",

    "capitulo8.html":
      "jr_read_cap8"
  };

  function markStoryPageRead() {
    const key =
      readKeys[page];

    if (!key) return;

    safeSet(
      key,
      "true"
    );

    safeSet(
      "jr_last_read",
      page
    );

    if (
      page ===
      "capitulo8.html"
    ) {
      safeSet(
        "jr_story_complete",
        "true"
      );

      unlockSecret(
        "story_complete"
      );

      refreshTimeline();
    }
  }

  if (
    isStory
    &&
    readKeys[page]
  ) {
    const ending =
      document.querySelector(
        ".fim-leitura"
      );

    if (
      ending
      &&
      "IntersectionObserver"
      in window
    ) {
      const observer =
        new IntersectionObserver(
          entries => {
            entries.forEach(
              entry => {
                if (
                  !entry.isIntersecting
                ) {
                  return;
                }

                markStoryPageRead();

                observer.disconnect();
              }
            );
          },
          {
            threshold: 0.25
          }
        );

      observer.observe(
        ending
      );
    }
  }

  /* =====================================================
     VOLTAR PARA HOME
  ===================================================== */

  if (isHome) {
    const lastRead =
      safeGet(
        "jr_last_read"
      );

    const shown =
      sessionStorage.getItem(
        "jr_return_message"
      );

    if (
      lastRead
      &&
      !shown
    ) {
      setTimeout(
        () => {
          const messages = {
            "capitulo2.html":
              "Voltou? Interessante.",

            "capitulo7.html":
              "sobreviveu ao julgamento, huh?",

            "capitulo8.html":
              "a barreira caiu. você ainda voltou."
          };

          showToast(
            messages[lastRead]
            ||
            "ainda aqui? heh.",
            TEMPO_NORMAL
          );

          sessionStorage.setItem(
            "jr_return_message",
            "true"
          );
        },
        TEMPO_CURTO
      );
    }
  }

  /* =====================================================
     MÚSICAS RECOMENDADAS
  ===================================================== */

  const chapterTracks = {
    "historia.html": {
      name:
        "The Duo",

      src:
        "Assets/The_duo.wav"
    },

    "capitulo1.html": {
      name:
        "Double Danger",

      src:
        "Assets/Double_Danger.wav"
    },

    "capitulo2.html": {
      name:
        "Vazio",

      src:
        "Assets/Vazio.mp3"
    },

    "capitulo7.html": {
      name:
        "Blade Judgement",

      src:
        "Assets/決定%20-%20BLADE%20JUDGEMENT.mp3"
    }
  };

  if (
    isStory
    &&
    chapterTracks[page]
  ) {
    const track =
      chapterTracks[page];

    const button =
      document.createElement(
        "button"
      );

    const chapterAudio =
      document.createElement(
        "audio"
      );

    button.type =
      "button";

    button.className =
      "jr-chapter-music";

    button.textContent =
      "♪";

    button.title =
      `Trilha recomendada: ${track.name}`;

    button.setAttribute(
      "aria-label",
      `Tocar trilha recomendada: ${track.name}`
    );

    button.setAttribute(
      "aria-pressed",
      "false"
    );

    chapterAudio.preload =
      "none";

    chapterAudio.src =
      track.src;

    chapterAudio.volume =
      0.38;

    document.body.appendChild(
      chapterAudio
    );

    document.body.appendChild(
      button
    );

    function updateChapterButton() {
      const playing =
        !chapterAudio.paused;

      button.classList.toggle(
        "playing",
        playing
      );

      button.textContent =
        playing
        ?
        "❚❚"
        :
        "♪";

      button.setAttribute(
        "aria-pressed",
        String(playing)
      );

      button.setAttribute(
        "aria-label",
        playing
        ?
        `Pausar trilha recomendada: ${track.name}`
        :
        `Tocar trilha recomendada: ${track.name}`
      );
    }

    button.addEventListener(
      "click",
      async () => {
        if (
          chapterAudio.paused
        ) {
          try {
            await chapterAudio.play();

            showToast(
              `♪ ${track.name}`,
              TEMPO_CURTO
            );
          } catch {
            showToast(
              "O navegador bloqueou o áudio.",
              TEMPO_NORMAL
            );
          }
        } else {
          chapterAudio.pause();
        }

        updateChapterButton();
      }
    );

    chapterAudio.addEventListener(
      "play",
      updateChapterButton
    );

    chapterAudio.addEventListener(
      "pause",
      updateChapterButton
    );

    chapterAudio.addEventListener(
      "ended",
      updateChapterButton
    );
  }

  /* =====================================================
     SAVE
  ===================================================== */

  if (isStory) {
    const star =
      document.createElement(
        "button"
      );

    star.type =
      "button";

    star.className =
      "jr-save-star";

    star.textContent =
      "★";

    star.title =
      "SAVE?";

    star.setAttribute(
      "aria-label",
      "SAVE?"
    );

    document.body.appendChild(
      star
    );

    let saveClicks = 0;

    star.addEventListener(
      "click",
      () => {
        saveClicks++;

        if (
          safeGet(
            "jr_story_complete"
          )
          ===
          "true"
        ) {
          showToast(
            "Não há nada para salvar aqui.",
            TEMPO_NORMAL
          );

          return;
        }

        if (
          saveClicks === 6
        ) {
          showToast(
            "Você insiste bastante.",
            TEMPO_LONGO
          );

          unlockSecret(
            "save_6"
          );

          return;
        }

        showToast(
          "Nada aconteceu.",
          TEMPO_CURTO
        );
      }
    );
  }

  /* =====================================================
     ECHO FLOWERS
  ===================================================== */

  if (
    page ===
    "capitulo2.html"
  ) {
    const breaks =
      document.querySelectorAll(
        ".quebra-cena"
      );

    const target =
      breaks[1]
      ||
      breaks[0];

    if (target) {
      const garden =
        document.createElement(
          "aside"
        );

      garden.className =
        "jr-echo-garden";

      garden.innerHTML = `
        <p class="jr-echo-label">
          ECHO FLOWERS
        </p>

        <div class="jr-echo-buttons">

          <button
            class="jr-echo"
            type="button"
            data-secret="echo_papyrus"
            data-echo="pelo menos... eu ainda acredito que você pode ser melhor."
            aria-label="Ouvir Echo Flower"
          >
            ✿
          </button>

          <button
            class="jr-echo"
            type="button"
            data-secret="echo_chara"
            data-echo="Por favor... não me deixa sozinha de novo."
            aria-label="Ouvir Echo Flower"
          >
            ✿
          </button>

          <button
            class="jr-echo"
            type="button"
            data-secret="echo_nightmare"
            data-echo="Eles sentiam medo de mim."
            aria-label="Ouvir Echo Flower"
          >
            ✿
          </button>

        </div>

        <p
          class="jr-echo-text"
          aria-live="polite"
        ></p>
      `;

      target.insertAdjacentElement(
        "afterend",
        garden
      );

      const echoText =
        garden.querySelector(
          ".jr-echo-text"
        );

      let echoTimer = null;

      garden
        .querySelectorAll(
          ".jr-echo"
        )
        .forEach(
          flower => {
            flower.addEventListener(
              "click",
              () => {
                clearTimeout(
                  echoTimer
                );

                echoText.classList.remove(
                  "visible"
                );

                setTimeout(
                  () => {
                    echoText.textContent =
                      `“${flower.dataset.echo}”`;

                    echoText.classList.add(
                      "visible"
                    );

                    unlockSecret(
                      flower.dataset.secret
                    );

                    echoTimer =
                      setTimeout(
                        () => {
                          echoText.classList.remove(
                            "visible"
                          );
                        },
                        6500
                      );
                  },
                  reducedMotion
                  ?
                  0
                  :
                  180
                );
              }
            );
          }
        );
    }
  }

  /* =====================================================
     GASTER
  ===================================================== */

  const gasterMessages = {
    "index.html": {
      symbols:
        "⌁ ⍜ ⟟ // ⊗ ⌇ ⊙",

      translation:
        "A timeline continua sendo observada."
    },

    "historia.html": {
      symbols:
        "◇ ⌁ ⟟ ⌇ // ⍜ ⊗",

      translation:
        "Até a menor mudança produz consequências."
    },

    "capitulo1.html": {
      symbols:
        "⊙ ⌂ ⌁ // ⟟ ◇ ⊗",

      translation:
        "Duas presenças agora caminham juntas."
    },

    "capitulo2.html": {
      symbols:
        "⌂ ⟟ ⊗ // ⌁ ⍜ ◇ ⌇",

      translation:
        "Há algo esperando atrás da porta."
    },

    "capitulo3.html": {
      symbols:
        "⌇ ◇ ⌂ // ⊙ ⟟ ⌁",

      translation:
        "A porta abriu. O passado respondeu."
    },

    "capitulo4.html": {
      symbols:
        "⊗ ⌁ ◇ // ⌇ ⍜ ⟟",

      translation:
        "Uma chama abandonada ainda pode cumprir seu propósito."
    },

    "capitulo5.html": {
      symbols:
        "⟟ ⊙ ⌇ // ◇ ⌁ ⊗",

      translation:
        "A rota já não segue o caminho de antes."
    },

    "capitulo6.html": {
      symbols:
        "⌂ ⌇ ⍜ // ⊗ ◇ ⌁",

      translation:
        "A brecha não permanecerá aberta para sempre."
    },

    "capitulo7.html": {
      symbols:
        "⊙ ⊗ ◇ // ⌁ ⌇ ⟟",

      translation:
        "O julgamento não apaga as consequências."
    },

    "capitulo8.html": {
      symbols:
        "◇ ⍜ ⌇ // ⌂ ⊙ ⟟",

      translation:
        "A barreira caiu. O caminho continua."
    },

    "extras.html": {
      symbols:
        "⍜ ⊙ ⌁ // ◇ ⌇ ⟟",

      translation:
        "Você encontrou aquilo que deveria permanecer oculto."
    },

    "musicas.html": {
      symbols:
        "⌇ ⍜ ◇ // ⊗ ⌁ ⟟",

      translation:
        "Algumas memórias sobrevivem através do som."
    }
  };

  if (
    gasterMessages[page]
  ) {
    const message =
      gasterMessages[page];

    const mark =
      document.createElement(
        "button"
      );

    mark.type =
      "button";

    mark.className =
      "jr-gaster-mark";

    mark.textContent =
      message.symbols;

    mark.title =
      "???";

    mark.setAttribute(
      "aria-label",
      "Mensagem desconhecida"
    );

    const storyArticle =
      document.querySelector(
        ".leitura"
      );

    if (storyArticle) {
      const footer =
        storyArticle.querySelector(
          ".fim-leitura"
        );

      if (footer) {
        storyArticle.insertBefore(
          mark,
          footer
        );
      } else {
        storyArticle.appendChild(
          mark
        );
      }
    } else {
      const target =
        document.querySelector(
          ".conteudo"
        )
        ||
        document.querySelector(
          "main"
        )
        ||
        document.body;

      target.appendChild(
        mark
      );
    }

    mark.addEventListener(
      "click",
      () => {
        showToast(
          `${message.symbols}  (${message.translation})`,
          TEMPO_LONGO
        );

        unlockSecret(
          `gaster_${page}`
        );
      }
    );
  }

  /* =====================================================
     NIGHTMARE — CABEÇAS
  ===================================================== */

  const nightmareHeads = [];

  let nightmarePointerFrame = null;

  let lastPointerX = 0;
  let lastPointerY = 0;

  function randomHeadTop() {
    const positions = [
      14,
      23,
      34,
      48,
      62,
      74,
      83
    ];

    return positions[
      Math.floor(
        Math.random()
        *
        positions.length
      )
    ];
  }

  function removeHead(head) {
    if (
      !head
      ||
      !head.isConnected
    ) {
      return;
    }

    head.classList.add(
      "hiding"
    );

    const index =
      nightmareHeads.indexOf(
        head
      );

    if (
      index !== -1
    ) {
      nightmareHeads.splice(
        index,
        1
      );
    }

    setTimeout(
      () => {
        head.remove();
      },
      reducedMotion
      ?
      0
      :
      850
    );
  }

  function spawnNightmareHead(
    forcedSide = null,
    canFake = true
  ) {
    if (document.hidden) {
      return;
    }

    if (
      nightmareHeads.length >= 4
    ) {
      removeHead(
        nightmareHeads[0]
      );
    }

    const side =
      forcedSide
      ||
      (
        Math.random() < 0.5
        ?
        "left"
        :
        "right"
      );

    const head =
      document.createElement(
        "div"
      );

    head.className =
      `jr-nightmare-head ${side}`;

    head.style.top =
      `${randomHeadTop()}vh`;

    head.innerHTML = `
      <span class="jr-nightmare-eye left-eye"></span>
      <span class="jr-nightmare-eye right-eye"></span>
    `;

    head.setAttribute(
      "role",
      "button"
    );

    head.setAttribute(
      "tabindex",
      "0"
    );

    head.setAttribute(
      "aria-label",
      "Olhos de Nightmare"
    );

    document.body.appendChild(
      head
    );

    nightmareHeads.push(
      head
    );

    requestAnimationFrame(
      () => {
        requestAnimationFrame(
          () => {
            head.classList.add(
              "visible"
            );
          }
        );
      }
    );

    unlockSecret(
      "nightmare_seen"
    );

    function scareAway() {
      if (
        head.dataset.gone ===
        "true"
      ) {
        return;
      }

      head.dataset.gone =
        "true";

      removeHead(
        head
      );

      if (
        canFake
        &&
        Math.random() < 0.4
      ) {
        const opposite =
          side === "left"
          ?
          "right"
          :
          "left";

        setTimeout(
          () => {
            spawnNightmareHead(
              opposite,
              false
            );

            unlockSecret(
              "nightmare_fake"
            );
          },
          1500
        );
      }
    }

    head.addEventListener(
      "mouseenter",
      scareAway
    );

    head.addEventListener(
      "click",
      scareAway
    );

    head.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Enter"
          ||
          event.key === " "
        ) {
          event.preventDefault();

          scareAway();
        }
      }
    );
  }

  setTimeout(
    () => {
      spawnNightmareHead();

      setInterval(
        spawnNightmareHead,
        10000
      );
    },
    10000
  );

  function updateNightmareEyes() {
    nightmarePointerFrame = null;

    nightmareHeads.forEach(
      head => {
        if (
          !head.isConnected
        ) {
          return;
        }

        const rect =
          head.getBoundingClientRect();

        const centerX =
          rect.left
          +
          rect.width / 2;

        const centerY =
          rect.top
          +
          rect.height / 2;

        const angle =
          Math.atan2(
            lastPointerY
            -
            centerY,

            lastPointerX
            -
            centerX
          );

        const x =
          Math.cos(angle)
          *
          2.4;

        const y =
          Math.sin(angle)
          *
          2.4;

        head
          .querySelectorAll(
            ".jr-nightmare-eye"
          )
          .forEach(
            eye => {
              eye.style.transform =
                `translate(${x}px, ${y}px)`;
            }
          );
      }
    );
  }

  if (finePointer) {
    document.addEventListener(
      "pointermove",
      event => {
        lastPointerX =
          event.clientX;

        lastPointerY =
          event.clientY;

        if (
          !nightmarePointerFrame
        ) {
          nightmarePointerFrame =
            requestAnimationFrame(
              updateNightmareEyes
            );
        }
      },
      {
        passive: true
      }
    );
  }

  /* =====================================================
     HOME — NÃO HÁ MAIS RESET
  ===================================================== */

  if (isHome) {
    const seal =
      document.querySelector(
        ".selo"
      );

    if (seal) {
      let clicks = 0;
      let resetTimer = null;

      seal.addEventListener(
        "click",
        () => {
          clicks++;

          clearTimeout(
            resetTimer
          );

          resetTimer =
            setTimeout(
              () => {
                clicks = 0;
              },
              3000
            );

          if (
            clicks >= 4
          ) {
            clicks = 0;

            showToast(
              "Não há mais RESET.",
              TEMPO_LONGO
            );

            unlockSecret(
              "no_reset"
            );
          }
        }
      );
    }
  }

  /* =====================================================
     OVERLAY SECRETO
  ===================================================== */

  const overlay =
    document.createElement(
      "div"
    );

  overlay.className =
    "jr-secret-overlay";

  overlay.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.appendChild(
    overlay
  );

  function secretFlash() {
    overlay.classList.add(
      "visible"
    );

    setTimeout(
      () => {
        overlay.classList.remove(
          "visible"
        );
      },
      TEMPO_CURTO
    );
  }

  /* =====================================================
     CENTRO JUSTIÇA / VAZIO
  ===================================================== */

  if (isHome) {
    const center =
      document.querySelector(
        ".centro-dualidade"
      );

    if (center) {
      let centerTimer = null;

      center.addEventListener(
        "mouseenter",
        () => {
          centerTimer =
            setTimeout(
              () => {
                secretFlash();

                showToast(
                  "Entre justiça e vazio, ainda existe escolha.",
                  TEMPO_LONGO
                );

                unlockSecret(
                  "center"
                );
              },
              TEMPO_CURTO
            );
        }
      );

      center.addEventListener(
        "mouseleave",
        () => {
          clearTimeout(
            centerTimer
          );
        }
      );
    }
  }

  /* =====================================================
     KONAMI CODE
  ===================================================== */

  if (isHome) {
    const konami = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a"
    ];

    let konamiIndex = 0;

    document.addEventListener(
      "keydown",
      event => {
        const key =
          event.key.length === 1
          ?
          event.key.toLowerCase()
          :
          event.key;

        if (
          key ===
          konami[konamiIndex]
        ) {
          konamiIndex++;

          if (
            konamiIndex ===
            konami.length
          ) {
            konamiIndex = 0;

            secretFlash();

            showToast(
              "Você realmente tentou isso?",
              TEMPO_LONGO
            );

            unlockSecret(
              "konami"
            );
          }
        } else {
          konamiIndex =
            key === konami[0]
            ?
            1
            :
            0;
        }
      }
    );
  }

  /* =====================================================
     TROCAR DE ABA — CAPÍTULO 02
  ===================================================== */

  if (
    page ===
    "capitulo2.html"
  ) {
    const normalTitle =
      document.title;

    let titleTimer = null;

    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.hidden
        ) {
          titleTimer =
            setTimeout(
              () => {
                document.title =
                  "Eu ainda estou aqui.";

                unlockSecret(
                  "tab_watch"
                );
              },
              1500
            );
        } else {
          clearTimeout(
            titleTimer
          );

          setTimeout(
            () => {
              document.title =
                normalTitle;
            },
            1500
          );
        }
      }
    );
  }

  /* =====================================================
     PAPYRUS — 6 CLIQUES
  ===================================================== */

  if (
    page ===
    "historia.html"
  ) {
    const papyrusLines =
      document.querySelectorAll(
        ".papyrus-texto, .papyrus-fraco"
      );

    let papyrusClicks = 0;

    papyrusLines.forEach(
      line => {
        line.style.cursor =
          "pointer";

        line.addEventListener(
          "click",
          () => {
            papyrusClicks++;

            if (
              papyrusClicks === 6
            ) {
              showToast(
                "NYEH HEH HEH!",
                TEMPO_LONGO
              );

              unlockSecret(
                "papyrus_6"
              );
            }
          }
        );
      }
    );
  }

  /* =====================================================
     CRÉDITOS SECRETOS
  ===================================================== */

  if (isExtras) {
    const credits = [
      [
        ".credito.brinha",
        "Ainda escrevendo o próprio caminho.",
        "credit_brinha"
      ],

      [
        ".credito.nightmare",
        "Hah... encontrou alguma coisa?",
        "credit_nightmare"
      ],

      [
        ".credito.vox",
        "Ainda organizando o caos.",
        "credit_vox"
      ],

      [
        ".credito.toby",
        "Obrigado por criar UNDERTALE.",
        "credit_toby"
      ]
    ];

    credits.forEach(
      ([
        selector,
        text,
        id
      ]) => {
        const card =
          document.querySelector(
            selector
          );

        if (!card) return;

        card.style.cursor =
          "pointer";

        card.addEventListener(
          "click",
          () => {
            showToast(
              text,
              TEMPO_NORMAL
            );

            unlockSecret(
              id
            );
          }
        );
      }
    );
  }

  /* =====================================================
     MÚSICAS — SEGREDOS
  ===================================================== */

  if (isMusic) {
    const secrets = {
      "The Duo":
        "Duas presenças. Uma única chance.",

      "Double Danger":
        "A trégua começou antes da amizade.",

      "Vazio":
        "Antes de aprender a sentir, ele apenas observava.",

      "Bone and Darkness":
        "Algumas batalhas mudam antes mesmo de terminar.",

      "Sem Nome":
        "Nem todo momento precisa de um nome.",

      "Blade Judgement":
        "O julgamento começa quando fugir deixa de ser uma opção."
    };

    document
      .querySelectorAll(
        ".faixa"
      )
      .forEach(
        faixa => {
          const number =
            faixa.querySelector(
              ".numero"
            );

          if (!number) return;

          let clicks = 0;

          number.style.cursor =
            "pointer";

          number.addEventListener(
            "click",
            () => {
              clicks++;

              if (
                clicks >= 4
              ) {
                clicks = 0;

                const name =
                  faixa.dataset.nome
                  ||
                  "desconhecida";

                showToast(
                  secrets[name]
                  ||
                  "Alguma coisa está escondida nesta faixa.",
                  TEMPO_LONGO
                );

                unlockSecret(
                  `music_${name}`
                );
              }
            }
          );
        }
      );
  }

  /* =====================================================
     0:06 — TIMELINE 666
  ===================================================== */

  if (isMusic) {
    const musicPlayer =
      document.getElementById(
        "audioPlayer"
      );

    if (musicPlayer) {
      let sixTracks = [];

      try {
        sixTracks =
          JSON.parse(
            safeGet(
              "jr_666_tracks"
            )
          )
          ||
          [];
      } catch {
        sixTracks = [];
      }

      function stableTrackId() {
        const source =
          musicPlayer.currentSrc
          ||
          musicPlayer.src;

        if (!source) {
          return "";
        }

        try {
          return new URL(
            source,
            window.location.href
          )
            .pathname
            .split("/")
            .pop();
        } catch {
          return source;
        }
      }

      function checkSix() {
        if (
          musicPlayer.currentTime < 5.85
          ||
          musicPlayer.currentTime > 7
        ) {
          return;
        }

        const source =
          stableTrackId();

        if (
          !source
          ||
          sixTracks.includes(
            source
          )
        ) {
          return;
        }

        sixTracks.push(
          source
        );

        safeSet(
          "jr_666_tracks",
          JSON.stringify(
            sixTracks
          )
        );

        if (
          sixTracks.length === 1
        ) {
          showToast(
            "6",
            TEMPO_CURTO
          );
        } else if (
          sixTracks.length === 2
        ) {
          showToast(
            "6  6",
            TEMPO_NORMAL
          );
        } else if (
          sixTracks.length >= 3
        ) {
          safeSet(
            "jr_room666_unlocked",
            "true"
          );

          showToast(
            "6   6   6 — Uma porta apareceu em Extras.",
            TEMPO_LONGO
          );

          unlockSecret(
            "room666"
          );
        }
      }

      musicPlayer.addEventListener(
        "timeupdate",
        checkSix
      );

      musicPlayer.addEventListener(
        "seeked",
        checkSix
      );
    }
  }

  /* =====================================================
     EXTRAS DESBLOQUEÁVEIS
  ===================================================== */

  if (isExtras) {
    const unlockDefinitions = [
      [
        "jr_read_cap1",
        "ARQUIVO 01",
        "A Primeira Trégua"
      ],

      [
        "jr_read_cap2",
        "ARQUIVO 02",
        "O Eco Permanece"
      ],

      [
        "jr_read_cap3",
        "ARQUIVO 03",
        "A Porta Aberta"
      ],

      [
        "jr_read_cap4",
        "ARQUIVO 04",
        "A Chama Encontrada"
      ],

      [
        "jr_read_cap5",
        "ARQUIVO 05",
        "Sem Segunda Chance"
      ],

      [
        "jr_read_cap6",
        "ARQUIVO 06",
        "A Última Brecha"
      ],

      [
        "jr_read_cap7",
        "ARQUIVO 07",
        "O Julgamento"
      ],

      [
        "jr_read_cap8",
        "ARQUIVO 08",
        "Além da Barreira"
      ]
    ];

    const unlocked =
      unlockDefinitions
        .filter(
          ([key]) =>
            safeGet(key)
            ===
            "true"
        )
        .map(
          (
            [
              ,
              number,
              title
            ]
          ) => ({
            number,
            title
          })
        );

    if (
      unlocked.length > 0
    ) {
      const section =
        document.createElement(
          "section"
        );

      section.className =
        "jr-unlocks";

      section.innerHTML = `
        <h2 class="jr-unlocks-title">
          ARQUIVOS DESBLOQUEADOS
        </h2>

        <div class="jr-unlock-grid">

          ${
            unlocked
              .map(
                item => `
                  <article class="jr-unlock">

                    <span>
                      ${item.number}
                    </span>

                    <strong>
                      ${item.title}
                    </strong>

                  </article>
                `
              )
              .join("")
          }

        </div>
      `;

      const credits =
        document.querySelector(
          ".creditos"
        );

      if (credits) {
        credits.parentNode.insertBefore(
          section,
          credits
        );
      }
    }

    if (
      safeGet(
        "jr_room666_unlocked"
      )
      ===
      "true"
    ) {
      const door =
        document.createElement(
          "a"
        );

      door.href =
        "room.html";

      door.className =
        "jr-room666-link";

      door.innerHTML = `
        <small>
          ARQUIVO 666
        </small>

        <strong>
          SALA 6-6-6
        </strong>
      `;

      const credits =
        document.querySelector(
          ".creditos"
        );

      if (credits) {
        credits.parentNode.insertBefore(
          door,
          credits
        );
      }
    }

    const counter =
      document.createElement(
        "p"
      );

    counter.className =
      "jr-secret-counter";

    counter.textContent =
      `SEGREDOS ENCONTRADOS: ${countSecrets()} / ??`;

    const final =
      document.querySelector(
        ".final"
      );

    if (final) {
      final.insertAdjacentElement(
        "beforebegin",
        counter
      );
    }
  }

  /* =====================================================
     FRASES DE FINAL
     8 SEGUNDOS NO RODAPÉ
  ===================================================== */

  if (isStory) {
    const whispers = {
      "historia.html":
        "Alguns presentes chegam tarde demais.",

      "capitulo1.html":
        "Uma trégua não deveria significar tanto.",

      "capitulo2.html":
        "Algumas frases continuam ecoando depois que ninguém mais está falando.",

      "capitulo3.html":
        "Algumas portas só precisam abrir uma vez.",

      "capitulo4.html":
        "Uma chama abandonada ainda pode encontrar um propósito.",

      "capitulo5.html":
        "Desta vez, ninguém sabia exatamente o que aconteceria depois.",

      "capitulo6.html":
        "Uma única brecha pode ser tudo o que resta.",

      "capitulo7.html":
        "Julgamento não significa esquecimento.",

      "capitulo8.html":
        "Desta vez, o amanhã não precisou ser repetido."
    };

    const ending =
      document.querySelector(
        ".fim-leitura"
      );

    if (
      ending
      &&
      whispers[page]
      &&
      "IntersectionObserver"
      in window
    ) {
      let whisperTimer = null;
      let alreadyShown = false;

      const observer =
        new IntersectionObserver(
          entries => {
            entries.forEach(
              entry => {
                if (
                  entry.isIntersecting
                  &&
                  !alreadyShown
                ) {
                  whisperTimer =
                    setTimeout(
                      () => {
                        alreadyShown =
                          true;

                        const whisper =
                          document.createElement(
                            "p"
                          );

                        whisper.className =
                          "jr-end-whisper";

                        whisper.textContent =
                          whispers[page];

                        ending.insertAdjacentElement(
                          "afterend",
                          whisper
                        );

                        requestAnimationFrame(
                          () => {
                            requestAnimationFrame(
                              () => {
                                whisper.classList.add(
                                  "visible"
                                );
                              }
                            );
                          }
                        );

                        unlockSecret(
                          `ending_${page}`
                        );

                        observer.disconnect();
                      },
                      8000
                    );
                } else if (
                  !entry.isIntersecting
                ) {
                  clearTimeout(
                    whisperTimer
                  );
                }
              }
            );
          },
          {
            threshold: 0.4
          }
        );

      observer.observe(
        ending
      );
    }
  }

  /* =====================================================
     CHARA — DEPOIS DO FINAL
  ===================================================== */

  if (
    isExtras
    &&
    safeGet(
      "jr_story_complete"
    )
    ===
    "true"
  ) {
    const chara =
      document.createElement(
        "div"
      );

    chara.className =
      "jr-chara-head";

    chara.title =
      "...";

    chara.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.appendChild(
      chara
    );
  }

  /* =====================================================
     SALA 666
  ===================================================== */

  if (isRoom666) {
    const sixes =
      document.querySelectorAll(
        ".room-six"
      );

    let roomClicks = 0;

    sixes.forEach(
      six => {
        six.addEventListener(
          "click",
          () => {
            if (
              six.dataset.clicked
              ===
              "true"
            ) {
              return;
            }

            six.dataset.clicked =
              "true";

            six.classList.add(
              "active"
            );

            roomClicks++;

            if (
              roomClicks === 3
            ) {
              showToast(
                "TIMELINE 666 — UMA ÚNICA CHANCE.",
                TEMPO_LONGO
              );

              unlockSecret(
                "room666_complete"
              );
            }
          }
        );
      }
    );
  }

  /* =====================================================
     CONSOLE
  ===================================================== */

  console.log(
    "%cJUDGMENT RONIN & NIGHTMARE",
    "color:#dff6ff;font-size:16px;font-weight:bold;"
  );

  console.log(
    "%cVocê foi longe demais.",
    "color:#a92929;font-size:13px;"
  );

  console.log(
    "%cTIMELINE: 666",
    "color:#777;font-size:11px;letter-spacing:2px;"
  );

})();
