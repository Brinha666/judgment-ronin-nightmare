(() => {

    "use strict";


    /* =====================================================
       PÁGINA ATUAL
    ===================================================== */

    const page =
        window.location.pathname
            .split("/")
            .pop()
        || "index.html";


    const isHome =
        page === "index.html";


    const storyPages = [
        "historia.html",
        "capitulo1.html",
        "capitulo2.html"
    ];


    const isStory =
        storyPages.includes(page);


    const isExtras =
        page === "extras.html";


    const isMusic =
        page === "musicas.html";


    /* =====================================================
       TOAST
    ===================================================== */

    const toast =
        document.createElement("div");


    toast.className =
        "jr-toast";


    document.body.appendChild(
        toast
    );


    let toastTimer = null;


    function showToast(
        text,
        duration = 3400
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
       INTERPOLAÇÃO DE COR
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


        let scrollQueued =
            false;


        function updateProgress() {

            const maxScroll =
                Math.max(
                    document.documentElement
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


            scrollQueued =
                false;

        }


        window.addEventListener(
            "scroll",
            () => {

                if (!scrollQueued) {

                    requestAnimationFrame(
                        updateProgress
                    );


                    scrollQueued =
                        true;

                }

            },
            {
                passive: true
            }
        );


        updateProgress();

    }


    /* =====================================================
       TIMELINE
    ===================================================== */

    if (isStory) {

        const timeline =
            document.createElement(
                "div"
            );


        timeline.className =
            "jr-timeline";


        const completed =
            localStorage.getItem(
                "jr_story_complete"
            )
            ===
            "true";


        timeline.textContent =
            completed
            ?
            "TIMELINE: FINAL"
            :
            "TIMELINE: ???";


        document.body.appendChild(
            timeline
        );

    }


    /* =====================================================
       MARCAR CAPÍTULO COMO LIDO
    ===================================================== */

    const readKeys = {

        "historia.html":
            "jr_read_prologue",

        "capitulo1.html":
            "jr_read_cap1",

        "capitulo2.html":
            "jr_read_cap2"

    };


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
                                    entry.isIntersecting
                                ) {

                                    localStorage.setItem(
                                        readKeys[page],
                                        "true"
                                    );


                                    localStorage.setItem(
                                        "jr_last_read",
                                        page
                                    );


                                    observer.disconnect();

                                }

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
       MENSAGEM AO VOLTAR PARA HOME
    ===================================================== */

    if (isHome) {

        const lastRead =
            localStorage.getItem(
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

                    if (
                        lastRead ===
                        "capitulo2.html"
                    ) {

                        showToast(
                            "Voltou? Interessante."
                        );

                    }

                    else {

                        showToast(
                            "ainda aqui? heh."
                        );

                    }


                    sessionStorage.setItem(
                        "jr_return_message",
                        "true"
                    );

                },
                2800
            );

        }

    }


    /* =====================================================
       TRILHA RECOMENDADA
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


        button.type =
            "button";


        button.className =
            "jr-chapter-music";


        button.textContent =
            "♪";


        button.title =
            `Trilha recomendada: ${track.name}`;


        const audio =
            document.createElement(
                "audio"
            );


        audio.preload =
            "none";


        audio.src =
            track.src;


        audio.volume =
            0.38;


        document.body.appendChild(
            audio
        );


        document.body.appendChild(
            button
        );


        button.addEventListener(
            "click",
            async () => {

                if (
                    audio.paused
                ) {

                    try {

                        await audio.play();


                        button.classList.add(
                            "playing"
                        );


                        button.textContent =
                            "❚❚";


                        showToast(
                            `♪ ${track.name}`
                        );

                    }

                    catch {

                        showToast(
                            "O navegador bloqueou o áudio."
                        );

                    }

                }

                else {

                    audio.pause();


                    button.classList.remove(
                        "playing"
                    );


                    button.textContent =
                        "♪";

                }

            }
        );


        audio.addEventListener(
            "ended",
            () => {

                button.classList.remove(
                    "playing"
                );


                button.textContent =
                    "♪";

            }
        );

    }


    /* =====================================================
       SAVE STAR
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


        document.body.appendChild(
            star
        );


        star.addEventListener(
            "click",
            () => {

                const finished =
                    localStorage.getItem(
                        "jr_story_complete"
                    )
                    ===
                    "true";


                if (finished) {

                    showToast(
                        "Não há nada para salvar aqui."
                    );

                }

                else {

                    showToast(
                        "Nada aconteceu."
                    );

                }

            }
        );

    }


    /* =====================================================
       ECHO FLOWERS — CAPÍTULO 02
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
                        data-echo="Eu quero saber."
                    >
                        ✿
                    </button>

                    <button
                        class="jr-echo"
                        type="button"
                        data-echo="Porque é assim que eu faço novas amizades."
                    >
                        ✿
                    </button>

                    <button
                        class="jr-echo"
                        type="button"
                        data-echo="Porque é assim que eu faço novas memórias."
                    >
                        ✿
                    </button>

                </div>

                <p class="jr-echo-text"></p>

            `;


            target.insertAdjacentElement(
                "afterend",
                garden
            );


            const echoText =
                garden.querySelector(
                    ".jr-echo-text"
                );


            garden
                .querySelectorAll(
                    ".jr-echo"
                )
                .forEach(
                    flower => {

                        flower.addEventListener(
                            "click",
                            () => {

                                echoText.textContent =
                                    `“${flower.dataset.echo}”`;


                                echoText.classList.add(
                                    "visible"
                                );

                            }
                        );

                    }
                );

        }

    }


    /* =====================================================
       GASTER — MENSAGENS ESCONDIDAS
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

            }

            else {

                storyArticle.appendChild(
                    mark
                );

            }

        }

        else {

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
                    5200
                );

            }
        );

    }


    /* =====================================================
       CABEÇA DO NIGHTMARE
    ===================================================== */

    if (
        (
            page ===
            "capitulo1.html"
            ||
            page ===
            "capitulo2.html"
        )
        &&
        !sessionStorage.getItem(
            "jr_nightmare_head_seen"
        )
    ) {

        const head =
            document.createElement(
                "div"
            );


        head.className =
            "jr-nightmare-head";


        head.setAttribute(
            "role",
            "button"
        );


        head.setAttribute(
            "tabindex",
            "0"
        );


        head.innerHTML = `

            <span class="jr-nightmare-eye left"></span>
            <span class="jr-nightmare-eye right"></span>

        `;


        document.body.appendChild(
            head
        );


        const delay =
            10000
            +
            Math.random()
            *
            7000;


        setTimeout(
            () => {

                head.classList.add(
                    "visible"
                );


                sessionStorage.setItem(
                    "jr_nightmare_head_seen",
                    "true"
                );

            },
            delay
        );


        function hideHead() {

            head.classList.add(
                "hiding"
            );


            setTimeout(
                () => {

                    head.remove();

                },
                850
            );

        }


        head.addEventListener(
            "mouseenter",
            hideHead
        );


        head.addEventListener(
            "click",
            hideHead
        );


        if (
            window.matchMedia(
                "(pointer: fine)"
            ).matches
        ) {

            const eyes =
                head.querySelectorAll(
                    ".jr-nightmare-eye"
                );


            document.addEventListener(
                "pointermove",
                event => {

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
                            event.clientY
                            -
                            centerY,

                            event.clientX
                            -
                            centerX
                        );


                    const x =
                        Math.cos(
                            angle
                        )
                        *
                        2;


                    const y =
                        Math.sin(
                            angle
                        )
                        *
                        2;


                    eyes.forEach(
                        eye => {

                            eye.style.transform =
                                `translate(${x}px, ${y}px)`;

                        }
                    );

                },
                {
                    passive: true
                }
            );

        }

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

            let clicks =
                0;


            let clickReset =
                null;


            seal.style.cursor =
                "default";


            seal.addEventListener(
                "click",
                () => {

                    clicks++;


                    clearTimeout(
                        clickReset
                    );


                    clickReset =
                        setTimeout(
                            () => {

                                clicks =
                                    0;

                            },
                            2500
                        );


                    if (
                        clicks >= 4
                    ) {

                        clicks =
                            0;


                        showToast(
                            "Não há mais RESET."
                        );

                    }

                }
            );

        }

    }


    /* =====================================================
       HOME — CENTRO ENTRE JUSTIÇA E VAZIO
    ===================================================== */

    if (isHome) {

        const center =
            document.querySelector(
                ".centro-dualidade"
            );


        if (center) {

            let timer =
                null;


            function activate() {

                timer =
                    setTimeout(
                        () => {

                            showToast(
                                "Entre justiça e vazio, ainda existe escolha."
                            );


                            secretFlash();

                        },
                        2600
                    );

            }


            function cancel() {

                clearTimeout(
                    timer
                );

            }


            center.addEventListener(
                "mouseenter",
                activate
            );


            center.addEventListener(
                "mouseleave",
                cancel
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
            3600
        );

    }


    /* =====================================================
       KONAMI CODE
       ↑ ↑ ↓ ↓ ← → ← → B A
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


        let konamiIndex =
            0;


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
                    konami[
                        konamiIndex
                    ]
                ) {

                    konamiIndex++;


                    if (
                        konamiIndex ===
                        konami.length
                    ) {

                        konamiIndex =
                            0;


                        secretFlash();


                        showToast(
                            "Você realmente tentou isso?"
                        );

                    }

                }

                else {

                    konamiIndex =
                        0;

                }

            }
        );

    }


    /* =====================================================
       CRÉDITOS SECRETOS
    ===================================================== */

    if (isExtras) {

        const creditSecrets = [

            [
                ".credito.brinha",
                "Ainda escrevendo o próprio caminho."
            ],

            [
                ".credito.nightmare",
                "Hah... encontrou alguma coisa?"
            ],

            [
                ".credito.vox",
                "Ainda organizando o caos."
            ],

            [
                ".credito.toby",
                "Obrigado por criar UNDERTALE."
            ]

        ];


        creditSecrets.forEach(
            ([
                selector,
                text
            ]) => {

                const card =
                    document.querySelector(
                        selector
                    );


                if (card) {

                    card.style.cursor =
                        "pointer";


                    card.addEventListener(
                        "click",
                        () => {

                            showToast(
                                text
                            );

                        }
                    );

                }

            }
        );

    }


    /* =====================================================
       SEGREDOS NA PÁGINA DE MÚSICAS
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
                "Nem todo momento precisa de um nome."
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


                    if (!number) {
                        return;
                    }


                    let clicks =
                        0;


                    number.style.cursor =
                        "pointer";


                    number.addEventListener(
                        "click",
                        () => {

                            clicks++;


                            if (
                                clicks >= 4
                            ) {

                                clicks =
                                    0;


                                const name =
                                    faixa.dataset.nome;


                                showToast(
                                    secrets[name]
                                    ||
                                    "Alguma coisa está escondida nesta faixa."
                                );

                            }

                        }
                    );

                }
            );

    }


    /* =====================================================
       EXTRAS DESBLOQUEÁVEIS
    ===================================================== */

    if (isExtras) {

        const unlocked = [];


        if (
            localStorage.getItem(
                "jr_read_cap1"
            )
            ===
            "true"
        ) {

            unlocked.push({
                number:
                    "ARQUIVO 01",

                title:
                    "A Primeira Trégua"
            });

        }


        if (
            localStorage.getItem(
                "jr_read_cap2"
            )
            ===
            "true"
        ) {

            unlocked.push({
                number:
                    "ARQUIVO 02",

                title:
                    "O Eco Permanece"
            });

        }


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

    }


    /* =====================================================
       CHARA — SOMENTE DEPOIS DO FINAL

       Futuramente basta usar:

       localStorage.setItem(
           "jr_story_complete",
           "true"
       );

    ===================================================== */

    if (
        isExtras
        &&
        localStorage.getItem(
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


        document.body.appendChild(
            chara
        );

    }

})();
