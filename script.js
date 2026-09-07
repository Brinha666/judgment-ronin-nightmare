(() => {
  "use strict";

  // Este arquivo é o JS principal da HOME.
  // Se ele for carregado duas vezes por engano, só inicializa uma vez.
  if (window.__JR_HOME_SCRIPT_LOADED__) return;
  window.__JR_HOME_SCRIPT_LOADED__ = true;

  const body = document.body;
  const quote = document.getElementById("frase-destaque");
  const cursorGlow = document.getElementById("cursor-glow");
  const entrance = document.getElementById("tela-entrada");
  const enterWithSound = document.getElementById("entrar-com-som");
  const enterSilent = document.getElementById("entrar-sem-som");
  const audio = document.getElementById("musica-fundo");
  const musicButton = document.getElementById("botao-musica");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =====================================
     FRASES + TEMA DA HOME
  ===================================== */

  const quotes = [
    {
      text: '"Seu erro? Demorar para perceber que eu não desistiria..."',
      theme: "sans"
    },
    {
      text: '"Hahahaha! Eu vou ser seu melhor pesadelo, me mostre que você vale o esforço!"',
      theme: "nightmare"
    }
  ];

  let quoteIndex = 0;
  let switchingQuote = false;
  let quoteInterval = null;

  function setTheme(theme) {
    body.classList.toggle("tema-sans", theme === "sans");
    body.classList.toggle("tema-nightmare", theme === "nightmare");
  }

  function applyQuote(index) {
    if (!quote) return;

    quoteIndex = index;
    quote.textContent = quotes[index].text;
    quote.classList.remove("fala-sans", "fala-nightmare");
    quote.classList.add(`fala-${quotes[index].theme}`);
    setTheme(quotes[index].theme);
  }

  function switchQuote() {
    if (!quote || switchingQuote || document.hidden) return;

    switchingQuote = true;
    const nextIndex = (quoteIndex + 1) % quotes.length;

    if (prefersReducedMotion) {
      applyQuote(nextIndex);
      switchingQuote = false;
      return;
    }

    quote.classList.add("is-hidden");

    window.setTimeout(() => {
      setTheme(quotes[nextIndex].theme);
    }, 280);

    window.setTimeout(() => {
      quoteIndex = nextIndex;
      quote.textContent = quotes[quoteIndex].text;
      quote.classList.remove("fala-sans", "fala-nightmare");
      quote.classList.add(`fala-${quotes[quoteIndex].theme}`);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          quote.classList.remove("is-hidden");
        });
      });

      window.setTimeout(() => {
        switchingQuote = false;
      }, 950);
    }, 900);
  }

  function startQuoteRotation() {
    if (!quote || quoteInterval) return;
    quoteInterval = window.setInterval(switchQuote, 7000);
  }

  function stopQuoteRotation() {
    if (!quoteInterval) return;
    window.clearInterval(quoteInterval);
    quoteInterval = null;
  }

  if (quote) {
    applyQuote(0);
    startQuoteRotation();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopQuoteRotation();
      else startQuoteRotation();
    });
  }

  /* =====================================
     CURSOR GLOW
     esquerda = azul
     centro = branco
     direita = vermelho
  ===================================== */

  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursorGlow && finePointer && !prefersReducedMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let cursorFrame = null;

    const blue = [100, 210, 255];
    const white = [245, 250, 255];
    const red = [190, 28, 35];

    function mix(a, b, t) {
      return a.map((value, index) =>
        Math.round(value + (b[index] - value) * t)
      );
    }

    function colorForX(x) {
      const percentage = Math.max(
        0,
        Math.min(1, x / Math.max(window.innerWidth, 1))
      );

      if (percentage <= 0.5) {
        return mix(blue, white, percentage * 2);
      }

      return mix(white, red, (percentage - 0.5) * 2);
    }

    function paintColor(x) {
      const [r, g, b] = colorForX(x);

      cursorGlow.style.background = `radial-gradient(
        circle,
        rgba(${r}, ${g}, ${b}, 0.62) 0%,
        rgba(${r}, ${g}, ${b}, 0.24) 30%,
        rgba(${r}, ${g}, ${b}, 0.08) 48%,
        rgba(${r}, ${g}, ${b}, 0) 72%
      )`;
    }

    function animateCursor() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;

      cursorFrame = requestAnimationFrame(animateCursor);
    }

    document.addEventListener(
      "pointermove",
      event => {
        targetX = event.clientX;
        targetY = event.clientY;

        paintColor(event.clientX);
        cursorGlow.classList.add("ativo");
      },
      { passive: true }
    );

    document.addEventListener("pointerleave", () => {
      cursorGlow.classList.remove("ativo");
    });

    window.addEventListener("resize", () => {
      paintColor(targetX);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && cursorFrame) {
        cancelAnimationFrame(cursorFrame);
        cursorFrame = null;
      } else if (!document.hidden && !cursorFrame) {
        animateCursor();
      }
    });

    paintColor(targetX);
    animateCursor();
  }

  /* =====================================
     MÚSICA + TELA DE ENTRADA
  ===================================== */

  // Se esta página não tiver player,
  // o resto da Home continua funcionando.
  if (!audio || !musicButton) return;

  const playlist = [
    {
      name: "The Duo",
      src: "Assets/The_duo.wav"
    },
    {
      name: "Double Danger",
      src: "Assets/Double_Danger.wav"
    }
  ];

  const targetVolume = 0.45;

  let trackIndex = 0;
  let volumeAnimation = null;

  function loadTrack() {
    audio.src = playlist[trackIndex].src;
    updateMusicButton();
  }

  function updateMusicButton() {
    const playing = !audio.paused;
    const icon = playing ? "❚❚" : "▶";
    const name = playlist[trackIndex].name;

    musicButton.textContent = `${icon} ${name}`;
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute(
      "aria-label",
      playing
        ? `Pausar ${name}`
        : `Tocar ${name}`
    );
  }

  function stopVolumeAnimation() {
    if (!volumeAnimation) return;

    cancelAnimationFrame(volumeAnimation);
    volumeAnimation = null;
  }

  function fadeVolume(from, to, duration = 3200) {
    stopVolumeAnimation();

    if (prefersReducedMotion) {
      audio.volume = to;
      return;
    }

    audio.volume = from;

    const start = performance.now();

    function frame(now) {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const smooth =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      audio.volume =
        from +
        (to - from) * smooth;

      if (progress < 1) {
        volumeAnimation =
          requestAnimationFrame(frame);
      } else {
        volumeAnimation = null;
      }
    }

    volumeAnimation =
      requestAnimationFrame(frame);
  }

  function hideEntrance() {
    body.classList.remove("entrada-pendente");

    if (!entrance) return;

    entrance.classList.add("saindo");

    window.setTimeout(
      () => {
        entrance.hidden = true;
      },
      prefersReducedMotion
        ? 0
        : 800
    );
  }

  function saveEntrancePreference(sound) {
    sessionStorage.setItem(
      "jr-entrada-feita",
      "sim"
    );

    sessionStorage.setItem(
      "jr-som-home",
      sound
        ? "ligado"
        : "desligado"
    );
  }

  async function startWithSound() {
    try {
      audio.volume = 0.01;

      await audio.play();

      saveEntrancePreference(true);
      hideEntrance();

      fadeVolume(
        0.01,
        targetVolume,
        3400
      );

      updateMusicButton();
    } catch (error) {
      console.warn(
        "O navegador bloqueou a reprodução:",
        error
      );

      saveEntrancePreference(false);
      hideEntrance();
      updateMusicButton();
    }
  }

  function startSilent() {
    stopVolumeAnimation();
    audio.pause();

    saveEntrancePreference(false);
    hideEntrance();
    updateMusicButton();
  }

  musicButton.addEventListener(
    "click",
    async () => {
      if (audio.paused) {
        try {
          audio.volume = targetVolume;

          await audio.play();

          sessionStorage.setItem(
            "jr-som-home",
            "ligado"
          );
        } catch (error) {
          console.warn(
            "Não foi possível iniciar a música:",
            error
          );
        }
      } else {
        audio.pause();

        sessionStorage.setItem(
          "jr-som-home",
          "desligado"
        );
      }

      updateMusicButton();
    }
  );

  audio.addEventListener(
    "play",
    updateMusicButton
  );

  audio.addEventListener(
    "pause",
    updateMusicButton
  );

  audio.addEventListener(
    "ended",
    async () => {
      trackIndex =
        (trackIndex + 1)
        %
        playlist.length;

      loadTrack();

      try {
        audio.volume =
          targetVolume;

        await audio.play();
      } catch {
        updateMusicButton();
      }
    }
  );

  enterWithSound?.addEventListener(
    "click",
    startWithSound
  );

  enterSilent?.addEventListener(
    "click",
    startSilent
  );

  /* =====================================
     CARREGAMENTO INICIAL
  ===================================== */

  loadTrack();

  audio.volume =
    targetVolume;

  const alreadyEntered =
    sessionStorage.getItem(
      "jr-entrada-feita"
    )
    ===
    "sim";

  const soundPreference =
    sessionStorage.getItem(
      "jr-som-home"
    );

  if (alreadyEntered) {
    hideEntrance();

    if (
      soundPreference ===
      "ligado"
    ) {
      audio.volume = 0.01;

      audio
        .play()
        .then(() => {
          fadeVolume(
            0.01,
            targetVolume,
            1800
          );
        })
        .catch(() => {
          updateMusicButton();
        });
    } else {
      updateMusicButton();
    }
  } else {
    updateMusicButton();
  }
})();
