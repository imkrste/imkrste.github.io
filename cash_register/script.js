let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];
const cashInput = document.getElementById("cash");
const buyBtn = document.getElementById("purchase-btn")
const changeElement = document.getElementById("change-due")

const totalcid = () => cid.reduce((sum, item) => sum + item[1], 0);


buyBtn.addEventListener("click", () => {    
    const cash = parseFloat(cashInput.value);
    totalcid();
    const change = cash - price;

    if(cash < price) {
        alert("Customer does not have enough money to purchase the item");
    }

    else if(cash === price) {
        changeElement.innerText = "No change due - customer paid with exact cash";
    }
    else if(cash > price && change > totalcid()) {
        changeElement.innerText = "Status: INSUFFICIENT_FUNDS";
    }

   

})