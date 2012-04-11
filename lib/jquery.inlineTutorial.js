(function() {

  $.widget("ui.inlineTutorial", {
    options: {
      steps: [],
      targetDiv: "",
      current_step: null,
      current_step_id: 0,
      speed: 5000
    },
    _create: function() {
      var self;
      self = this;
      this._constructContainer();
      $("#inline_tutorial_box .controls .tutorial_next").live("click", function() {
        return self.next_step();
      });
      $("#inline_tutorial_box .controls .tutorial_previous").live("click", function() {
        return self.previous_step();
      });
      return $(this.element).append("<div id='inline_tutorial_outer'></div>");
    },
    _constructContainer: function() {
      return this.options.template = JST["app/views/tutorial"];
    },
    start: function() {
      var op, self, step;
      op = this.options;
      op.current_step = op.steps[0];
      step = op.current_step;
      self = this;
      $("#inline_tutorial_outer").append(this.options.template(step)).css("top", step.location[1]).css("left", step.location[0]);
      if (typeof op.current_step.onShow === "function") {
        op.current_step.onShow.call(self);
      }
      self.setUpIndicator(op.current_step.indicatorPos);
      return this.show();
    },
    show: function() {
      return $("#inline_tutorial_outer").fadeIn(2000, function() {});
    },
    next_step: function(withEvents) {
      var op;
      if (withEvents == null) withEvents = true;
      op = this.options;
      if (typeof op.current_step.onLeave === "function" && withEvents) {
        op.current_step.onLeave.call(this);
      }
      this.removeExternalTriggers();
      if (op.current_step_id === op.steps.length - 1) {
        return this.restart();
      } else {
        op.current_step_id = op.current_step_id + 1;
        op.current_step = op.steps[op.current_step_id];
        return this.setup_step();
      }
    },
    setup_step: function() {
      var op, self, speed;
      self = this;
      op = self.options;
      speed = op.current_step.speed || op.speed;
      $(".inline-indicator").remove();
      this.setUpExternalTriggers();
      return $("#inline_tutorial_outer").animate({
        top: op.current_step.location[1],
        left: op.current_step.location[0]
      }, speed, function() {
        $("#inline_tutorial_box").replaceWith(op.template(op.current_step));
        if (typeof op.current_step.onShow === "function") {
          op.current_step.onShow.call(self);
        }
        if (op.current_step.disableControls === true) {
          $(".controls").children().hide();
          if (op.current_step.prompt != null) {
            $(".controls").append("<p class='prompt'>" + op.current_step.prompt + "</p>");
          }
        }
        return self.setUpIndicator(op.current_step.indicatorPos);
      });
    },
    removeExternalTriggers: function() {
      var current_step, op, self;
      self = this;
      op = self.options;
      current_step = op.current_step;
      if (op.current_step.triggers != null) {
        return $.each(current_step.triggers, function(index, trigger) {
          return $(trigger.elements).die(trigger.action + ".inlineTutorial");
        });
      }
    },
    setUpExternalTriggers: function() {
      var current_step, op, self;
      self = this;
      op = self.options;
      current_step = op.current_step;
      if (current_step.triggers != null) {
        return $.each(current_step.triggers, function(index, trigger) {
          return $(trigger.elements).live(trigger.action + ".inlineTutorial", function() {
            return self.next_step();
          });
        });
      }
    },
    setUpIndicator: function(indicatorPos) {
      var indicatorDiv, settings;
      if (indicatorPos != null) {
        indicatorDiv = $("<div class=\"inline-indicator\"></div>");
        settings = indicatorPos.split(" ");
        $(indicatorDiv).addClass("inline-arrow-" + settings[0]);
        $(indicatorDiv).addClass("inline-arrow-" + settings[1]);
        return $("#inline_tutorial_outer").append($(indicatorDiv));
      }
    },
    previous_step: function() {
      var op;
      op = this.options;
      if (typeof op.current_step.onLeave === "function") {
        op.current_step.onLeave.call(this);
      }
      op.current_step_id = op.current_step_id - 1;
      return op.current_step = op.steps[op.current_step_id];
    },
    dismiss: function() {
      return $("#inline_tutorial_outer").fadeOut(200);
    },
    restart: function() {
      var op, self;
      self = this;
      op = this.options;
      return $("#inline_tutorial_outer").fadeOut(200, function() {
        op.current_step_id = 0;
        op.current_step = op.steps[op.current_step_id];
        return self.setup_step();
      });
    },
    overlay: function() {}
  });

}).call(this);
