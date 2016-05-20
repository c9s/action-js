class ActionBootstrapHighlight extends ActionPlugin
  init: (action) ->
    @action = action
    @form = action.form().get(0)
    that = this
    $(action).bind 'action.on_result', (ev,resp) ->
      console.log("Response ",resp)
      that.cleanup()
      that.fromValidations(resp.validations)

  fromValidations: (validations) ->
    for field of validations
      validation = validations[field]
      if validation.valid == false
        @addError field, validation.message or validation.desc
      else
        @addSuccess field, validation.message or validation.desc
    return

  addError: (field, message) ->
    if @form[field]
      $fieldInput = $(@form[field])
      $formGroup = $($fieldInput.parents('.form-group').get(0))
      $fieldInput.after $('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-remove form-control-feedback')
      $fieldInput.after $('<span class="sr-only"/>').text('error')
      if message
        $fieldInput.after $('<span/>').addClass('help-block help-block-validation').text(message)
      $formGroup.addClass 'has-error'
    return

  addWarning: (field, message) ->
    if @form[field]
      $fieldInput = $(@form[field])
      $formGroup = $($fieldInput.parents('.form-group').get(0))
      $fieldInput.after $('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-sign form-control-feedback')
      $fieldInput.after $('<span class="sr-only"/>').text('warning')
      if message
        $fieldInput.after $('<span/>').addClass('help-block help-block-validation').text(message)
      $formGroup.addClass 'has-warning'
    return

  addSuccess: (field, message) ->
    if @form[field]
      $fieldInput = $(@form[field])
      $formGroup = $($fieldInput.parents('.form-group').get(0))
      $fieldInput.after $('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-ok form-control-feedback')
      $fieldInput.after $('<span class="sr-only"/>').text('success')
      if message
        $fieldInput.after $('<span/>').addClass('help-block help-block-validation').text(message)
      $formGroup.addClass 'has-success'
    return

  cleanup: ->
    for field of @form
      el = @form[field]
      if el instanceof Node and el.nodeName == 'INPUT'
        $formGroup = $($(el).parents('.form-group').get(0))
        $formGroup.removeClass 'has-error has-success has-warning'
        $formGroup.find('.glyphicon').remove()
        $formGroup.find('.sr-only').remove()
        $formGroup.find('.help-block-validation').remove()
    return

  getFirstInvalidField: ->
    $(@form).find('.has-error, .has-warning').get 0


window.ActionBootstrapHighlight = ActionBootstrapHighlight
