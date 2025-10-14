const display = document.getElementById("display")
const drumKit = {
    Q: { name: "Heater 1", sound: "Heater-1.mp3" },
    W: { name: "Heater 2", sound: "Heater-2.mp3" },
    E: { name: "Heater 3", sound: "Heater-3.mp3" },
    A: { name: "Heater 4", sound: "Heater-4_1.mp3" },
    S: { name: "Clap", sound: "Heater-6.mp3" },
    D: { name: "Open-HH", sound: "Dsc_0h.mp3" },
    Z: { name: "Kick-n-Hat", sound: "Kick_n_Hat.mp3" },
    X: { name: "Kick", sound: "RP4_KICK_1.mp3" },
    C: { name: "Closed-HH", sound: "Cev_H2.mp3" }
};


function playAudio(drumpad) {
    
    const audio = drumpad.querySelector(".clip");
    if(audio) {
        drumpad.classList.add('active');
        audio.currentTime = 0;
        audio.play();
        display.textContent = drumKit[`${drumpad.innerText}`].name;
         setTimeout(() => {
            drumpad.classList.remove('active');
        }, 100);
    }
}

const drumPads = document.querySelectorAll(".drum-pad");

drumPads.forEach(pad => {
    pad.addEventListener("click", function() {        
        playAudio(pad);    
    })
});

document.addEventListener('keydown', function(event) {
  const key = event.key.toUpperCase();
  const drumPad = document.querySelector(`.drum-pad:has(#${key})`);
  
  if (drumPad) {
    
    playAudio(drumPad);
   
  }
});