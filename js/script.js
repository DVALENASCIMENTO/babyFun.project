document.addEventListener("DOMContentLoaded", function() {
    const letras = ["A", "E", "I", "O", "U", "B", "D", "M", "P", "T"];
    const numeros = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    let currentSet = [];
    let currentIndex = 0;
    let audioStarted = false; // Variável para rastrear se o áudio de fundo já foi iniciado

    const contentDiv = document.getElementById("content");
    const nextButton = document.getElementById("nextButton");

    document.getElementById("letrasButton").addEventListener("click", function() {
        currentSet = letras;
        currentIndex = 0;
        loadLetterOrNumber(); 
    });

    document.getElementById("numerosButton").addEventListener("click", function() {
        currentSet = numeros;
        currentIndex = 0;
        loadLetterOrNumber(); 
    });

    nextButton.addEventListener("click", function() {
        currentIndex++;
        if (currentIndex < currentSet.length) {
            loadLetterOrNumber();
        } else {
            contentDiv.innerHTML = "<h2>Parabéns! Você completou todas as opções!</h2>";
            nextButton.classList.add("hidden");
        }
    });

    // Adiciona um evento de clique global para iniciar o som de fundo
    document.addEventListener("click", function() {
        if (!audioStarted) {
            playBackgroundSound();
            audioStarted = true; // Marca que o áudio de fundo foi iniciado
        }
    });

    function loadLetterOrNumber() {
        const currentLetterOrNumber = currentSet[currentIndex];
        const options = generateOptions(currentLetterOrNumber);
        
        contentDiv.innerHTML = `
            <h2><span class="highlight">${currentLetterOrNumber}</span></h2>
            <div class="options">
                ${options.map(option => `<button class="optionButton">${option}</button>`).join("")}
            </div>
        `;

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
            button.classList.add("correct-answer");
            playSound("correct", 0.2);
            setTimeout(() => {
                playSound(`audio-${correctOption.toLowerCase()}`, 1.0);
                resetButtons();
            }, 1000);
        } else {
            playSound("incorrect", 0.5);
            button.classList.add("incorrect-answer");
        }
    }

    function playSound(sound, volume = 1.0) {
        const audio = new Audio(`sounds/${sound}.mp3`);
        audio.volume = volume;
        audio.play().catch(error => {
            console.error("Falha ao reproduzir áudio:", error);
        });
    }

    function resetButtons() {
        document.querySelectorAll(".optionButton").forEach(btn => {
            btn.disabled = false;
            btn.classList.remove("correct-answer", "incorrect-answer");
        });
    }

    function playBackgroundSound() {
        const backgroundAudio = new Audio('sounds/background.mp3');
        backgroundAudio.volume = 0.01;
        backgroundAudio.loop = false;
        backgroundAudio.play().catch(error => {
            console.error("Falha ao reproduzir o som de fundo:", error);
        });
    }
});
