/* =====================================
   ELEMENTOS DA HOME
===================================== */

const frase =
    document.getElementById("frase-destaque");


const musica =
    document.getElementById("musica-fundo");


const botaoMusica =
    document.getElementById("botao-musica");


const cursorGlow =
    document.getElementById("cursor-glow");



/* =====================================
   FRASES DA HOME
===================================== */

if (frase) {

    const falas = [

        {
            texto:
                '"Seu erro? Demorar para perceber que eu não desistiria..."',

            personagem:
                "sans"
        },

        {
            texto:
                '"Hahahaha! Eu vou ser seu melhor pesadelo, me mostre que você vale o esforço!"',

            personagem:
                "nightmare"
        }

    ];


    let falaAtual = 0;


    function trocarFala() {

        frase.classList.add("sumindo");


        setTimeout(() => {

            falaAtual++;


            if (falaAtual >= falas.length) {

                falaAtual = 0;

            }


            frase.textContent =
                falas[falaAtual].texto;


            frase.classList.remove(
                "fala-sans",
                "fala-nightmare"
            );


            frase.classList.add(
                "fala-" +
                falas[falaAtual].personagem
            );


            document.body.classList.remove(
                "tema-sans",
                "tema-nightmare"
            );


            document.body.classList.add(
                "tema-" +
                falas[falaAtual].personagem
            );


            frase.classList.remove("sumindo");

        }, 1000);

    }


    setInterval(
        trocarFala,
        7000
    );

}



/* =====================================
   PLAYLIST PRINCIPAL
===================================== */

if (musica && botaoMusica) {

    const playlist = [

        {
            nome:
                "The Duo",

            arquivo:
                "Assets/The_duo.wav"
        },

        {
            nome:
                "Double Danger",

            arquivo:
                "Assets/Double_Danger.wav"
        }

    ];


    let musicaAtual = 0;


    musica.volume = 0.75;


    function carregarMusica() {

        musica.src =
            playlist[musicaAtual].arquivo;


        atualizarBotao();

    }


    function atualizarBotao() {

        const nome =
            playlist[musicaAtual].nome;


        if (musica.paused) {

            botaoMusica.textContent =
                "▶ " + nome;

        }

        else {

            botaoMusica.textContent =
                "❚❚ " + nome;

        }

    }


    botaoMusica.addEventListener(
        "click",
        () => {

            if (musica.paused) {

                musica.play();

            }

            else {

                musica.pause();

            }


            atualizarBotao();

        }
    );


    musica.addEventListener(
        "ended",
        () => {

            musicaAtual++;


            if (musicaAtual >= playlist.length) {

                musicaAtual = 0;

            }


            carregarMusica();

            musica.play();

            atualizarBotao();

        }
    );


    carregarMusica();

}



/* =====================================
   LUZ DO MOUSE
===================================== */

if (cursorGlow) {

    document.addEventListener(
        "pointermove",
        (evento) => {

            cursorGlow.style.left =
                evento.clientX + "px";


            cursorGlow.style.top =
                evento.clientY + "px";

        }
    );

}



/* =====================================
   TEMA DO NIGHTMARE
===================================== */

const vazio =
    document.getElementById("musica-vazio");


const botaoVazio =
    document.getElementById("botao-vazio");


if (vazio && botaoVazio) {

    vazio.volume = 0.75;


    botaoVazio.addEventListener(
        "click",
        () => {

            if (vazio.paused) {

                vazio.play();

                botaoVazio.textContent =
                    "❚❚ PAUSAR VAZIO";

            }

            else {

                vazio.pause();

                botaoVazio.textContent =
                    "▶ OUVIR VAZIO";

            }

        }
    );


    vazio.addEventListener(
        "ended",
        () => {

            botaoVazio.textContent =
                "▶ OUVIR VAZIO";

        }
    );

}