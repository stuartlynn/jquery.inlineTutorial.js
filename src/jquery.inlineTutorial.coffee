$.widget "ui.inlineTutorial",
  options:
    steps: []
    targetDiv: ""
    current_step: null
    current_step_id: 0
    speed: 5000

  _create: ->
    self = this

    @_constructContainer()
    $("#inline_tutorial_box .controls .tutorial_next").live "click", ->
      self.next_step()

    $("#inline_tutorial_box .controls .tutorial_previous").live "click", ->
      self.previous_step()

    $("#inline_tutorial_box .controls .tutorial_close").live "click", ->
      self.dismiss()
      
    $(@element).append "<div id='inline_tutorial_outer'></div>"

  _constructContainer: ->
    @options.template = JST["app/views/tutorial"]

  start: ->
    op = @options
    op.current_step = op.steps[0]
    step = op.current_step
    self = this
    $("#inline_tutorial_outer").append(@options.template(step)).css("top", step.location[1]).css "left", step.location[0]
    op.current_step.onShow.call self  if typeof op.current_step.onShow is "function"
    self.setUpIndicator op.current_step.indicatorPos
    @show()
  show: ->
    $("#inline_tutorial_outer").fadeIn 2000, ->

  next_step: (withEvents) ->
    withEvents = true  unless withEvents?
    op = @options
    op.current_step.onLeave.call this  if typeof op.current_step.onLeave is "function" and withEvents
    @removeExternalTriggers()
    if op.current_step_id is op.steps.length - 1
      @restart()
    else
      op.current_step_id = op.current_step_id + 1
      op.current_step = op.steps[op.current_step_id]
      @setup_step()

  setup_step: ->
    self = this
    op = self.options
    speed = op.current_step.speed or op.speed
    $(".inline-indicator").remove()

    @setUpExternalTriggers()
    $("#inline_tutorial_outer").animate
      top: op.current_step.location[1]
      left: op.current_step.location[0]
    , speed, ->
      $("#inline_tutorial_box").replaceWith op.template(op.current_step)
      op.current_step.onShow.call self  if typeof op.current_step.onShow is "function"
      if op.current_step.disableControls is true
        $(".controls").children().hide()
        $(".controls").append "<p class='prompt'>" + op.current_step.prompt + "</p>"  if op.current_step.prompt?
      self.setUpIndicator op.current_step.indicatorPos

  removeExternalTriggers: ->
    self = this
    op = self.options
    current_step = op.current_step
    if op.current_step.triggers?
      $.each current_step.triggers, (index, trigger) ->
        $(trigger.elements).die trigger.action+".inlineTutorial"

  setUpExternalTriggers: ->
    self = this
    op = self.options
    current_step = op.current_step

    if current_step.triggers?
      $.each current_step.triggers, (index, trigger) ->
        $(trigger.elements).live trigger.action + ".inlineTutorial", ->
          self.next_step()

  setUpIndicator: (indicatorPos) ->
    if indicatorPos?
      indicatorDiv = $("<div class=\"inline-indicator\"></div>")
      settings = indicatorPos.split(" ")
      $(indicatorDiv).addClass "inline-arrow-" + settings[0]
      $(indicatorDiv).addClass "inline-arrow-" + settings[1]
      $("#inline_tutorial_outer").append $(indicatorDiv)

  previous_step: ->
    op = @options
    op.current_step.onLeave.call this  if typeof op.current_step.onLeave is "function"
    op.current_step_id = op.current_step_id - 1
    op.current_step = op.steps[op.current_step_id]

  dismiss: ->
    $("#inline_tutorial_outer").fadeOut 200

  restart: ->
    self = this
    op = @options
    $("#inline_tutorial_outer").fadeOut 200, ->
      op.current_step_id = 0
      op.current_step = op.steps[op.current_step_id]
      self.setup_step()

  overlay: ->