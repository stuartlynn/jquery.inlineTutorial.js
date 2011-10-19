$.widget("ui.inlineTutorial", {
  options: { steps : [], targetDiv:"",current_step: null,current_step_id:0, speed:5000 },
   _create:function(){
      var self =this;
      // console.log(this.options.steps);
      this._constructContainer();
      $("#inline_tutorial_box .controls .tutorial_next").live('click', function(){
         self.next_step();
      });
      $("#inline_tutorial_box .controls .tutorial_previous").live('click', function(){
         self.previous_step();
      });
      $(this.element).append("<div id='inline_tutorial_outer'></div>");
   },

   _constructContainer: function(){
      this.options.template = $.template(null, ["<div id='inline_tutorial_box' >",
      "<h1 class='tutorial_header'> ${title} </h1> ",
      "<p class='tutorial_text'>${text}</p> ",    
      "<div class='controls'> ",
      // "      <span class='tutorial_previous'>previous</span>",
      "      <span class='tutorial_next'>next</span>",
      "</div>",
      "</div>"].join(" "));
   },
   start: function(){
      var op = this.options;
      op.current_step= op.steps[0];
      var step = op.current_step;
      var self = this;
      $("#inline_tutorial_outer").append($.tmpl(this.options.template, step)).css("top",step.location[1]).css("left", step.location[0]);
      if(typeof op.current_step.onShow == 'function'){
               op.current_step.onShow.call(self);
      }
      self.setUpIndicator(op.current_step.indicatorPos);
   },
	 show: function(){
	   $("#inline_tutorial_outer").fadeIn(100, function(){
           // $(this).hide();
     });
	 },
   next_step: function(withEvents){

      if(withEvents==null) withEvents=true;


      var op  =this.options;
      if(typeof op.current_step.onLeave == 'function' && withEvents){
         op.current_step.onLeave.call(this);
      }

      this.removeExternalTriggers();

      // console.log("current step is "+ op.current_step_id+" total "+ op.steps.length);
      if(op.current_step_id == op.steps.length-1){
         // console.log('dismissing');
         this.restart();
      }
      else{
         op.current_step_id = op.current_step_id +1 ;
         op.current_step = op.steps[op.current_step_id] ;
         this.setup_step();
      }
   },
   setup_step: function(){
      var self=this;
      var op  =self.options;
      var speed = op.current_step.speed  || op.speed; 
      $(".indicator").fadeOut(2000,function(){$(".inline-indicator").remove()});

      this.setUpExternalTriggers();

      $("#inline_tutorial_outer").animate({'top':op.current_step.location[1],'left':op.current_step.location[0]}, speed, function(){
            $("#inline_tutorial_box").replaceWith( $.tmpl(op.template, op.current_step));  
            if(typeof op.current_step.onShow == 'function'){
               op.current_step.onShow.call(self);
            }


            if(op.current_step.disableControls==true){
               $(".controls").children().hide();
               if(op.current_step.prompt!=null){
                  $(".controls").append("<p class='prompt'>"+op.current_step.prompt+"</p>");
               }
            }

            self.setUpIndicator(op.current_step.indicatorPos);

            
      });
   },   
   removeExternalTriggers: function(){
      var self=this;
      var op  =self.options;
      var current_step = op.current_step;

      if(op.current_step.triggers!=null){
          $.each(current_step.triggers, function(index,trigger ){
            $(trigger.elements).unbind(trigger+".inlineTutorial");      
         }); 
      }
   },
   setUpExternalTriggers: function(){
      var self=this;
      var op  =self.options;
      var current_step = op.current_step;

      if(current_step.triggers!=null){
         $.each(current_step.triggers, function(index,trigger ){
            $(trigger.elements).bind(trigger.action+".inlineTutorial", function(){self.next_step()} );      
         });
      }
   },  
   setUpIndicator: function(indicatorPos){
      if( indicatorPos != null){
         var indicatorDiv =$('<div class="inline-indicator"></div>');
         var settings = indicatorPos.split(" ");
         $(indicatorDiv).addClass('inline-arrow-'+settings[0]);
         $(indicatorDiv).css(settings[1],'0px');
         $('#inline_tutorial_outer').append($(indicatorDiv));
      } 
   },
   previous_step:function(){
      var op = this.options;

      if(typeof op.current_step.onLeave == 'function'){
         op.current_step.onLeave.call(this);
      }

      op.current_step_id = op.current_step_id -1 ;
      op.current_step = op.steps[op.current_step_id] ;
   },
   dismiss: function(){
      $("#inline_tutorial_outer").fadeOut(200, function(){
            // $(this).hide();
      });
   },
   restart: function(){
		this_id = this; 
		var op = this.options;
	   $("#inline_tutorial_outer").fadeOut(200, function(){
	     op.current_step_id = 0;
	     op.current_step = op.steps[op.current_step_id] ;
	     this_id.setup_step();
			 $("#help_button").removeClass('helpon');
			 window.help_show = false;
     });
   },
   overlay:function(){
         
   }
});