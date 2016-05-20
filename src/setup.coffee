$ ->
  $.ajaxSetup 'beforeSend': (xhr, settings) ->
    getCookie = (name) ->
      cookieValue = null
      if document.cookie and document.cookie != ''
        cookies = document.cookie.split(';')
        i = 0
        while i < cookies.length
          cookie = jQuery.trim(cookies[i])
          # Does this cookie string begin with the name we want?
          if cookie.substring(0, name.length + 1) == name + '='
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
            break
          i++
      cookieValue
    if settings.type == 'POST' or settings.type == 'PUT' or settings.type == 'DELETE'
      if !(/^http:.*/.test(settings.url) or /^https:.*/.test(settings.url))
        # Only send the token to relative URLs i.e. locally.
        xhr.setRequestHeader 'X-CSRF-TOKEN', getCookie('csrf')
    return
  return
