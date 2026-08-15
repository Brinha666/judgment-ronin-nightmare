(() => {

  const body =
    document.body;


  const quote =
    document.getElementById(
      "frase-destaque"
    );


  const cursorGlow =
    document.getElementById(
      "cursor-glow"
    );



  /* =====================================
     FRASES
  ===================================== */


  const quotes = [

    {

      text:
        '"Seu erro? Demorar para perceber que eu não desistiria..."',

      theme:
        "sans"

    },


    {

      text:
        '"Hahahaha! Eu vou ser seu melhor pesadelo, me mostre que você vale o esforço!"',

      theme:
        "nightmare"

    }

  ];



  let quoteIndex =
    0;


  let switchingQuote =
    false;



  function setTheme(theme) {

    body.classList.toggle(
      "tema-sans",
      theme === "sans"
    );


    body.classList.toggle(
      "tema-nightmare",
      theme === "nightmare"
    );

  }



  function switchQuote() {

    if (
      !quote ||
      switchingQuote
    ) {

      return;
    }


    switchingQuote =
      true;


    /*
      A frase atual começa
      a desaparecer.
    */

    quote.classList.add(
      "is-hidden"
    );


    const nextIndex =

      (quoteIndex + 1)

      %

      quotes.length;



    /*
      Enquanto a frase desaparece,
      a iluminação já começa
      lentamente a trocar de lado.
    */

    window.setTimeout(

      () => {

        setTheme(
          quotes[nextIndex].theme
        );

      },

      280

    );



    /*
      Quando a frase já desapareceu,
      trocamos o texto.
    */

    window.setTimeout(

      () => {

        quoteIndex =
          nextIndex;


        quote.textContent =
          quotes[quoteIndex].text;



        quote.classList.remove(

          "fala-sans",

          "fala-nightmare"

        );



        quote.classList.add(

          `fala-${
            quotes[quoteIndex].theme
          }`

        );



        /*
          Dois requestAnimationFrame
          garantem que o navegador
          reconheça o estado invisível
          antes de mostrar a nova frase.
        */

        requestAnimationFrame(

          () => {

            requestAnimationFrame(

              () => {

                quote.classList.remove(
                  "is-hidden"
                );

              }

            );

          }

        );



        window.setTimeout(

          () => {

            switchingQuote =
              false;

          },

          950

        );

      },

      900

    );

  }



  if (quote) {

    quote.textContent =
      quotes[0].text;


    quote.classList.add(
      "fala-sans"
    );


    setTheme(
      "sans"
    );


    setInterval(

      switchQuote,

      7000

    );

  }



  /* =====================================
     CURSOR

     ESQUERDA:
     AZUL

     CENTRO:
     BRANCO

     DIREITA:
     VERMELHO
  ===================================== */


  if (

    cursorGlow &&

    window
      .matchMedia(
        "(pointer: fine)"
      )
      .matches

  ) {


    let targetX =
      window.innerWidth / 2;


    let targetY =
      window.innerHeight / 2;


    let currentX =
      targetX;


    let currentY =
      targetY;



    const blue = [

      100,

      210,

      255

    ];


    const white = [

      245,

      250,

      255

    ];


    const red = [

      190,

      28,

      35

    ];



    function mix(
      a,
      b,
      t
    ) {

      return a.map(

        (
          value,
          index
        ) =>

          Math.round(

            value +

            (
              b[index] -
              value
            )

            *

            t

          )

      );

    }



    function colorForX(x) {

      const percentage =

        Math.max(

          0,

          Math.min(

            1,

            x /

            Math.max(
              window.innerWidth,
              1
            )

          )

        );



      if (
        percentage <= 0.5
      ) {

        return mix(

          blue,

          white,

          percentage * 2

        );

      }



      return mix(

        white,

        red,

        (
          percentage - 0.5
        )

        *

        2

      );

    }



    function paintColor(x) {

      const [

        r,

        g,

        b

      ] =

        colorForX(x);



      cursorGlow.style.background =

        `radial-gradient(
          circle,
          rgba(${r}, ${g}, ${b}, 0.62) 0%,
          rgba(${r}, ${g}, ${b}, 0.24) 30%,
          rgba(${r}, ${g}, ${b}, 0.08) 48%,
          rgba(${r}, ${g}, ${b}, 0) 72%
        )`;

    }



    document.addEventListener(

      "pointermove",

      (event) => {

        targetX =
          event.clientX;


        targetY =
          event.clientY;


        paintColor(
          event.clientX
        );


        cursorGlow.classList.add(
          "ativo"
        );

      }

    );



    document.addEventListener(

      "pointerleave",

      () => {

        cursorGlow.classList.remove(
          "ativo"
        );

      }

    );



    window.addEventListener(

      "resize",

      () => {

        paintColor(
          targetX
        );

      }

    );



    function animateCursor() {

      currentX +=

        (
          targetX -
          currentX
        )

        *

        0.12;



      currentY +=

        (
          targetY -
          currentY
        )

        *

        0.12;



      cursorGlow.style.left =

        `${currentX}px`;



      cursorGlow.style.top =

        `${currentY}px`;



      requestAnimationFrame(
        animateCursor
      );

    }



    paintColor(
      targetX
    );


    animateCursor();

  }



  /* =====================================
     MÚSICA + TELA DE ENTRADA
  ===================================== */


  const entrance =

    document.getElementById(
      "tela-entrada"
    );


  const enterWithSound =

    document.getElementById(
      "entrar-com-som"
    );


  const enterSilent =

    document.getElementById(
      "entrar-sem-som"
    );


  const audio =

    document.getElementById(
      "musica-fundo"
    );


  const musicButton =

    document.getElementById(
      "botao-musica"
    );



  if (
    !audio ||
    !musicButton
  ) {

    return;

  }



  const playlist = [

    {

      name:
        "The Duo",

      src:
        "Assets/The_duo.wav"

    },


    {

      name:
        "Double Danger",

      src:
        "Assets/Double_Danger.wav"

    }

  ];



  const targetVolume =
    0.45;


  let trackIndex =
    0;


  let volumeAnimation =
    null;



  function loadTrack() {

    audio.src =

      playlist[
        trackIndex
      ].src;


    updateMusicButton();

  }



  function updateMusicButton() {

    const icon =

      audio.paused

      ?

      "▶"

      :

      "❚❚";



    musicButton.textContent =

      `${icon} ${
        playlist[
          trackIndex
        ].name
      }`;

  }



  function stopVolumeAnimation() {

    if (
      volumeAnimation
    ) {

      cancelAnimationFrame(
        volumeAnimation
      );


      volumeAnimation =
        null;

    }

  }



  /* =====================================
     FADE DA MÚSICA
  ===================================== */


  function fadeVolume(

    from,

    to,

    duration = 3200

  ) {


    stopVolumeAnimation();


    audio.volume =
      from;


    const start =
      performance.now();



    function frame(now) {

      const progress =

        Math.min(

          (
            now -
            start
          )

          /

          duration,

          1

        );



      const smooth =

        1 -

        Math.pow(

          1 -
          progress,

          3

        );



      audio.volume =

        from +

        (
          to -
          from
        )

        *

        smooth;



      if (
        progress < 1
      ) {

        volumeAnimation =

          requestAnimationFrame(
            frame
          );

      }

      else {

        volumeAnimation =
          null;

      }

    }



    volumeAnimation =

      requestAnimationFrame(
        frame
      );

  }



  /* =====================================
     ESCONDER ENTRADA
  ===================================== */


  function hideEntrance() {

    body.classList.remove(
      "entrada-pendente"
    );


    if (
      !entrance
    ) {

      return;
    }



    entrance.classList.add(
      "saindo"
    );



    window.setTimeout(

      () => {

        entrance.hidden =
          true;

      },

      800

    );

  }



  /* =====================================
     ENTRAR COM SOM
  ===================================== */


  async function startWithSound() {

    try {

      audio.volume =
        0.01;



      await audio.play();



      sessionStorage.setItem(

        "jr-entrada-feita",

        "sim"

      );



      sessionStorage.setItem(

        "jr-som-home",

        "ligado"

      );



      hideEntrance();



      fadeVolume(

        0.01,

        targetVolume,

        3400

      );



      updateMusicButton();

    }


    catch (error) {

      console.warn(

        "O navegador bloqueou a reprodução:",

        error

      );


      hideEntrance();

    }

  }



  /* =====================================
     ENTRAR SEM SOM
  ===================================== */


  function startSilent() {

    audio.pause();



    sessionStorage.setItem(

      "jr-entrada-feita",

      "sim"

    );



    sessionStorage.setItem(

      "jr-som-home",

      "desligado"

    );



    hideEntrance();



    updateMusicButton();

  }



  /* =====================================
     BOTÃO DO PLAYER
  ===================================== */


  musicButton.addEventListener(

    "click",

    async () => {


      if (
        audio.paused
      ) {


        try {

          audio.volume =
            targetVolume;


          await audio.play();



          sessionStorage.setItem(

            "jr-som-home",

            "ligado"

          );

        }


        catch (error) {

          console.warn(

            "Não foi possível iniciar a música:",

            error

          );

        }

      }


      else {

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



  /* =====================================
     PRÓXIMA FAIXA
  ===================================== */


  audio.addEventListener(

    "ended",

    async () => {


      trackIndex =

        (
          trackIndex +
          1
        )

        %

        playlist.length;



      loadTrack();



      try {

        audio.volume =
          targetVolume;


        await audio.play();

      }


      catch {

        updateMusicButton();

      }

    }

  );



  /* =====================================
     BOTÕES DA ENTRADA
  ===================================== */


  if (
    enterWithSound
  ) {

    enterWithSound.addEventListener(

      "click",

      startWithSound

    );

  }



  if (
    enterSilent
  ) {

    enterSilent.addEventListener(

      "click",

      startSilent

    );

  }



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



  /*
    Se a pessoa já entrou nesta sessão,
    não mostramos a tela novamente
    toda vez que ela volta da História,
    Músicas etc.
  */

  if (
    alreadyEntered
  ) {


    hideEntrance();



    if (
      soundPreference ===
      "ligado"
    ) {


      audio.volume =
        0.01;



      audio.play()

        .then(

          () => {

            fadeVolume(

              0.01,

              targetVolume,

              1800

            );

          }

        )

        .catch(

          () => {

            updateMusicButton();

          }

        );

    }

  }

})();
