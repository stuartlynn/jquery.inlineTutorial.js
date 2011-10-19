jquery.inlineTutorial.js is a jquery ui plugin to allow quick and easy inline tutorials for sites to be created. You can see it in action at whales.zooniverse.org

its setup with

("#containerElement").inlineTutorial(); 

It takes an array of steps as an argument :
("#containerElement").inlineTutorial({steps : [] } );

the plugin then runs through each step in turn. A step looks like this : 

  {
         title: "A title",
         text: "Blah balh this is stuff blah blah ",
         location: [640,90],
         onLeave: function(){ },
         triggers: [{elements : "#someOtherElement", action: "click"}],
         disableControls: true,
         prompt: "Do something",
         speed:200,
         indicatorPos: "left top"
  }

and can have the following properties :

title : the title of the step
text : the main text of the step
location : relative location of the box with in its parent div (in this case #containerElement)
onLeave: a function to run when we move to the next step 
onShow: a function to run when the step is shown  
triggers : a has of elements and actions that can also trigger moving to the next step 
disableControls : disable manually moving to the next step … so in this case the user has to click the main sound button to move on
prompt : an added prompt to be shown at the bottom of the help box, used mainly to indicate what the user should do to move on when disableControls is set to true 
speed: the transition speed TO this help element from the last one 
indicatorPos: the position of the arrow on the help box, can be any of ["top right", "top left", "bottom right", "bottom left", "left top",  "left bottom", "right top", " right bottom"] or just don't set to have nothing
