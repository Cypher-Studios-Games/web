// IMPORTS //

import { auth, db, ref, update, increment, set, get, signOut } from '/scripts/firebase.js';



// VARIABLES //

var clk = 0;
var cps = 0;
var tck = 0;
var flo = 0;
var cre = 0;
var mny = 0;

var currency = 0;
var currencyList = ["CLK", "TCK", "FLO", "CRE", "MNY"];
var currencyColor = ["rgb(231,231,231)", "yellow", "#2279dcff", "#685C8A", "green"];

var gnrAmt = 0;
var bstAmt = 0;
var cnvAmt = 0;
var ampAmt = 0;

var gnrPrice = 10;
var bstPrice = 250;
var cnvPrice = 5000;
var ampPrice = 1;
var gnrSell = 5;
var bstSell = 125;
var cnvSell = 2500;
var ampSell = 0.5;

var tradeRates = {
  "CLK_TCK": 0.001,
  "CLK_FLO": 0.002,
  "FLO_TCK": 0.1,
  "FLO_CRE": 0.04,
  "TCK_CRE": 0.01,
  "CRE_FLO": 15,
  "CRE_TCK": 40,
  "CRE_MNY": 0.04
};

var time = 600;

// ELEMENTS //

  // Text

    // Main Text
var curTxt = document.getElementById("clk-value");
var cpsTxt = document.getElementById("cps-value");

    // Shop Text
var gnrPriceTxt = document.getElementById("gnr-price");
var gnrOwnedTxt = document.getElementById("gnr-owned");
var bstPriceTxt = document.getElementById("bst-price");
var bstOwnedTxt = document.getElementById("bst-owned");
var cnvPriceTxt = document.getElementById("cnv-price");
var cnvOwnedTxt = document.getElementById("cnv-owned");
var ampPriceTxt = document.getElementById("amp-price");
var ampOwnedTxt = document.getElementById("amp-owned");

    // Trade Text/Textbox
var tradeCur1Txt = document.getElementById("trade-cur1");
var tradeCur2Txt = document.getElementById("trade-cur2");

  // Buttons

    // Main Button
var button = document.getElementById("button");

    // Shop Buttons
var gnrBuyButton = document.getElementById("gnr-buy-btn");
var gnrSellButton = document.getElementById("gnr-sell-btn");
var bstBuyButton = document.getElementById("bst-buy-btn");
var bstSellButton = document.getElementById("bst-sell-btn");
var cnvBuyButton = document.getElementById("cnv-buy-btn");
var cnvSellButton = document.getElementById("cnv-sell-btn");
var ampBuyButton = document.getElementById("amp-buy-btn");
var ampSellButton = document.getElementById("amp-sell-btn");

    // Trade Buttons
var tradeExecButton = document.getElementById("trade-exec-btn");

    // Menu Buttons
var tradeMenuButton = document.getElementById("trade-button");
var shopMenuButton = document.getElementById("shop-button");
var youMenuButton = document.getElementById("you-button");
var optionsMenuButton = document.getElementById("options-button");
var aboutMenuButton = document.getElementById("about-button");

  // Other

    // Select Menus
var tradeCur1Slct = document.getElementById("trade-cur1-slct");
var tradeCur2Slct = document.getElementById("trade-cur2-slct");

// FUNCTIONS //

function keyPress(event) {
  if (event.key == "ArrowLeft") {
    currency -= 1;
    if (currency < 0) {
      currency = 4;
    }
    curTxt.innerHTML = Math.round(getCurrencyValue(currency)) + " " + currencyList[currency];
    curTxt.style.color = currencyColor[currency];
  }
  if (event.key == "ArrowRight") {
    currency += 1;
    if (currency > 4) {
      currency = 0;
    }
    curTxt.innerHTML = Math.round(getCurrencyValue(currency)) + " " + currencyList[currency];
    curTxt.style.color = currencyColor[currency];
  }
  return event.key;
}

function roundTo(num, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

function add(currency, amt) {
  currency = currency + amt;
}

function getCurrencyValue(index) {
  switch (index) {
    case 0: return clk;
    case 1: return tck;
    case 2: return flo;
    case 3: return cre;
    case 4: return mny;
  }
}

async function loadFromCloud() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        // We only fetch the saveString to keep the data transfer light
        const snapshot = await get(ref(db, 'users/' + user.uid + '/clickrSave'));
        
        if (snapshot.exists()) {
            const encodedData = snapshot.val();
            const decodedData = JSON.parse(atob(encodedData));

            // Apply variables to your game
            clk = decodedData.clk;
            tck = decodedData.tck;
            flo = decodedData.flo;
            cre = decodedData.cre;
            mny = decodedData.mny;
            gnrAmt = decodedData.gnrAmt;
            bstAmt = decodedData.bstAmt;
            cnvAmt = decodedData.cnvAmt;
            ampAmt = decodedData.ampAmt;
            gnrPrice = decodedData.gnrPrice;
            bstPrice = decodedData.bstPrice;
            cnvPrice = decodedData.cnvPrice;
            ampPrice = decodedData.ampPrice;
            currency = decodedData.currency;

            updateUI(); // Function to refresh your text elements
            console.log("Cloud Save Loaded successfully.");
        }
    } catch (error) {
        console.error("Cloud Load Error:", error);
    }
}

function updateUI() {
  curTxt.innerHTML = roundTo(getCurrencyValue(currency), 3) + " " + currencyList[currency];
  curTxt.style.color = currencyColor[currency];
  cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
  gnrPriceTxt.innerHTML = roundTo(gnrPrice, 0);
  gnrOwnedTxt.innerHTML = roundTo(gnrAmt, 0);
  bstPriceTxt.innerHTML = roundTo(bstPrice, 0);
  bstOwnedTxt.innerHTML = roundTo(bstAmt, 0);
  cnvPriceTxt.innerHTML = roundTo(cnvPrice, 0);
  cnvOwnedTxt.innerHTML = roundTo(cnvAmt, 0);
  ampPriceTxt.innerHTML = roundTo(ampPrice, 0);
  ampOwnedTxt.innerHTML = roundTo(ampAmt, 0);
  document.getElementById("you-clk").innerHTML = roundTo(clk, 0);
  document.getElementById("you-tck").innerHTML = roundTo(tck, 3);
  document.getElementById("you-flo").innerHTML = roundTo(flo, 2);
  document.getElementById("you-cre").innerHTML = roundTo(cre, 2);
  document.getElementById("you-mny").innerHTML = roundTo(mny, 2);
  document.getElementById("you-gnr").innerHTML = roundTo(gnrAmt, 0);
  document.getElementById("you-bst").innerHTML = roundTo(bstAmt, 0);
  document.getElementById("you-cnv").innerHTML = roundTo(cnvAmt, 0);
  document.getElementById("you-amp").innerHTML = roundTo(ampAmt, 0);
  document.getElementById("total-worth").innerHTML = "$" +roundTo(((clk * 0.0000032) + (tck * 0.0004) + (flo * 0.0016) + (cre * 0.04) + mny + findUpgradeWorth(gnrAmt, 15, 1.15, 0.0000032) + findUpgradeWorth(bstAmt, 250, 1.15, 0.0000032) + findUpgradeWorth(cnvAmt, 5000, 1.15, 0.0000032) + findUpgradeWorth(ampAmt, 1, 1.15, 0.04)), 2);
}

function findUpgradeWorth(amt, basePrice, priceMultiplier, currencyWorth) {
  var total = 0;
  for (let i = 0; i < amt; i++) {
    total += basePrice;
    basePrice *= priceMultiplier;
  }
  return total * currencyWorth;
}

// EVENT LISTENERS //

  // Basic
button.addEventListener("pointerdown", () => {
  clk += 1;
  if (currency == 0) {
    curTxt.innerHTML = roundTo(clk, 0) + " CLK";
  }
});
document.addEventListener('keydown', keyPress);

  // Menu
shopMenuButton.addEventListener("pointerdown", () => {
  document.getElementById("shop-div").style.display = "block";
  document.getElementById("trade-div").style.display = "none";
  document.getElementById("you-div").style.display = "none";
  document.getElementById("options-div").style.display = "none";
  document.getElementById("about-div").style.display = "none";
});
tradeMenuButton.addEventListener("pointerdown", () => {
  document.getElementById("shop-div").style.display = "none";
  document.getElementById("trade-div").style.display = "block";
  document.getElementById("you-div").style.display = "none";
  document.getElementById("options-div").style.display = "none";
  document.getElementById("about-div").style.display = "none";
});
youMenuButton.addEventListener("pointerdown", () => {
  document.getElementById("shop-div").style.display = "none";
  document.getElementById("trade-div").style.display = "none";
  document.getElementById("you-div").style.display = "block";
  document.getElementById("options-div").style.display = "none";
  document.getElementById("about-div").style.display = "none";
});
optionsMenuButton.addEventListener("pointerdown", () => {
  document.getElementById("shop-div").style.display = "none";
  document.getElementById("trade-div").style.display = "none";
  document.getElementById("you-div").style.display = "none";
  document.getElementById("options-div").style.display = "block";
  document.getElementById("about-div").style.display = "none";
});
aboutMenuButton.addEventListener("pointerdown", () => {
  document.getElementById("shop-div").style.display = "none";
  document.getElementById("trade-div").style.display = "none";
  document.getElementById("you-div").style.display = "none";
  document.getElementById("options-div").style.display = "none";
  document.getElementById("about-div").style.display = "block";
});

  // Shop
gnrBuyButton.addEventListener("pointerdown", () => {
  console.log("event works");
  if (gnrPrice <= clk) {
    console.log("working");
    gnrAmt += 1;
    clk -= gnrPrice;
    gnrPrice *= 1.15
    console.log(gnrPrice);
    if (currency == 0) {
      curTxt.innerHTML = roundTo(clk, 0) + " CLK";
    }
    cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
    gnrPriceTxt.innerHTML = roundTo(gnrPrice, 0);
    gnrOwnedTxt.innerHTML = roundTo(gnrAmt, 0);
  } else {
    alert("Not enough CLK to buy Generator!");
  }
});
gnrSellButton.addEventListener("pointerdown", () => {
  if (gnrAmt >= 1) {
    gnrAmt -= 1;
    clk += gnrSell;
    gnrPrice /= 1.15
    cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
  }
});
bstBuyButton.addEventListener("pointerdown", () => {
  console.log("event works");
  if (bstPrice <= clk) {
    console.log("working");
    bstAmt += 1;
    clk -= bstPrice;
    bstPrice *= 1.15
    console.log(bstPrice);
    if (currency == 0) {
      curTxt.innerHTML = roundTo(clk, 0) + " CLK";
    }
    cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
    bstPriceTxt.innerHTML = roundTo(bstPrice, 0);
    bstOwnedTxt.innerHTML = roundTo(bstAmt, 0);
  } else {
    alert("Not enough CLK to buy Booster!");
  }
});
bstSellButton.addEventListener("pointerdown", () => {
  if (bstAmt >= 1) {
    bstAmt -= 1;
    clk += bstSell;
    bstPrice /= 1.15
    cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
  }
});
cnvBuyButton.addEventListener("pointerdown", () => {
  console.log("event works");
  if (cnvPrice <= clk) {
    console.log("working");
    cnvAmt += 1;
    clk -= cnvPrice;
    cnvPrice *= 1.15
    console.log(cnvPrice);
    if (currency == 0) {
      curTxt.innerHTML = roundTo(clk, 0) + " CLK";
    }
    cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
    cnvPriceTxt.innerHTML = roundTo(cnvPrice, 0);
    cnvOwnedTxt.innerHTML = roundTo(cnvAmt, 0);
  } else {
    alert("Not enough CLK to buy Converter!");
  }
});
cnvSellButton.addEventListener("pointerdown", () => {
  if (cnvAmt >= 1) {
    cnvAmt -= 1;
    clk += cnvSell;
    cnvPrice /= 1.15
    cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
  }
});
ampBuyButton.addEventListener("pointerdown", () => {
  if (ampPrice <= cre) {
    console.log("working");
    ampAmt += 1;
    cre -= ampPrice;
    ampPrice *= 1.15
    console.log(ampPrice);
    if (currency == 3) {
      curTxt.innerHTML = roundTo(cre, 0) + " CRE";
    }
    cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
    ampPriceTxt.innerHTML = roundTo(ampPrice, 0);
    ampOwnedTxt.innerHTML = roundTo(ampAmt, 0);
  } else {
    alert("Not enough CRE to buy Amplifier!");
  }
});
ampSellButton.addEventListener("pointerdown", () => {
  if (ampAmt >= 1) {
    ampAmt -= 1;
    cre += ampSell;
    ampPrice /= 1.15
    cpsTxt.innerHTML = roundTo(((gnrAmt * ((bstAmt / 2) + 1)) * 2), 1) + " CLK/s";
  }
});

  // Trade
tradeExecButton.addEventListener("pointerdown", () => {
  const from = tradeCur1Slct.value;
  const to = tradeCur2Slct.value;
  const key = from + "_" + to;

  console.log("trade exec clicked");
  console.log('from:', from, 'to:', to);
  console.log('key:', key);

  if (key in tradeRates) {
    console.log("Valid trade: " + key);
    let rate = tradeRates[key];

    let fromValue = tradeCur1Txt.value;
    let toValue = getCurrencyValue(["CLK", "TCK", "FLO", "CRE", "MNY"].indexOf(to));
    console.log(rate, fromValue, toValue);

    if (fromValue > 0 && fromValue <= getCurrencyValue(["CLK", "TCK", "FLO", "CRE", "MNY"].indexOf(from))) {
      let amountToTrade = fromValue * rate;
      // Deduct from 'from' currency
      switch (from) {
        case "CLK": clk -= fromValue; break;
        case "TCK": tck -= fromValue; break;
        case "FLO": flo -= fromValue; break;
        case "CRE": cre -= fromValue; break;
        case "MNY": mny -= fromValue; break;
      }
      // Add to 'to' currency
      switch (to) {
        case "CLK": clk += amountToTrade; break;
        case "TCK": tck += amountToTrade; break;
        case "FLO": flo += amountToTrade; break;
        case "CRE": cre += amountToTrade; break;
        case "MNY": mny += amountToTrade; break;
      }
      console.log(`Traded ${fromValue} ${from} for ${amountToTrade} ${to}`);
      // Update display if current currency is involved
      if (currencyList.indexOf(from) === currency) {
        curTxt.innerHTML = roundTo(getCurrencyValue(currency), 3) + " " + from;
      }
      if (currencyList.indexOf(to) === currency) {
        curTxt.innerHTML = roundTo(getCurrencyValue(currency), 3) + " " + to;
      }
    } else {
      alert("Not enough " + from + " to trade!");
    }
  } else {
    alert("Invalid trade!");
  }
});

// INTERVALS //

setInterval(function () {
  time = time - 1;
  document.getElementById("timeUntilSave").innerHTML = roundTo(time / 10, 0);

  // TCK GENERATION
  tck = tck + ((1 / 600) * (ampAmt + 1));
  if (currency == 1) {
    curTxt.innerHTML = roundTo(tck, 3) + " TCK";
  }

  // CLK GENERATION
  clk = clk + (((gnrAmt * ((bstAmt / 2) + 1)) * (ampAmt + 1)) / 10);
  if (currency == 0) {
    curTxt.innerHTML = roundTo(clk, 0) + " CLK";
  }

  // FLO GENERATION
  if (gnrAmt > 0 && cnvAmt > 0) {
    flo = flo + (((cnvAmt / (gnrAmt * ((bstAmt / 2) + 1))) / 10) * (ampAmt + 1));
  }
  if (currency == 2) {
    curTxt.innerHTML = roundTo(flo, 2) + " FLO";
  }

  // TRADE RATE DISPLAY
  if (document.getElementById("trade-div").style.display == "block") {
    const key = tradeCur1Slct.value + "_" + tradeCur2Slct.value;
    if (tradeCur1Txt.value > 0 && tradeCur1Txt.value != "" && key in tradeRates) {
      tradeCur2Txt.innerHTML = roundTo(tradeCur1Txt.value * tradeRates[tradeCur1Slct.value + "_" + tradeCur2Slct.value], 4);
    } else {
      tradeCur2Txt.innerHTML = "Invalid trade."
    }
  }

  if (document.getElementById("you-div").style.display == "block") {
    document.getElementById("you-clk").innerHTML = roundTo(clk, 0);
    document.getElementById("you-tck").innerHTML = roundTo(tck, 3);
    document.getElementById("you-flo").innerHTML = roundTo(flo, 2);
    document.getElementById("you-cre").innerHTML = roundTo(cre, 2);
    document.getElementById("you-mny").innerHTML = roundTo(mny, 2);
    document.getElementById("you-gnr").innerHTML = roundTo(gnrAmt, 0);
    document.getElementById("you-bst").innerHTML = roundTo(bstAmt, 0);
    document.getElementById("you-cnv").innerHTML = roundTo(cnvAmt, 0);
    document.getElementById("you-amp").innerHTML = roundTo(ampAmt, 0);
    document.getElementById("total-worth").innerHTML = "$" +roundTo(((clk * 0.0000032) + (tck * 0.0004) + (flo * 0.0016) + (cre * 0.04) + mny + findUpgradeWorth(gnrAmt, 15, 1.15, 0.0000032) + findUpgradeWorth(bstAmt, 250, 1.15, 0.0000032) + findUpgradeWorth(cnvAmt, 5000, 1.15, 0.0000032) + findUpgradeWorth(ampAmt, 1, 1.15, 0.04)), 2);
  }
}, 100);

setInterval(async function () {
  time = 600;
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save!");
    return;
  }

  const gameData = {
    clk, cps, tck, flo, cre, mny,
    gnrAmt, bstAmt, cnvAmt, ampAmt,
    gnrPrice, bstPrice, cnvPrice, ampPrice,
    currency
  };
    
  // Convert object to JSON string, then to Base64
  const saveCode = btoa(JSON.stringify(gameData));

  const snapshot = await get(ref(db, 'users/' + user.uid));

  const data = snapshot.val();

  try {
    if (!data.clickrSave) {
        console.log("New player detected (no save found). Sending email");
        
        emailjs.send("cypherstudios-gmail", "cypherstudios-trustpilot", {
          to_email: user.email,
          customer_name: user.username || "Player"
      });
    }

    // Save to Firebase Realtime Database under 'users/USER_ID'
    await update(ref(db, 'users/' + user.uid), {
      clickrSave: saveCode,
      updatedAt: Date.now(),
      timePlayed: increment(1),
      points: increment(0.1)
    });

    console.log("Cloud Save Successful");

  } catch (error) {
    console.error("Cloud Save Error:", error);
    alert("Failed to save to cloud.");
  }
}, 60000);

// This listener runs automatically as soon as the page loads 
// and Firebase finishes checking the login status.
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log("User detected:", user.uid);
        console.log("Attempting to auto-load save data...");
        
        // Run your load function
        await loadFromCloud();
        
        // After loading, ensure the UI shows the new values
        updateUI(); 
    } else {
        alert("You are not logged in. Please log in to load and save your game data.");
        console.log("No user is signed in.");
    }
});