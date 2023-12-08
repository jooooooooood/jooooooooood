        let animationRunning = false;
        // Create an audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        let noteNum = 0;
        let randomMult = 0;
        let randomValue = 0;
        const scale = [
    261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, // First octave
    1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00, 1975.53, 2093.00 // Second octave
];
        // Define a function to play a musical note
// Define a function to play a musical note with smooth fade in and fade out
    function playNote(note) {
        // Create an oscillator node
        const oscillator = audioContext.createOscillator();
    
        // Create a gain node for controlling the volume
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        // Connect the oscillator to the gain node
        oscillator.connect(gainNode);

        // Set the oscillator type (sine wave for a simple tone)
        oscillator.type = 'sine';

        // Set the frequency (adjust this for the desired note)
        oscillator.frequency.setValueAtTime(note, audioContext.currentTime); // A440 Hz
        if (noteNum == 14){
            noteNum = 0;
        }

    // Schedule the oscillator and gain node for smooth fade in and fade out
    const currentTime = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, currentTime); // Start with zero volume
    gainNode.gain.exponentialRampToValueAtTime(1, currentTime + 0.01); // Smooth fade in
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1); // Smooth fade out

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after a short duration (adjust as needed)
    oscillator.stop(audioContext.currentTime + 0.1); // Stop after 0.1 seconds
}


    // Function to initialize animation and note playing
    function startAnimation() {
        if (animationRunning) {
            // Stop the animation if it's already running
            animationRunning = false;
            return;
        }
        animationRunning = true;
        const balls = document.querySelectorAll(".ball"); // Select all ball elements
        const ballData = []; // Array to store ball information
        // Initialize ball data
        balls.forEach((ball, index) => {
            randomValue = Math.random();
            if (randomValue <= .5) {
                randomMult = 1;
            }
            else {
                randomMult = -1;
            }
            const x = Math.random() * (window.innerWidth - 200) + 100; // Random x between 100 and (window width - 100)
            const y = Math.random() * (window.innerHeight - 200) + 100; // Random y between 100 and (window height - 100)
            const xSpeed = (5 + (Math.random() * 3 )) * randomMult;
            const ySpeed = (5 + (Math.random() * 3)) * randomMult;
            const note = scale[noteNum++];
            
            ball.style.display = "block";
            ballData.push({ element: ball, x, y, xSpeed, ySpeed, note });
        });

        function animate() {
            if (!animationRunning) {
                ballData.forEach((ball) => {
                    ball.element.style.display = "none";
                })
            }
            ballData.forEach((ball) => {
                ball.x += ball.xSpeed;
                ball.y += ball.ySpeed;
                if (ball.x + 50 > window.innerWidth || ball.x < 0) {
                    ball.xSpeed = -ball.xSpeed;
                    if (ball.element.style.backgroundColor == "pink") {
                        ball.element.style.backgroundColor = "lightskyblue";
                    }
                    else {
                        ball.element.style.backgroundColor = "pink";
                    }

                    playNote(ball.note);
                }
                if (ball.y + 50 > window.innerHeight || ball.y < 75) {
                    ball.ySpeed = -ball.ySpeed;
                    if (ball.element.style.backgroundColor == "pink") {
                        ball.element.style.backgroundColor = "lightskyblue";
                    }
                    else {
                        ball.element.style.backgroundColor = "pink";
                    }
                    playNote(ball.note);
                }
                ball.element.style.left = ball.x + "px";
                ball.element.style.top = ball.y + "px";
            });

            if (animationRunning){
            requestAnimationFrame(animate);
            }
        }
        animate();
    }

    // Attach the startAnimation function to the "Start" button click event
    document.getElementById('startButton').addEventListener('click', startAnimation);
