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
            button.classList.add("correct-answer"); // Adiciona a classe para brilho
            playSound("correct", 0.2); // Volume reduzido para o som "correct"
            setTimeout(() => {
                playSound(`audio-${correctOption.toLowerCase()}`, 1.0); // Volume máximo para o som da letra/número
                resetButtons(); // Habilita novamente os botões após a resposta correta
            }, 1000); // Adiciona um atraso de 1 segundo para feedback visual
        } else {
            playSound("incorrect", 0.5); // Volume padrão para som incorreto
            button.classList.add("incorrect-answer"); // Adiciona uma classe para feedback incorreto
        }
    }

    function playSound(sound, volume = 3.0) {
        const audio = new Audio(`sounds/${sound}.mp3`);
        audio.volume = volume; // Define o volume do áudio
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

    // Função para baixar o volume do som de fundo
    function playBackgroundSound() {
        const backgroundAudio = new Audio('sounds/background.mp3');
        backgroundAudio.volume = 0.01; // Volume reduzido para o som de fundo
        backgroundAudio.loop = true; // Define para tocar em loop
        backgroundAudio.play().catch(error => {
            console.error("Falha ao reproduzir o som de fundo:", error);
        });
    }

    // Iniciar o som de fundo
    playBackgroundSound();
});
