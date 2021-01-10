function dropDownOptions (element_id, default_text, item_key) {
  var dropdown = document.getElementById(element_id)
  dropdown.length = 0

  var defaultOption = document.createElement('option')
  defaultOption.text = default_text

  dropdown.add(defaultOption)
  dropdown.selectedIndex = 0

  item_key.sort()
  if (element_id === 'date-dropdown') {
    item_key.reverse()
  }

  var items = []
  for (var i = 0; i < item_key.length; i++) {
    if (item_key[i] && items.indexOf(item_key[i]) === -1) {
      items.push(item_key[i])
      var option = document.createElement('option')
      option.text = item_key[i]
      option.value = item_key[i]
      dropdown.add(option)
    }
  }
}

function submit () {
  var dropdown1 = document.getElementById('locality-dropdown')
  var dropdown2 = document.getElementById('data-dropdown')
  var dropdown3 = document.getElementById('date-dropdown')

  if (!dropdown1.selectedIndex || !dropdown2.selectedIndex || !dropdown3.selectedIndex) {
    document.getElementById('content-display').innerHTML = 'Please select an option for each field'
  } else {
    var reqUrl = [gitAPI[0], '/', dropdown1.value, '/', dropdown2.value, '/', dropdown3.value, gitAPI[1]]
    w3.getHttpObject(reqUrl.join(''), (resp) => {
      item = resp.pop()
      if (item.type == "file") {
        document.getElementById('content-display').innerHTML = 'Number of cases: ' + item.name
      }
    })
  }
}

function initLoc (resp) {
  dropDownOptions('locality-dropdown', 'Choose a region', resp.map(function (item) {
    return item.name
  }))
}

function updateType () {
  var dropdown1 = document.getElementById('locality-dropdown')
  var dropdown2 = document.getElementById('data-dropdown')
  var dropdown3 = document.getElementById('date-dropdown')
  if (dropdown1.selectedIndex) {
    var reqUrl = [gitAPI[0], '/', dropdown1.value, gitAPI[1]]
    w3.getHttpObject(reqUrl.join(''), (resp) => {
      dropDownOptions('data-dropdown', 'Choose data', resp.map(function (item) { if (item.type == "dir") {
        return item.name
      }}))
    })
  } else {
    dropdown2.innerHTML = ''
    dropdown3.innerHTML = ''
  }
}

function updateDate () {
  var dropdown1 = document.getElementById('locality-dropdown')
  var dropdown2 = document.getElementById('data-dropdown')
  var dropdown3 = document.getElementById('date-dropdown')
  if (dropdown2.selectedIndex) {
    var reqUrl = [gitAPI[0], '/', dropdown1.value, '/', dropdown2.value, gitAPI[1]]
    w3.getHttpObject(reqUrl.join(''), (resp) => {
      dropDownOptions('date-dropdown', 'Choose a date', resp.map(function (item) { if (item.type == "dir") {
        return item.name
      }}))
    })
  } else {
    dropdown3.innerHTML = ''
  }
}

var gitAPI = ['https://api.github.com/repos/kahteik/cvis/contents/assets/data', '?ref=dataset']
w3.getHttpObject(gitAPI.join(''), initLoc)
document.getElementById('locality-dropdown').addEventListener('change', updateType)
document.getElementById('data-dropdown').addEventListener('change', updateDate)
