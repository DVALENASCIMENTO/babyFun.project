document.addEventListener("DOMContentLoaded", function() {
    const letras = ["A", "E", "I", "O", "U", "B", "D", "M", "P", "T"];
    const numeros = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    let currentSet = [];
    let currentIndex = 0;

    const contentDiv = document.getElementById("content");
    const nextButton = document.getElementById("nextButton");

    document.getElementById("letrasButton").addEventListener("click", function() {
        currentSet = letras;
        currentIndex = 0;
        loadLetterOrNumber(true); // Indica que o áudio deve ser tocado
    });

    document.getElementById("numerosButton").addEventListener("click", function() {
        currentSet = numeros;
        currentIndex = 0;
        loadLetterOrNumber(true); // Indica que o áudio deve ser tocado
    });

    nextButton.addEventListener("click", function() {
        currentIndex++;
        if (currentIndex < currentSet.length) {
            loadLetterOrNumber(true); // Toca o áudio quando a próxima questão é carregada
        } else {
            contentDiv.innerHTML = "<h2>Parabéns! Você completou todas as opções!</h2>";
            nextButton.classList.add("hidden");
        }
    });

    function loadLetterOrNumber(playAudio = false) {
        const currentLetterOrNumber = currentSet[currentIndex];
        const options = generateOptions(currentLetterOrNumber);
        
        contentDiv.innerHTML = `
            <h2><span class="highlight">${currentLetterOrNumber}</span></h2>
            <div class="options">
                ${options.map(option => `<button class="optionButton">${option}</button>`).join("")}
            </div>
        `;

        if (playAudio) {
            playSound(`audio-${currentLetterOrNumber.toLowerCase()}`);
        }

        document.querySelectorAll(".optionButton").forEach(button => {
            button.addEventListener("click", function() {
                checkAnswer(this, currentLetterOrNumber);
            });
        });

        nextButton.classList.remove("hidden");
    }

    function generateOptions(correctOption) {
        let options = [correctOption];
        while (options.length < 4) {
            const randomOption = currentSet[Math.floor(Math.random() * currentSet.length)];
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }
        return options.sort(() => Math.random() - 0.5);
    }

    function checkAnswer(button, correctOption) {
        if (button.textContent === correctOption) {
            button.classList.add("correct-answer"); // Adiciona a classe para brilho
            playSound("correct");
            setTimeout(() => {
                playSound(`audio-${correctOption.toLowerCase()}`); // Toca o som correto
                resetButtons(); // Habilita novamente os botões após a resposta correta
            }, 1000); // Adiciona um atraso de 1 segundo
        } else {
            playSound("incorrect");
            button.classList.add("incorrect-answer"); // Adiciona uma classe para feedback incorreto
        }
    }

    function playSound(sound) {
        const audio = new Audio(`sounds/${sound}.mp3`);
        audio.play().catch(error => {
            console.error("Falha ao reproduzir áudio:", error);
        });
    }

    function resetButtons() {
        document.querySelectorAll(".optionButton").forEach(btn => {
            btn.disabled = false; // Reabilita todos os botões
            btn.classList.remove("correct-answer", "incorrect-answer"); // Remove qualquer classe de feedback
        });
    }
});
