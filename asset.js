
HOME_PRICE_MIN = 0;
HOME_PRICE_MAX = 400000;

DOWN_PAYMENT_MIN = 50;
DOWN_PAYMENT_MAX = 200000;

ARCH_CONTRIBUTION_MIN = 0;
ARCH_CONTRIBUTION_MAX = 150000;

ARCH_PERCENT_DOWN_MAX_NEW = 0.2;
ARCH_PERCENT_DOWN_MIN_NEW = 0.05;
TOTAL_DOWN_PAYMENT = 0.25;

MORTAGE_INSURANCE_PREMIUM = 0.04;
COMPOUNDING_PERIOD = 2;

HOUSE_PRICE_MAX = 1000000;
PERCENTAGE_HOME_TO_ARCH = 0.2;

ARCH_CLIENT_RATIO = 0.2;
STRESS_RATE = 0.0525;

M_REQUIRED_MIN = 200000;
DP_REQUIRED_1M = 0.2;

MINIMUM_REQUIRED_FOR_FIVEK = 25000;
DP_REQUIREMENT = 0.05;
DP_REQUIREMENT_ABOVE_500K = 0.1;

MONTHLY_PROPERTY_TAX = 412;
MONTHLY_UTILITIES = 200;

TARGET_GDS = 0.39;
TARGET_TDS = 0.44;

MORTAGE_INSURANCE_PREMIUM_0 = 0.04;
MORTAGE_INSURANCE_PREMIUM_1 = 0.031;
MORTAGE_INSURANCE_PREMIUM_2 = 0.028;
MORTAGE_INSURANCE_PREMIUM_3 = 0.024;

MAXIMUM_INCOME_FTHBI_METRO = 150000;
MAXIMUM_INCOME_FTHBI_CANADA = 120000;
MAXIMUM_DEBT_MULTIPLE_METRO = 4.5;
MAXIMUM_DEBT_MULTIPLE_CANADA = 4;
MINIMUM_DOWN = 0.05;
MAXIMUM_DP = 0.2;

NEW = 0.1;
EXISTING = 0.05;

const slider = document.getElementById("range1");
const slider1 = document.getElementById("range2");
const slider2 = document.getElementById("range3");
const interest = document.getElementById("mortage-interest");
const home = document.getElementById("home-price");
const down = document.getElementById("down-price");
const arch = document.getElementById("arch-price");
var month = document.getElementById("monthly-payments");
var debt = document.getElementById("mortage-debt");
var amort = document.getElementById("selectamort");
let C7 =
  parseFloat(
    $("#mortage-interest")
      .val()
      .replace("$", "")
      .replace(",", "")
      .replace(",", "")
  ) / 100;
let C6 = parseFloat(
  $("#mortage-debt").val().replace("$", "").replace(",", "").replace(",", "")
);

var gross_monthly_income,
  client_dp,
  compounding_rate,
  effective_rate,
  Qualifiying_rate,
  compounding_qualified_rate,
  effective_qualified_rate,
  debt_payment,
  maximum_mortage_gds,
  maximum_mortage_tds,
  maximum_monthly_mortage_gds,
  maximum_monthly_mortage_tds,
  arch_dp_max,
  down_payment_total,
  arch_percent_down,
  client_percent_down,
  mortage_percent,
  Monthly_payment_w_graph_new;


//output variables---main (with Arch)
var Maximum_purchase_price,
  mortgage,
  max_ARCH_contribution,
  Total_Mortage,
  Mortage_insurance = 0,
  Monthly_payment;
//output variables---main (without Arch)
var Maximum_purchase_price_w,
  mortgage_w,
  max_ARCH_contribution_w,
  Total_Mortage_w,
  Mortage_insurance_w = 0,
  Monthly_payment_w;

//Variable
client_dp = down.value;
compounding_rate = (
  (Math.pow(1 + C7 / COMPOUNDING_PERIOD, COMPOUNDING_PERIOD) - 1) *
  100
).toFixed(9);
effective_rate = (
  ((1 + compounding_rate / 100) ** (1 / 12) - 1) *
  12 *
  100
).toFixed(9);
Qualifiying_rate = Math.max(STRESS_RATE * 100, (C7 + 0.02) * 100);
compounding_qualified_rate = (
  (Math.pow(
    1 + Qualifiying_rate / 100 / COMPOUNDING_PERIOD,
    COMPOUNDING_PERIOD
  ) -
    1) *
  100
).toFixed(9);
effective_qualified_rate = (
  (Math.pow(1 + compounding_qualified_rate / 100, 1 / 12) - 1) *
  12 *
  100
).toFixed(9);
// console.log(effective_qualified_rate);
debt_payment = C6 > 0 ? Math.max(10, C6 * 0.03) : 0;

///My sectionnn!!!////
//only number function
function neww(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode == 46) {
    if (evt.target.value.indexOf(".") !== -1) {
      return false;
    } else {
      return true;
    }
  }

  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }

  return true;
}

slider.addEventListener("input", function () {
  $("#home-price").val(numeral(slider.value).format("$0,0"));
  gross_monthly_income = slider.value;
  calculateMortgage();
});

slider1.addEventListener("input", function () {
  $("#down-price").val(numeral(slider1.value).format("$0,0"));
  client_dp = slider1.value;
  calculateMortgage();
});

slider2.addEventListener("input", function () {
  $("#arch-price").val(numeral(slider2.value).format("$0,0"));
  calculateMortgage();
});

interest.addEventListener("change", function () {
  if (interest.value.indexOf("%") !== -1) {
    interest.value = $("#mortage-interest")
      .val()
      .replace("%", "")
      .replace(",", "")
      .replace(",", "");
  }
  var p = interest.value / 100;
  compounding_rate = (
    parseFloat(Math.pow(1 + p / COMPOUNDING_PERIOD, COMPOUNDING_PERIOD) - 1) *
    100
  ).toFixed(9);
  effective_rate = (
    ((1 + compounding_rate / 100) ** (1 / 12) - 1) *
    12 *
    100
  ).toFixed(9);
  Qualifiying_rate = Math.max(STRESS_RATE * 100, (p + 0.02) * 100);
  compounding_qualified_rate = (
    (Math.pow(
      1 + Qualifiying_rate / 100 / COMPOUNDING_PERIOD,
      COMPOUNDING_PERIOD
    ) -
      1) *
    100
  ).toFixed(9);
  effective_qualified_rate = (
    (Math.pow(1 + compounding_qualified_rate / 100, 1 / 12) - 1) *
    12 *
    100
  ).toFixed(9);

  if (interest.value.indexOf("%") !== -1) {
    return;
  }
  interest.value = interest.value + "%";
  calculateMortgage();
});

//slider / input
//home price

home.addEventListener("change", function () {
  var home1 = parseInt(
    $("#home-price").val().replace("$", "").replace(",", "").replace(",", "")
  );

  home1 = Math.min(HOME_PRICE_MAX, home1);
  home1 = Math.max(HOME_PRICE_MIN, home1);

  slider.value = home1;
  gross_monthly_income = home1 / 12;

  $("#home-price").val(numeral(home1).format("$0,0"));
});

//down payment

down.addEventListener("change", function () {
  var down1 = parseInt(
    $("#down-price").val().replace("$", "").replace(",", "").replace(",", "")
  );

  down1 = Math.min(DOWN_PAYMENT_MAX, down1);
  down1 = Math.max(DOWN_PAYMENT_MIN, down1);

  slider1.value = down1;
  client_dp = down1;

  $("#down-price").val(numeral(down1).format("$0,0"));
  calculateMortgage();
});

//Arch contribtion

arch.addEventListener("change", function () {
  var arch1 = parseInt(
    $("#arch-price").val().replace("$", "").replace(",", "").replace(",", "")
  );

  arch1 = Math.min(ARCH_CONTRIBUTION_MAX, arch1);
  arch1 = Math.max(ARCH_CONTRIBUTION_MIN, arch1);

  slider2.value = arch1;
  $("#arch-price").val(numeral(arch1).format("$0,0"));
  calculateMortgage();
});

month.addEventListener("input", function () {
  $("#monthly-payments").val(numeral(month.value).format("$0,0"));
  calculateMortgage();

});
debt.addEventListener("change", function () {
  let r = $("#mortage-debt")
    .val()
    .replace("$", "")
    .replace(",", "")
    .replace(",", "");

  debt_payment = r > 0 ? Math.max(10, r * 0.03) : 0;
  // console.log("debt here:    " + debt_payment);
  $("#mortage-debt").val(numeral(debt.value).format("$0,0"));
  calculateMortgage();
});


//maximum mortage gds
function calculateMortgage() {
  var amort = parseInt(document.getElementById("selectamort").value);

  var month = parseInt(
    $("#monthly-payments")
      .val()
      .replace("$", "")
      .replace(",", "")
      .replace(",", "")
  );
  var home1 = parseInt(
    $("#home-price").val().replace("$", "").replace(",", "").replace(",", "")
  );
  var downn = parseInt(
    $("#down-price").val().replace("$", "").replace(",", "").replace(",", "")
  );

  let N2 = (home1 / 12).toFixed(2);
  let eff = (effective_qualified_rate / 100);
  let effective = effective_rate / 100;
  // console.log(eff/12);
  maximum_mortage_gds = cal_mort(N2, eff, amort);

  maximum_mortage_tds = (
    (TARGET_TDS * N2 -
      MONTHLY_PROPERTY_TAX -
      MONTHLY_UTILITIES -
      month -
      debt_payment) /
    (((eff / 12) * Math.pow(1 + eff / 12, amort * 12)) /
      (Math.pow(1 + eff / 12, amort * 12) - 1))
  ).toFixed(2);

  maximum_monthly_mortage_gds =
    TARGET_GDS * N2 - MONTHLY_PROPERTY_TAX - MONTHLY_UTILITIES;
  maximum_monthly_mortage_tds =
    TARGET_TDS * N2 - month - MONTHLY_PROPERTY_TAX - MONTHLY_UTILITIES;

  if (window.event.target.id == "arch-price" || window.event.target.id == "range3"
  || window.event.target.id == "arrow-down3" || window.event.target.id == "arrow-up3") {
    arch_dp_max = parseInt(
      $("#arch-price").val().replace("$", "").replace(",", "").replace(",", ""));
  }
  else {
    arch_dp_max = Math.min((downn / ARCH_PERCENT_DOWN_MIN_NEW) * ARCH_PERCENT_DOWN_MAX_NEW,
      (Math.max(maximum_mortage_gds, 0) + downn) / (1 - ARCH_PERCENT_DOWN_MAX_NEW) * ARCH_PERCENT_DOWN_MAX_NEW,
      (Math.max(maximum_mortage_tds, 0) + downn) / (1 - ARCH_PERCENT_DOWN_MAX_NEW) * ARCH_PERCENT_DOWN_MAX_NEW,
      ARCH_CONTRIBUTION_MAX);
  }




  // ARCH_PERCENT_DOWN_MAX_NEW = 0.2;
  // ARCH_PERCENT_DOWN_MIN_NEW = 0.05;


  down_payment_total = downn + Number(arch_dp_max);

  console.log(arch_dp_max, downn);
  // console.log("ARCH-DP-MAX:  "+arch_dp_max
  // ,
  // "\n Maximumg gds: "+maximum_mortage_gds,
  // "\n Maximum tds:   "+maximum_mortage_tds);

  Maximum_purchase_price = calculateMaxPurchase(
    amort,
    downn,
    down_payment_total,
    maximum_mortage_gds,
    maximum_mortage_tds
  );
  Maximum_purchase_price_w = calculateMaxPurchase_w(
    amort,
    downn,
    maximum_mortage_gds,
    maximum_mortage_tds
  );

  arch_percent_down = ((arch_dp_max / Maximum_purchase_price) * 100).toFixed(2);
  client_percent_down = ((downn / Maximum_purchase_price) * 100).toFixed(2);
  mortage_percent = ((mortgage / Maximum_purchase_price) * 100).toFixed(2);

  document.getElementById("r1").textContent = client_percent_down + "%";
  document.getElementById("r2").textContent = arch_percent_down + "%";

  Mortage_insurance = cal_premium(arch_percent_down, client_percent_down,
    downn, Maximum_purchase_price, arch_dp_max);

  Mortage_insurance_w = cal_premium_w(downn, Maximum_purchase_price_w);



  bar1([
    ['With Arch ', Maximum_purchase_price.toFixed(0)],
    ['Without Arch ', Maximum_purchase_price_w.toFixed(0)]
  ]);


  //With Arch
  if (Maximum_purchase_price == 0 || Maximum_purchase_price == NaN) {
    mortgage = 0;
    max_ARCH_contribution = 0;
    Total_Mortage = 0;
    Monthly_payment = 0;
  }
  else {

    mortgage = Math.max(Maximum_purchase_price - downn - arch_dp_max);
    max_ARCH_contribution = arch_dp_max;
    Total_Mortage = mortgage + Mortage_insurance;
    Monthly_payment =
      (((parseFloat(effective) / 12) * (1 + parseFloat(effective) / 12) ** (Number(amort) * 12)) /
        ((1 + parseFloat(effective) / 12) ** (Number(amort) * 12) - 1)) *
      Total_Mortage;
  }

  // without Arch
  mortgage_w = Maximum_purchase_price_w - downn;
  Total_Mortage_w = mortgage_w + Mortage_insurance_w;
  Monthly_payment_w =
    (((parseFloat(effective) / 12) * (1 + parseFloat(effective) / 12) ** (Number(amort) * 12)) /
      ((1 + parseFloat(effective) / 12) ** (Number(amort) * 12) - 1)) *
    Total_Mortage_w;



  //Graph monthly payment without Arch ---->
  // Monthly_payment_w_graph_new 

  var payment_calculation = Maximum_purchase_price - downn;
  var Mort_I = calculate_for_graph(Maximum_purchase_price, downn);
  var new_mortage = payment_calculation + Mort_I;
  Monthly_payment_w_graph_new = ((parseFloat(effective) / 12 * ((1 + (parseFloat(effective) / 12)) ** (Number(amort) * 12)) / (((1 + (parseFloat(effective) / 12)) ** (Number(amort) * 12) - 1)))) * new_mortage;



  $("#max-purchase-price").html(
    numeral(parseFloat(Maximum_purchase_price).toFixed(0)).format("$0,0")
  );
  $("#monthly-payment").html(
    numeral(parseFloat(Monthly_payment).toFixed(0)).format("$0,0")
  );

  if (window.event.target.id == "arch-price" || window.event.target.id == "range3"  || window.event.target.id == "arrow-down3" || window.event.target.id == "arrow-up3") {
    console.log("do nothing");
  }
  else {
    $("#arch-price").val(numeral(arch_dp_max).format("$0,0"));
    slider2.value = parseInt(arch_dp_max);

  }

  $("#you-legend").html(numeral(parseFloat(downn).toFixed(0)).format("$0,0"));
  $("#arch-legend").html(
    numeral(parseFloat(max_ARCH_contribution).toFixed(0)).format("$0,0")
  );
  $("#mortgage-legend").html(
    numeral(parseFloat(mortgage).toFixed(0)).format("$0,0")
  );

  chart([
    ["You", downn],
    ["ARCH", max_ARCH_contribution],
    ["Mortgage", mortgage],
  ]);

  bar2([
    ['Without Arch ', Monthly_payment_w_graph_new.toFixed(0)],
    ['With Arch ', Monthly_payment.toFixed(0)]
  ]);

  document.getElementById("comparison-1").textContent = parseFloat(((Maximum_purchase_price - Maximum_purchase_price_w) / Maximum_purchase_price_w) * 100).toFixed(0) + "%";

  var payyy = parseFloat(Monthly_payment_w_graph_new - Monthly_payment).toFixed(1)


  $("#comparison-2").html(numeral(payyy).format("$0,0"));


}

document
  .getElementById("mortage-interest")
  .addEventListener("change", calculateMortgage);
document
  .getElementById("home-price")
  .addEventListener("change", calculateMortgage);
document
  .getElementById("selectamort")
  .addEventListener("change", calculateMortgage);

function cal_mort(N2, rate, amort) {
  // console.log(N2 , amort , rate, TARGET_GDS , MONTHLY_PROPERTY_TAX , MONTHLY_UTILITIES);
  const numerator = TARGET_GDS * N2 - MONTHLY_PROPERTY_TAX - MONTHLY_UTILITIES;
  const monthlyInterestRate = rate / 12;
  const numberOfPayments = amort * 12;
  const denominator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  console.log(numerator, monthlyInterestRate, numberOfPayments, denominator);
  return (numerator / denominator).toFixed(2);

}


function calculateMaxPurchase(amort, downn, down_payment, gds, tds) {
  gds = Number(gds);
  tds = Number(tds);
  if (amort === 30) {
    const min1 =
      Math.min(
        down_payment / 0.25 - down_payment,
        Math.max(gds, 0),
        Math.max(tds, 0)
      ) + down_payment;
    return Math.min(min1, 1000000);
  } else {
    const numerator =
      downn >= MINIMUM_REQUIRED_FOR_FIVEK
        ? MINIMUM_REQUIRED_FOR_FIVEK / DP_REQUIREMENT +
        (downn - MINIMUM_REQUIRED_FOR_FIVEK) / DP_REQUIREMENT_ABOVE_500K
        : downn / DP_REQUIREMENT;
    const min2 = Math.min(1000000, numerator);
    const max1 = Math.max(gds, 0) + down_payment;
    const max2 = Math.max(tds, 0) + down_payment;
    // console.log(amort , downn , gds , tds , down_payment , Math.min(min2, max1, max2) );
    return Math.min(min2, max1, max2);
  }
}

function calculateMaxPurchase_w(amort, down, gds, tds) {
  gds = Number(gds);
  tds = Number(tds);
  if (amort === 30) {
    const min1 =
      Math.min(down / 0.2 - down, Math.max(gds, 0), Math.max(tds, 0)) + down;
    return min1;
  } else {
    const min2 = Math.min(
      1000000,
      Math.min(
        down <= 25000
          ? down / 0.05
          : down > 25000 && down < 200000
            ? Math.min(25000 / 0.05 + (down - 25000) / 0.1, 999999)
            : down / 0.2
      )
    );
    const max1 = Math.max(gds, 0) + down;
    const max2 = Math.max(tds, 0) + down;

    return Math.min(min2, max1, max2);
  }
}


function cal_premium(arch_percent, client_percent,
  down_price, Maximum_purchase, arch__max) {


  arch_percent = Number(arch_percent);
  client_percent = Number(client_percent);
  arch__max = Number(arch__max);

  if (arch_percent + client_percent >= 0.2) {
    return 0;
  } else if (arch_percent + client_percent >= 0.15) {
    return MORTAGE_INSURANCE_PREMIUM_2 * (Maximum_purchase - down_price - arch__max);
  } else if (arch_percent + client_percent >= 0.1) {
    return MORTAGE_INSURANCE_PREMIUM_1 * (Maximum_purchase - down_price - arch__max);
  } else if (arch_percent + client_percent >= 0.05) {
    return MORTAGE_INSURANCE_PREMIUM_0 * (Maximum_purchase - down_price - arch__max);
  }

}
function cal_premium_w(down_price, max_price) {

  down_price = Number(down_price);
  max_price = Number(max_price);

  if (down_price / max_price >= 0.2) {
    return 0;
  } else if (down_price / max_price >= 0.15) {
    return MORTAGE_INSURANCE_PREMIUM_2 * (max_price - down_price);
  } else if (down_price / max_price >= 0.1) {
    return MORTAGE_INSURANCE_PREMIUM_1 * (max_price - down_price);
  } else if (max_price / down_price >= 0.05) {
    return MORTAGE_INSURANCE_PREMIUM_0 * (max_price - down_price);
  }


}


function calculate_for_graph(max, down) {
  if (down / max >= 0.2) {
    return 0;
  } else if (down / max >= 0.15) {
    return MORTAGE_INSURANCE_PREMIUM_2 * (max - down);
  } else if (down / max >= 0.1) {
    return MORTAGE_INSURANCE_PREMIUM_1 * (max - down);
  } else if (max / down >= 0.05) {
    return MORTAGE_INSURANCE_PREMIUM_0 * (max - down);
  }


}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("show");
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  document.getElementById(tabName).classList.add("show");
  evt.currentTarget.classList.add("active");
}


//doughnut chart

function chart(data) {
  // create pie chart with passed data
  document.getElementById("container").textContent = "";
  var chart = anychart.pie(data);

  // create range color palette with color ranged between light blue and dark blue
  var palette = anychart.palettes.distinctColors();

  // set the colors according to the brands
  palette.items([
    { color: '#727272' },
    { color: '#31134E' },
    { color: '#F9BB2D' }
  ]);

  var legend = chart.legend();
  legend.enabled(false);
  // set chart title text settings
  chart
    // set chart radius
    .innerRadius("50%")
    // set palette to the chart
    .palette(palette);
  //   .fontSize(12);

  // set container id for the chart
  chart.tooltip().title().fontSize(23);
  var title = chart.tooltip();
  title.fontFamily("Calibri");
  title.fontWeight(400);
  title.fontSize(23);

  chart.container("container");
  // initiate chart drawing
  chart.draw();
}

function bar1(data) { // create bar chart
  document.getElementById("chart-1").textContent = "";
  var chart = anychart.bar();

  chart.animation(true);

  chart.padding([10, 40, 15, 20]);


  // create bar series with passed data
  var series = chart.bar(data);

  // set tooltip settings
  series
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(15)
    .offsetY(0)
    .titleFormat('{%X}')
    .format('${%Value}');

  // set yAxis labels formatter
  chart.yAxis().labels().format('{%Value}{groupsSeparator: }');

  // set titles for axises
  chart.interactivity().hoverMode('by-x');
  // chart.tooltip().positionMode('point');
  // set scale minimum
  chart.yScale().minimum(0);
  chart.barGroupsPadding(0.2);
  chart.labels().fontSize(45);
  chart.labels().fontWeight(900);

  let palette = anychart.palettes.distinctColors();
  palette.items(
    ['#F9BB2D']
  );

  //Tooltip text formatting
  chart.palette(palette);
  chart.tooltip().title().fontSize(23);
  var title = chart.tooltip();
  title.fontFamily("Calibri");
  title.fontWeight(400);
  title.fontSize(23);

  //Axis text formatting
  var labels = chart.xAxis().labels();
  labels.fontSize(22);
  labels.fontFamily("poppins");
  labels.fontWeight(500);
  labels.useHtml(false);

  var labels = chart.yAxis().labels();
  labels.fontSize(20);
  labels.fontFamily("poppins")
  labels.fontWeight(500);
  labels.useHtml(false);

  // set container id for the chart
  chart.animation(600);
  chart.container('chart-1');
  // initiate chart drawing
  chart.draw();
}



function bar2(data) {
  // create bar chart
  document.getElementById("chart-2").textContent = "";
  var chart = anychart.bar();

  chart.animation(true);

  chart.padding([10, 40, 15, 20]);


  // create bar series with passed data
  var series = chart.bar(data);

  // set tooltip settings
  series
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(15)
    .offsetY(0)
    .titleFormat('{%X}')
    .format('${%Value}');

  // set yAxis labels formatter
  chart.yAxis().labels().format('{%Value}{groupsSeparator: }');

  // set titles for axises
  chart.interactivity().hoverMode('by-x');

  // set scale minimum
  chart.yScale().minimum(0);
  chart.barGroupsPadding(0.2);
  chart.labels().fontSize(45);
  chart.labels().fontWeight(900);

  let palette = anychart.palettes.distinctColors();
  palette.items(
    ['#F9BB2D']
  );
  chart.palette(palette);

  chart.tooltip().title().fontSize(23);
  var title = chart.tooltip();
  title.fontFamily("Calibri");
  title.fontWeight(400);
  title.fontSize(23);

  var labels = chart.xAxis().labels();
  labels.fontSize(22);
  labels.fontFamily("poppins");
  labels.fontWeight(500);
  labels.useHtml(false);
  var labels = chart.yAxis().labels();
  labels.fontSize(20);
  labels.fontFamily("poppins")
  labels.fontWeight(500);
  labels.useHtml(false);
  // set container id for the chart
  chart.animation(600);
  chart.container('chart-2');
  // initiate chart drawing
  chart.draw();
}



anychart.onDocumentReady(function () {
  chart([
    ["You", 35000],
    ["ARCH", 119420],
    ["Mortgage", 442678],
  ]);

  bar1([
    ['With Arch', 597098],
    ['Without Arch', 477678],

  ]);

  bar2([
    ['Without Arch', 2095],
    ['With Arch', 2767]

  ]);
});




[document.getElementById('arrow-up6'),
document.getElementById('arrow-up5'),
document.getElementById('arrow-up4'),
document.getElementById('arrow-up3'),
document.getElementById('arrow-up2'),
document.getElementById('arrow-up1'),
document.getElementById('arrow-down1'),
document.getElementById('arrow-down2'),
document.getElementById('arrow-down3'),
document.getElementById('arrow-down4'),
document.getElementById('arrow-down5'),
document.getElementById('arrow-down6')].forEach(function (element) {
  element.addEventListener("click", function () {


    var home = parseInt(
      $("#home-price").val().replace("$", "").replace(",", "").replace(",", "")
    );
    var down = parseInt(
      $("#down-price").val().replace("$", "").replace(",", "").replace(",", "")
    );
  
    var arch = parseInt(
      $("#arch-price").val().replace("$", "").replace(",", "").replace(",", "")
    );

    var interest =  parseInt($("#mortage-interest").val().replace("%", "").replace(",", "").replace(",", ""));

    var month = parseInt(
      $("#monthly-payments").val().replace("$", "").replace(",", "").replace(",", "")
    );
  
    var debt =  parseInt(
      $("#mortage-debt").val().replace("$", "").replace(",", "").replace(",", "")
    );
  
if(this.id == 'arrow-up1'){
home = home + 10000;

home = Math.min(HOME_PRICE_MAX, home);
home = Math.max(HOME_PRICE_MIN, home);

slider.value = home;
gross_monthly_income = home / 12;

$("#home-price").val(numeral(home).format("$0,0"));
}
else if (this.id == 'arrow-down1'){
  home = home - 10000;
  home = Math.min(HOME_PRICE_MAX, home);
  home = Math.max(HOME_PRICE_MIN, home);

  slider.value = home;
  gross_monthly_income = home / 12;

  $("#home-price").val(numeral(home).format("$0,0"));
 
}


   
else if(this.id == 'arrow-up2'){
  down = down + 1000;
  down = Math.min(DOWN_PAYMENT_MAX, down);
  down = Math.max(DOWN_PAYMENT_MIN, down);

  slider1.value = down;
  client_dp = down;
  $("#down-price").val(numeral(down).format("$0,0"));
  }
  else if (this.id == 'arrow-down2'){
    down = down - 1000;
    down = Math.min(DOWN_PAYMENT_MAX, down);
    down = Math.max(DOWN_PAYMENT_MIN, down);
  
    slider1.value = down;
    client_dp = down;
    $("#down-price").val(numeral(down).format("$0,0"));
  
  }

  

     
else if(this.id == 'arrow-up3'){
  arch = arch + 1000;

  arch = Math.min(ARCH_CONTRIBUTION_MAX, arch);
  arch = Math.max(ARCH_CONTRIBUTION_MIN, arch);

  slider2.value = arch;
  $("#arch-price").val(numeral(arch).format("$0,0"));
  }
  else if (this.id == 'arrow-down3'){
    arch = arch - 1000;
    arch = Math.min(ARCH_CONTRIBUTION_MAX, arch);
    arch = Math.max(ARCH_CONTRIBUTION_MIN, arch);
  
    slider2.value = arch;
    $("#arch-price").val(numeral(arch).format("$0,0"));
    $("#arch-price").val(numeral(arch).format("$0,0"));
  }

  

     
else if(this.id == 'arrow-up4'){
  interest = interest + 1;

  var p = interest / 100;
  compounding_rate = (
    parseFloat(Math.pow(1 + p / COMPOUNDING_PERIOD, COMPOUNDING_PERIOD) - 1) *
    100
  ).toFixed(9);
  effective_rate = (
    ((1 + compounding_rate / 100) ** (1 / 12) - 1) *
    12 *
    100
  ).toFixed(9);
  Qualifiying_rate = Math.max(STRESS_RATE * 100, (p + 0.02) * 100);
  compounding_qualified_rate = (
    (Math.pow(
      1 + Qualifiying_rate / 100 / COMPOUNDING_PERIOD,
      COMPOUNDING_PERIOD
    ) -
      1) *
    100
  ).toFixed(9);
  effective_qualified_rate = (
    (Math.pow(1 + compounding_qualified_rate / 100, 1 / 12) - 1) *
    12 *
    100
  ).toFixed(9);

  // $("#mortage-interest").val(numeral(interest).format("$0,0"));
document.getElementById("mortage-interest").value = interest + "%";
}
  else if (this.id == 'arrow-down4'){
    interest = interest - 1;

    var p = interest / 100;
    compounding_rate = (
      parseFloat(Math.pow(1 + p / COMPOUNDING_PERIOD, COMPOUNDING_PERIOD) - 1) *
      100
    ).toFixed(9);
    effective_rate = (
      ((1 + compounding_rate / 100) ** (1 / 12) - 1) *
      12 *
      100
    ).toFixed(9);
    Qualifiying_rate = Math.max(STRESS_RATE * 100, (p + 0.02) * 100);
    compounding_qualified_rate = (
      (Math.pow(
        1 + Qualifiying_rate / 100 / COMPOUNDING_PERIOD,
        COMPOUNDING_PERIOD
      ) -
        1) *
      100
    ).toFixed(9);
    effective_qualified_rate = (
      (Math.pow(1 + compounding_qualified_rate / 100, 1 / 12) - 1) *
      12 *
      100
    ).toFixed(9);

    
    document.getElementById("mortage-interest").value = interest + "%";
  }
  


  else if(this.id == 'arrow-up5'){
    month = month + 1;
    $("#monthly-payments").val(numeral(month).format("$0,0"));
    }
    else if (this.id == 'arrow-down5'){
      month = month - 1;
      $("#monthly-payments").val(numeral(month).format("$0,0"));
      $("#monthly-payments").val(numeral(month).format("$0,0"));
    }
    

    
  else if(this.id == 'arrow-up6'){
    debt = debt + 1;
    debt_payment = debt > 0 ? Math.max(10, debt * 0.03) : 0;
    $("#mortage-debt").val(numeral(debt).format("$0,0"));
    }
    else if (this.id == 'arrow-down6'){
      debt = debt - 1;
      debt_payment = debt > 0 ? Math.max(10, debt * 0.03) : 0;
      $("#mortage-debt").val(numeral(debt).format("$0,0"));
    }
    
calculateMortgage();
  })
})


// const button = document.getElementById('arrow-amort');
// const select = document.querySelector('#selectamort');


// button.addEventListener('click', function() {
//   $('#selectamort').show();
// });