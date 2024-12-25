const input = document.getElementById("user-input");
const results = document.getElementById("results-div");
const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const phoneRegex = /^(?:1[-. ]?)?(?:\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkUserInput();
  }
});


const checkUserInput = () => {
    if(input.value === "") {
        window.alert("Please provide a phone number");
    }
    if(phoneRegex.test(input.value)) {
        results.innerText = "Valid US number: " + input.value;
    }

    else {
        results.innerText = "Invalid US number: " + input.value;
    }

};



const clearUserInput = () => {
     input.value = "";
     results.innerText = "";
    
};

checkBtn.addEventListener("click", checkUserInput);
clearBtn.addEventListener("click", clearUserInput);