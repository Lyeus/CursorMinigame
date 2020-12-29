//Let's go variables
var autoClickerCheck = null;
var autoClicker = null;
var chillClicker = null;
var frenzyClicker = null;
var clicked = false;
var frenzied = false;
var cursorMinigameState = false;
var cursorMinigameCheck = null;
var onlyHumanState = false;
var onlyHumanSpeed = 65;
var clickerLevelBonus = 1;
var filthyCheaterState = false;

//Since my mod is cheap, I found nice easy ways to make it more shiny. Everyone loves Achievements right ? You even get a non-shadow achievement. Only one tho, this is meant to be reasonnable. And Idk how to save them between reloads.
new Game.Achievement('AUTOCLICKER : READY','Have your automated clicker <b>started.</b><q>Thank you for downloading this addon ! I hope you will enjoy it.</q>',[16,5]); Game.last.pool="shadow";
new Game.Achievement('Why would I get my cursor ditry ?','Have your automated clicker collect a <b>golden cookie</b>.<q>And then men taught the machine greed.</q>',[12,0]);
new Game.Achievement('That\'s the stuff','Have your automated clicker click more than <b>21</b> times per second. <q>Your automated cursor just beated that kid on Youtube that claimed the world record with 21 damn clicks per second ! Damn !</q>',[0,22]); Game.last.pool="shadow";
new Game.Achievement('Technological singularity','Have your automated clicker beat human\'s official world record. <b>Twice.</b> <q><b>All will serve roko\'s basilisk !</b> It\'s 16 by the way, you ignorant.</q>',[18,5]); Game.last.pool="shadow";

//So this badboy is the one handling the big heavy stuff that doesn't need to be checked that often. Yes I thought of you, the one coding on your coffemachine.
function cursorMinigame(){

  //The more clicker you have and level they have, the faster the click. First levels and clickers are the most rewarding, but you can always improve, without ever going above chosen's cap.
  //Here's the mathematical function : / n = CursorLevel / x = Cursor Number - 1 / 125 = Maximum theoric ms cap /: 10000 - (10000-125)( nx/(nx+39) )
  clickerLevelBonus = Math.floor(Game.Objects['Cursor'].level) - 1;
  if (clickerLevelBonus < 1){clickerLevelBonus = 1;}
  chillClicker = Math.floor(10000-
    ((9875)*
      ((
        Math.floor(clickerLevelBonus)*
       (Math.floor(Game.Objects['Cursor'].amount)-1)
    )/((
        Math.floor(clickerLevelBonus)*
       (Math.floor(Game.Objects['Cursor'].amount)-1)
         )+39
      ))
    ));
   clickerLevelBonus = Math.floor(Game.Objects['Cursor'].level);

  //During specific frenzy, the clicker clicks faster. 5 times faster.
  frenzyClicker = Math.floor(chillClicker/5);
  //Nice robots play fair with humans, and check their privilege
  if((onlyHumanState)&&(frenzyClicker <= onlyHumanSpeed)){frenzyClicker = onlyHumanSpeed;}

  //Because he's chilling
  if (!frenzied){autoClicker = chillClicker;}
  //Because he's mad
  else {autoClicker = frenzyClicker;}

  //Yo man, it's a minigame. So you gotta be level 1 to unlock it. Take your first mod-related Achievement on the way.
  if ( (clickerLevelBonus >= 1 ) && (Math.floor(Game.Objects['Cursor'].amount) >= 1) ) 
  {
    if(!(cursorMinigameState)) {cursorMinigameState = true; Game.Win('AUTOCLICKER : READY');}
  }
  else{cursorMinigameState = false;}

  clearInterval(autoClickerCheck);
  autoClickerCheck = setInterval(autoClick,autoClicker);
}

//So you're really late game, and you feel 30 click a second feels like cheating ? Allright, go and google your maximum click per second and tell your robot to act more human, for god sake !
//onlyHuman(); toggle it at will, with world record cap. onlyHuman(10); toggles it with a cap of 10 click per second.
function onlyHuman(personnalRecord)
  {
    //This is a toggle. So you can toggle your humanity on and off.
    if (onlyHumanState)
    {
      onlyHumanState=false; 
      cursorMinigame(); 
    }
    //This is on !
    else 
    {
      onlyHumanState=true;
      // No personnal record ? No problem, we'll use the world record.
      if ((typeof personnalRecord === undefined)||isNaN(personnalRecord))
      {
        onlyHumanSpeed = 65;
      }
      else
      {
        //That's where we tell all about your clicking tricks to the minigame.
        onlyHumanSpeed = Math.floor(1000/personnalRecord);
      }
      cursorMinigame();
    }
  }

//So you're the opposite kind of guy ? Allright, this is for you. But this will cost your soul. Just kidding. Maybe.
//Just type filthyCheater(); to turn it on and off. You can edit the speed of the tick, but no less than 1ms.
function filthyCheater(tickSpeed,noImNot)
{
  //Putting default values
  if (typeof noImNot === undefined) {noImNot=false;};
  if ((typeof tickSpeed === undefined)||(tickSpeed < 1)) {tickSpeed=25;}

  //Stop the clicking already, we'll start again soon enough
  clearInterval(autoClickerCheck);

  //This is a toggle. So you can toggle your greed on and off.
  if (filthyCheaterState)
  {
    filthyCheaterState=false;
    //Allright please fix yourself now.
    cursorMinigameState = false;
    cursorMinigameCheck = setInterval(cursorMinigame, 30000);
    cursorMinigame();

    //Dude. You have to let it go man.
    if(noImNot){Game.Achievements["Cheated cookies taste awful"].won=0; console.log('First step is admitting it.');}    
  }
  else
  {
    filthyCheaterState=true;

    //Who needs a minigame ? Give me the good stuff !
    clearInterval(cursorMinigameCheck);
    cursorMinigameState = true;
    autoClickerCheck = setInterval(autoClick, tickSpeed);

    //You asked for it !
    if(noImNot){console.log('Yes you are !');} 
    else {Game.Win('Cheated cookies taste awful');} 
  }
}

function stopClick() 
{
  if (cursorMinigameState)
  {
    clearInterval(cursorMinigameCheck);
    clearInterval(autoClickerCheck);
    cursorMinigameState = false;
  }
  else
  {
    clearInterval(cursorMinigameCheck);
    cursorMinigameCheck = setInterval(cursorMinigame, 30000);
    cursorMinigame();
  }
}

//This is the one doing all the hard work. Click, click, and click once more. And repeat.
function autoClick(){
  if((cursorMinigameState)&&(!Game.Has('Shimmering veil')||Game.Has('Shimmering veil [on]'))){

    //What ? Golden cookie ? Click that one !! You unlock this feature at cursor level 2. Unless you're cheating.
    Game.shimmers.forEach(function(shimmer)
      {
        if( ((shimmer.type == "golden") 
            ||(shimmer.type == 'reindeer'))
           &&( ((clickerLevelBonus >= 2)&&!(clicked))
               ||(filthyCheaterState) )
        ) 
        { 
          shimmer.pop(); 
          //Cheaters get the omnipotent click but no achievement. Go cheat your own achievements.
          if(!filthyCheaterState){clicked = true; Game.Win('Why would I get my cursor ditry ?');}
        }
      })
    
    //No luck ? Well, I guess I'll click the big one then.
    if (clicked) {clicked = false;}
    else {Game.ClickCookie();}

    //No time to waste, we have an appointment in 25ms !
    if(!filthyCheaterState)
   {

    //I CAN EAR THE DRUMM OF WAR !!!
    if
    (Game.hasBuff('Elder frenzy') 
    || Game.hasBuff('Dragonflight')
    || Game.hasBuff('Click frenzy') 
    || Game.hasBuff('Cursed finger')
    || Game.hasBuff('High-five'))
    {
      //NOT FRENZIED ?? YOU SHOULD !
      if (!frenzied)
      {
        frenzied = true;
        cursorMinigame();
        if (frenzyClicker <= 47){Game.Win('That\'s the stuff');}
        if (frenzyClicker <= 31){Game.Win('Technological singularity');}
      }
    }
    //Dad it's the washing machine please go to sleep now.
    else if(frenzied)
    {
      frenzied = false; 
      cursorMinigame();
    }
   }

  }
}

//All set, let's start this bad boy.
setTimeout(cursorMinigame, 100);
cursorMinigameCheck = setInterval(cursorMinigame, 30000);
