/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ---Inc. Client-Side Resource Calculator V1.0---                       *
 * Implemented in Javascript because twelve monkeys on typewriters could *
 * put together a functioning resource calculator in about a week.       *
 * Honestly, if you're bothering to steal this, I feel sorry for your    *
 * alliance already. Write a C app. This is sloppy and not IE-compatible.*
 * The code, such as it is, copyright Ryan Carlyle, April 2007.          *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// arrays of improvement base mods
// note: envir is negative for improvement, so SUBTRACT the array value from environment

var legend = ["Name","Population","Infra Cost","Infra Upkeep","Happiness","Income$","Income%","Land Area","Land Cost","Environment","Tech Cost","Soldiers"]
//	     Name,		P,	Ic,	Iu,	H,	$+,	$%,	L,	L,	E,	T,	S
var bank = ["Bank",		0,	0,	0,	0,	0,	0.07,	0,	0,	0,	0,	0]
var barr = ["Barracks",		0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0.1]
var bord = ["Border Wall",	-0.02,	0,	0,	2,	0,	0,	0,	0,	-1,	0,	0]
var chur = ["Church",		0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	0]
var clin = ["Clinic",		0.02,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0]
var fact = ["Factory",		0,	-0.08,	0,	0,	0,	0,	0,	0,	0,	0,	0]
var form = ["Foreign Ministry",	0,	0,	0,	0,	0,	0.05,	0,	0,	0,	0,	0]
var guec = ["Guerilla Camp",	0,	0,	0,	0,	0,	-0.08,	0,	0,	0,	0,	0.35]
var harb = ["Harbor",		0,	0,	0,	0,	0,	0.01,	0,	0,	0,	0,	0]
var hosp = ["Hospital",		0.06,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0]
var inta = ["Intelligence Agency",0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	0]
var labc = ["Labor Camp",	0,	0,	-.1,	-1,	0,	0,	0,	0,	0,	0,	0]
var misd = ["Missile Defense",	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0]
var polh = ["Police Headquarters",0,	0,	0,	2,	0,	0,	0,	0,	0,	0,	0]
var sate = ["Satellite",	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0]
var scho = ["School",		0,	0,	0,	0,	0,	0.05,	0,	0,	0,	0,	0]
var stad = ["Stadium",		0,	0,	0,	3,	0,	0,	0,	0,	0,	0,	0]
var univ = ["University",	0,	0,	0,	0,	0,	0.08,	0,	0,	0,	-.1,	0]

var improvementMods = new Array(legend,bank,barr,bord,chur,clin,fact,form,guec,harb,hosp,inta,labc,misd,polh,sate,scho,stad,univ)

// array printer for debug
function printImprovementMods(){
 document.writeln("<table border=1 cellpadding=3 cellspacing=0>")
 for(i=0;i<improvementMods.length;++i){
  document.writeln("<tr>")
  for(j=0;j<improvementMods[i].length;++j){
   document.writeln("<td>" + improvementMods[i][j] + "</td>")
  }
  document.writeln("</tr>")
 }
 document.writeln("</table>")
}


// arrays of resource base mods
// note: lower envir is better so penalty is +1, bonus is -1
// also note: environment's impact on happiness (-0.4/point) is directly entered into the happiness column and not calculated later.

var legend = ["Name","Population","Infra Cost","<b>Infra Upkeep</b>","Happiness","$ per citizen","<b>Gross Income</b>","Land Area","Land Cost","Environment","Tech Cost","Soldiers","Is Bonus?"]

//	   Name,	P,	Ic,	Iu,	H,	$+,	$%,	L,	L,	E,	T,	S,	bonus
var alu = ["Aluminum",	0,	-0.07,	0,	0,	0,	0,	0,	0,	0,	0,	0.2,	false] //0
var cat = ["Cattle",	0.05,	0,	0,	0,	0,	0,	0,	-0.1,	0,	0,	0,	false]
var coa = ["Coal",	0,	-0.04,	0,	-0.4,	0,	0,	0.15,	0,	1,	0,	0.08,	false]
var fis = ["Fish",	0.08,	0,	0,	0,	0,	0,	0,	-0.05,	0,	0,	0,	false]
var fur = ["Furs",	0,	0,	0,	0,	3.5,	0,	0,	0,	0,	0,	0,	false]
var gol = ["Gold",	0,	0,	0,	0,	3,	0,	0,	0,	0,	-0.05,	0,	false] //5
var gem = ["Gems",	0,	0,	0,	2.5,	1.5,	0,	0,	0,	0,	0,	0,	false]
var iro = ["Iron",	0,	-0.05,	-0.1,	0,	0,	0,	0,	0,	0,	0,	0,	false]
var lea = ["Lead",	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	false]
var lum = ["Lumber",	0,	-0.06,	-0.08,	0,	0,	0,	0,	0,	0,	0,	0,	false]
var mar = ["Marble",	0,	-0.1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	false] //10
var oil = ["Oil",	0,	0,	0,	1.1,	0,	0,	0,	0,	1,	0,	0.1,	false]
var pig = ["Pigs",	0.035,	0,	0,	0,	0,	0,	0,	0,	0,	0,	.15,	false]
var rub = ["Rubber",	0,	-0.03,	0,	0,	0,	0,	0.2,	-0.1,	0,	0,	0,	false]
var sil = ["Silver",	0,	0,	0,	2,	2,	0,	0,	0,	0,	0,	0,	false]
var spi = ["Spices",	0,	0,	0,	2,	0,	0,	0.08,	0,	0,	0,	0,	false] //15
var sug = ["Sugar",	0.03,	0,	0,	1,	0,	0,	0.05,	0,	0,	0,	0,	false]
var ura = ["Uranium",	0,	0,	0,	-1.4,	3+0.15*Math.min(tech,30),0,0,0,	1,	0,	0,	false] //must come after copypasta data entry
var wat = ["Water",	0,	0,	0,	2.9,	0,	0,	0,	0,	-1,	0,	0,	false]
var whe = ["Wheat",	0.08,	0,	0,	0,	0,	0,	0.05,	0,	0,	0,	0,	false]
var win = ["Wine",	0,	0,	0,	3,	0,	0,	0,	0,	0,	0,	0,	false] //20

//bonus    Na,		P,	I,	I,	H,	$,	$,	L,	L,	E,	T,	S,	bonus
var aff = ["Affluent Population",0,0,	0,	2,	0,	0,	0,	0,	0,	0,	0,	true]
var asp = ["Asphalt",	0,	0,	-0.05,	0,	0,	0,	0,	0,	0,	0,	0,	true]
var aut = ["Automobiles",0,	0,	0,	3,	0,	0,	0,	0,	0,	0,	0,	true]
var bee = ["Beer",	0,	0,	0,	2,	0,	0,	0,	0,	0,	0,	0,	true]
var con = ["Construction",0,	-0.05,	0,	0,	0,	0,	0,	0,	0,	0,	0,	true]
var fas = ["Fast Food",	0,	0,	0,	2,	0,	0,	0,	0,	0,	0,	0,	true]
var fin = ["Fine Jewelry",0,	0,	0,	1.5,	0,	0,	0,	0,	0,	0,	0,	true]
var mic = ["Microchips",0,	0,	0,	2,	0,	0,	0,	0,	0,	-0.08,	0,	true]
var rad = ["Radiation Cleanup",0,0,	0,	0.4,	0,	0,	0,	0,	-1,	0,	0,	true]
var sch = ["Scholars",	0,	0,	0,	0,	3,	0,	0,	0,	0,	0,	0,	true]
var ste = ["Steel",	0,	-0.02,	0,	0,	0,	0,	0,	0,	0,	0,	0,	true]


var resourceMods = new Array(legend,alu,cat,coa,fis,fur,gol,gem,iro,lea,lum,mar,oil,pig,rub,sil,spi,sug,ura,wat,whe,win,aff,asp,aut,bee,con,fas,fin,mic,rad,sch,ste)


// array printer for debug
function printResourceMods(){
 document.writeln("<table border=1 cellpadding=3 cellspacing=0>")
 for(i=0;i<resourceMods.length;++i){
  document.writeln("<tr>")
  for(j=0;j<resourceMods[i].length;++j){
   document.writeln("<td>" + resourceMods[i][j] + "</td>")
  }
  document.writeln("</tr>")
 }
 document.writeln("</table>")
}



// popular combos
// Fish, Wheat, Cattle, Pigs, Furs, Gold, Gems, Wine, Coal, Spices [Silver & Sugar]   (money)
var c_money = [3,19,1,12,4,5,6,20,2,15,14,16]

// Rubber, Coal, Aluminum, Lumber, Water, Oil, Fish, Iron, Marble, Wheat, [Cattle, Uranium]     (infra)
var c_infra = [13,2,0,9,18,11,3,7,10,19,1,17]

// Wine, Cattle, Aluminium, Pigs, Sugar, Spice, Lumber, Wheat, Marble, Iron [Fish, Water,]   (hybrid)
var c_hybrd = [20,1,0,12,16,15,9,19,10,7,3,18]

var combos = [c_money,c_infra,c_hybrd]


// arrays to store current/new cumulative mods
//	         P,I,I,H,$,$,L,L,E,T,S
var mods = [null,1,1,1,0,0,1,1,1,0,1,1,null]
// legend from above, cumuMods[1] for left, cumuMods[2] for right
var cumuMods = new Array(legend,mods,mods)  

// array printer for debug
function printCumuMods(){
 document.writeln("<table border=1 cellpadding=3 cellspacing=0>")
 for(i=0;i<cumuMods.length;++i){
  document.writeln("<tr>")
  for(j=1;j<(cumuMods[i].length-1);++j){
   document.writeln("<td>" + cumuMods[i][j] + "</td>")
  }
  document.writeln("</tr>")
 }
 document.writeln("</table>")
}




//FUNCTIONS LOL


// set combos:
function setCombo(n){
 document.forms[4].reset()
 for (j=0;j<combos[n].length;++j){
  document.forms[4].elements[combos[n][j]].checked=true
//  updateFields(4,document.forms[4].elements[combos[n][j]]) // optional enable
  checkFields(4,document.forms[4].elements[combos[n][j]])
 }
 updateMods(4)
 printFields()
}

// bonus resource checker: 
// debug note: "document.forms[field].Wat.checked is not defined" means you called the wrong value for field
function bonusCheck(field){ // field=0 for left, 4 for right

// the most uselessly complex equation in the game. YAY LITERACY!
// this is wrong but it works and I haven't bothered to put in the right value.
literacy = Math.min(1,Math.max(.2,(1+0.01*document.impForm[15].value)*(1+0.03*document.impForm[17].value)*(1-40/(tech+0.5))))

// beer
if ((document.forms[field].Wat.checked==true)&&(document.forms[field].Whe.checked==true)&&(document.forms[field].Lum.checked==true)&&(document.forms[field].Alu.checked==true)){
 document.forms[field].Bee.checked=true
}else{
 document.forms[field].Bee.checked=false
}
// construction
if ((document.forms[field].Alu.checked==true)&&(document.forms[field].Lum.checked==true)&&(document.forms[field].Iro.checked==true)&&(document.forms[field].Mar.checked==true)&&(tech>5)){
 document.forms[field].Con.checked=true
}else{
 document.forms[field].Con.checked=false
}
// fast food
if ((document.forms[field].Cat.checked==true)&&(document.forms[field].Sug.checked==true)&&(document.forms[field].Spi.checked==true)&&(document.forms[field].Pig.checked==true)){
 document.forms[field].Fas.checked=true
}else{
 document.forms[field].Fas.checked=false
} 
// fine jewelry
if ((document.forms[field].Gol.checked==true)&&(document.forms[field].Sil.checked==true)&&(document.forms[field].Gem.checked==true)&&(document.forms[field].Coa.checked==true)){
 document.forms[field].Fin.checked=true
}else{
 document.forms[field].Fin.checked=false
}
// microchips
if ((document.forms[field].Gol.checked==true)&&(document.forms[field].Lea.checked==true)&&(document.forms[field].Oil.checked==true)&&(tech>10)){
 document.forms[field].Mic.checked=true
}else{
 document.forms[field].Mic.checked=false
}
// steel
if ((document.forms[field].Iro.checked==true)&&(document.forms[field].Coa.checked==true)){
 document.forms[field].Ste.checked=true
}else{
 document.forms[field].Ste.checked=false
}
// scholars
if ((document.forms[field].Lum.checked==true)&&(document.forms[field].Lea.checked==true)&&(literacy>0.9)){
 document.forms[field].Sch.checked=true
}else{
 document.forms[field].Sch.checked=false
}
// radiation cleanup -- check steel, microchips, and construction first
if ((document.forms[field].Con.checked==true)&&(document.forms[field].Mic.checked==true)&&(document.forms[field].Ste.checked==true)&&(tech>15)){
 document.forms[field].Rad.checked=true
}else{
 document.forms[field].Rad.checked=false
}
// asphalt -- check construction first
if ((document.forms[field].Con.checked==true)&&(document.forms[field].Oil.checked==true)&&(document.forms[field].Rub.checked==true)){
 document.forms[field].Asp.checked=true
}else{
 document.forms[field].Asp.checked=false
}
// automobiles -- check asphalt first
if ((document.forms[field].Asp.checked==true)&&(document.forms[field].Ste.checked==true)){
 document.forms[field].Aut.checked=true
}else{
 document.forms[field].Aut.checked=false
}
// affluent pop -- check fine jewelry first
if ((document.forms[field].Fin.checked==true)&&(document.forms[field].Fis.checked==true)&&(document.forms[field].Fur.checked==true)&&(document.forms[field].Win.checked==true)){
 document.forms[field].Aff.checked=true
}else{
 document.forms[field].Aff.checked=false
}
}//end bonusCheck()




//counts selected resources
function numResources(field){
 var tempCount1 = 0
 // left field has 2 checkboxes per resource -- only check EVEN element[] indexes
 if (field == 0){
  for (i=0;i<(document.forms[field].length/2);i++){
   // if the form field is checked and it's not for a bonus resource, increment.
   // "[i+1]" to skip legend, "[resourcemods[i+1].length-1]" gives index of last item which is "isBonus?" 
   if ((document.forms[field].elements[i*2].checked==true)&&(resourceMods[i+1][resourceMods[i+1].length-1]==false)){ 
    ++tempCount1
   }
  }
 }else{ // right field counts all boxes
  for (i=0;i<document.forms[field].length;i++){
   if ((document.forms[field].elements[i].checked==true)&&(resourceMods[i+1][resourceMods[i+1].length-1]==false)){
    ++tempCount1
   }
  }
 }
 return tempCount1 // will return 0 if called on a non-checkbox field
}



// check data entry: 
// caller needs to be "this" in the function call
function checkFields(field,caller){

 // make sure improvement field isn't given bad data
 if (field==5){
 bonusCheck(0)
 bonusCheck(4)
  if (isNaN(caller.value)){
   caller.value=0
   window.alert("Numbers only please~")
  }else {
   if (caller.value > 5){
    caller.value=5
   }
   if (caller.value < 0){
    caller.value=0
   }
   caller.value=Math.round(caller.value,0)
  } 
 }

 // check harbor for maximum resource number
 var maxResources
 if (document.impForm[8].value >= 1){
  maxResources = 12
 }else{
  maxResources = 10
 }

 // if the caller field was a resource form:
 if ((field==0)||(field==4)){
   // if they're over count, uncheck the caller checkbox (note: this requires onchange for the element rather than onclick or it'll get the order wrong)
  if (numResources(field) > maxResources){
   caller.checked=false 
  }
  bonusCheck(field) // this is where we turn on/off bonus resources. must be after the max-count check.
 } // if the caller field was anything other than a resource form (improvement form mostly):
 else{ 
  if (numResources(0) > maxResources){
   window.alert("you have too many resources on the LEFT side, please uncheck some")
  }
  if (numResources(4) > maxResources){
   window.alert("you have too many resources on the RIGHT, please uncheck some")
  }
 }
}




// cumulative mod value calculator:
function updateMods(field){
 // uncomment next line if post-load nation-data tech changes are allowed
 // resourceMods.ura[5] = 3 + (0.15 *Math.min(tech,30))

 //		            P,I,I,H,$,$,L,L,E,T,S
 var addMult =        [null,1,1,1,0,0,1,1,1,0,1,1,null] //controls additive or multiplicative bonuses
 // there's no reason to reprint the opposite side after a resource change,
 // but both sides need updating after an improvement change,  
 // so it updates (left if not right) and (right if not left)

 //loop resources 
 if (field != 4){ // left field do every other checkbox
 cumuMods[1] =  [null,1,1,1,0,0,1,1,1,0,1,1,null] //reset cumuMods
  for (i=0;i<(document.forms[0].length/2);i++){        //loop through form
   if (document.forms[0].elements[i*2].checked==true){ //if the box is checked
    for (j=1;j<(resourceMods[i+1].length-1);++j){      //loop through the mods for that box's resources
     if (addMult[j]){
      cumuMods[1][j] *= (1+resourceMods[i+1][j])
     }else{
      cumuMods[1][j] += resourceMods[i+1][j]
     }
    }
   }
  }
 }
 if (field !=0){ // right field check all boxes
 cumuMods[2] =  [null,1,1,1,0,0,1,1,1,0,1,1,null] //reset cumuMods
  for (i=0;i<(document.forms[4].length);i++){        //loop through form
   if (document.forms[4].elements[i].checked==true){ //if the box is checked
    for (j=1;j<(resourceMods[i+1].length-1);++j){    //loop through the mods for that box's resource
     if (addMult[j]){
      cumuMods[2][j] *= (1+resourceMods[i+1][j])
     }else{
      cumuMods[2][j] += resourceMods[i+1][j]
     }
    }
   }
  }
 }
 
 //loop improvements, improvement change affects both resource fields
 for (i=0;i<(document.forms[5].length);i++){        //loop through imp form
  for (j=1;j<(improvementMods[i+1].length);++j){    //loop through the mods for that box's improvement !!!!!!!REMOVE -1 WHEN BLIANG FIXES JUNK
   if (addMult[j]){
    if (field !=4){cumuMods[1][j] *= (1+(improvementMods[i+1][j] * document.forms[5][i].value))}
    if (field !=0){cumuMods[2][j] *= (1+(improvementMods[i+1][j] * document.forms[5][i].value))}
   }else{
    if (field !=4){cumuMods[1][j] += (improvementMods[i+1][j] * document.forms[5][i].value)}
    if (field !=0){cumuMods[2][j] += (improvementMods[i+1][j] * document.forms[5][i].value)}
   }
  }
 }
}



// print fields: 
function printFields(){

 for(i=1;i<(cumuMods[1].length-1);++i){
  document.forms[1].elements[(i-1)*2].value = Math.round(cumuMods[1][i]*1000)/1000 // round to 1/1000th place
 }
 //cumuMods[] index lookup table:
 // P,Ic,Iu,H,$+,$%,L%,Lc,E,T, S
 // 1 2  3  4 5  6  7  8  9 10 11
 document.forms[1].elements[1].value = Math.round(basePopulation * cumuMods[1][1])
 document.forms[1].elements[3].value = Math.round(baseInfraCost * cumuMods[1][2]*100)/100
 document.forms[1].elements[5].value = "$" + Math.round(baseInfraUpkeep * cumuMods[1][3]*infra/1000) + "K"
 document.forms[1].elements[7].value = Math.round((baseHappiness + cumuMods[1][4])*100)/100
 document.forms[1].elements[9].value = Math.round(Math.max(10,(baseGrossIncome + (baseHappiness+cumuMods[1][4])*2 + cumuMods[1][5]) * cumuMods[1][6]*100))/100
 document.forms[1].elements[11].value = "$" + Math.round(document.forms[1].elements[9].value * tax*Math.round(basePopulation * cumuMods[1][1])/1000) + "K"
 document.forms[1].elements[13].value = Math.round((basePurLand * cumuMods[1][7] + natLand)*1000)/1000
 document.forms[1].elements[15].value = "- -" //* cumuMods[1][8]
 document.forms[1].elements[17].value = Math.max(Math.round((baseEnvironment + cumuMods[1][9])*100)/100,1)
 document.forms[1].elements[19].value = "- -" //Math.round(baseTechCost * cumuMods[1][10])
 document.forms[1].elements[21].value = Math.round(baseSoldiers * cumuMods[1][11])

 for(i=1;i<(cumuMods[2].length-1);++i){
  document.forms[3].elements[(i-1)*2].value = Math.round(cumuMods[2][i]*1000)/1000 // round to 1/1000th place
 }
 document.forms[3].elements[1].value = Math.round(basePopulation * cumuMods[2][1])
 document.forms[3].elements[3].value = Math.round(baseInfraCost * cumuMods[2][2]*100)/100
 document.forms[3].elements[5].value = "$" + Math.round(baseInfraUpkeep * cumuMods[2][3]*infra/1000) + "K"
 document.forms[3].elements[7].value = Math.round((baseHappiness + cumuMods[2][4])*100)/100
 document.forms[3].elements[9].value = Math.round(Math.max(10,(baseGrossIncome + (baseHappiness+cumuMods[2][4])*2 + cumuMods[2][5]) * cumuMods[2][6]*100))/100
 document.forms[3].elements[11].value = "$" + Math.round(document.forms[3].elements[9].value * tax*Math.round(basePopulation * cumuMods[2][1])/1000) + "K"
 document.forms[3].elements[13].value = Math.round((basePurLand * cumuMods[2][7] + natLand)*1000)/1000
 document.forms[3].elements[15].value = "- -" //* cumuMods[2][8]
 document.forms[3].elements[17].value = Math.max(Math.round((baseEnvironment + cumuMods[2][9])*100)/100,1)
 document.forms[3].elements[19].value = "- -" //baseTechCost * cumuMods[2][10]
 document.forms[3].elements[21].value = Math.round(baseSoldiers * cumuMods[2][11])
  
}




// call this after any input field changes:
// field is the index number of the calling form, caller needs to be "this" to pass the changed element to the function
function updateFields(field,caller){ 
 checkFields(field,caller)
 updateMods(0)
 updateMods(4)
 printFields()
}




// unmod base value finder:
function preCalc(){
// puts nation's resources in cumuMods[0]
updateMods(0) 
updateMods(4)

//cumuMods[] index lookup table:
// P,Ic,Iu,H,$+,$%,L%,Lc,E,T, S
// 1 2  3  4 5  6  7  8  9 10 11

basePurLand = purLand/cumuMods[1][7]
baseEnvironment = environment-cumuMods[1][9]
baseSoldiers = soldiers/cumuMods[1][11]
baseHappiness = happiness-cumuMods[1][4]
basePopulation = population/cumuMods[1][1]
baseGrossIncome = grossIncome/cumuMods[1][6]-cumuMods[1][5]-happiness*2 // note actual grossIncome has a min of $10
//these are hard-coded on page load, but if they become user-modifiable, this will need changing
baseInfraCost = infraCost/cumuMods[1][2]
baseInfraUpkeep = InfraUpkeep/cumuMods[1][3]
baseTechCost = techCost/cumuMods[1][10]



printFields()
}