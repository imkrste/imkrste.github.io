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

const valueMap = {
    'PENNY': 0.01,
    'NICKEL': 0.05,
    'DIME': 0.10,
    'QUARTER': 0.25,
    'ONE': 1,
    'FIVE': 5,
    'TEN': 10,
    'TWENTY': 20,
    'ONE HUNDRED': 100
  };

const cidReplaced = () => cid.map(([name, amount]) => [valueMap[name], amount]);


const cashInput = document.getElementById("cash");
const buyBtn = document.getElementById("purchase-btn")
const changeElement = document.getElementById("change-due")

const totalcidCalc = () => cidReplaced().reduce((sum, item) => sum + item[1], 0);


buyBtn.addEventListener("click", () => {    
    const replaced = cidReplaced()
    const cash = parseFloat(cashInput.value);
    const totalcid = totalcidCalc();
    let change = cash - price;

    if(cash < price) {
        alert("Customer does not have enough money to purchase the item");
    }

    else if(cash === price) {
        changeElement.innerHTML = "No change due - customer paid with exact cash";        
    }

    else if(cash > price && change > totalcid ) {
        changeElement.innerHTML = "Status: INSUFFICIENT_FUNDS";    
    }

    else if(cash > price && change <= totalcid) {
        let changeDue = change;
        let changeArr = [];
        let remainingCid = replaced.map(arr => [...arr]);

        for (let i = replaced.length - 1; i >= 0; i--) {    
            let denomValue = replaced[i][0];    
            let denomAmount = replaced[i][1];
            let amountToGive = 0;
        while (changeDue >= denomValue && denomAmount >= denomValue) {
            changeDue = (changeDue - denomValue + 0.00001); 
            denomAmount -= denomValue;
            amountToGive += denomValue;
            changeDue = Math.round(changeDue * 100) / 100;
            denomAmount = Math.round(denomAmount * 100) / 100;
    }
        if (amountToGive > 0) {
            let denomName = cid[i][0];
            changeArr.push([denomName, amountToGive]);
            remainingCid[i][1] = denomAmount;
            
    }
}

        if (changeDue > 0) {
    changeElement.innerHTML = "Status: INSUFFICIENT_FUNDS";

}       else  {
            let status = remainingCid.reduce((sum, arr) => sum + arr[1], 0) === 0 ? "CLOSED" : "OPEN";
            let result = `Status: ${status}`;
            changeArr.forEach(([denomName, amount]) => {
            result += ` ${denomName}: $${amount}`;
            });
            changeElement.innerHTML = result;
}
        
    }    

    
})