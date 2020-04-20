function dropDownOptions(element_id, default_text, item_key) {
  var dropdown = document.getElementById(element_id)
  dropdown.length = 0

  var defaultOption = document.createElement('option')
  defaultOption.text = default_text

  dropdown.add(defaultOption)
  dropdown.selectedIndex = 0

  item_key.sort()
  if (element_id === "date-dropdown") {
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

function updateDropDown(items) {
  data_vals = items.meta.fields.filter(e => e !== 'date')
  data_vals = data_vals.filter(e => e !== 'location')

  dropDownOptions('locality-dropdown', 'Choose a region', items.data.map((value, index, array) => {
    return value.location
  }))
  dropDownOptions('data-dropdown', 'Choose data', data_vals)
  dropDownOptions('date-dropdown', 'Choose a date', items.data.map((value, index, array) => {
    return value.date
  }))

  data_vals = items
}

function submit() {
  var dropdown1 = document.getElementById('locality-dropdown')
  var dropdown2 = document.getElementById('data-dropdown')
  var dropdown3 = document.getElementById('date-dropdown')

  if (!dropdown1.selectedIndex || !dropdown2.selectedIndex || !dropdown3.selectedIndex) {
    document.getElementById('content-display').innerHTML = 'Please choose an option for all fields'
  } else {
    var filtered = data_vals.data.filter(e => {
      return e.location === document.getElementById('locality-dropdown').value
    })
    filtered = filtered.filter(e => {
      return e.date === document.getElementById('date-dropdown').value
    })
    console.log(filtered)

    if (filtered.length !== 0) {
      document.getElementById('content-display').innerHTML = "Number of cases: " + filtered[0][document.getElementById('data-dropdown').value]
    } else {
      document.getElementById('content-display').innerHTML = "No data found"
      return
    }

    filtered = data_vals.data.filter(e => {
      return e.location === document.getElementById('locality-dropdown').value
    })
    var values = {
      chart: {
        type: "area",
        animations: {
          initialAnimation: {
            enabled: true
          }
        }
      },
      series: [{
        name: document.getElementById('data-dropdown').value,
        data: filtered.map(e => {
          return {
            x: e.date,
            y: e[document.getElementById('data-dropdown').value]
          }
        })
      }],
      xaxis: {
        type: "datetime"
      }
    }

    if (chart) {
      chart.destroy()
    }
    chart = new ApexCharts(document.querySelector('#chart'), values)
    chart.render()
  }
}

var data_vals
var chart
Papa.parse('https://covid.ourworldindata.org/data/ecdc/full_data.csv', {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: results => {
    console.log('Complete', results.data.length, 'records.');
    updateDropDown(results)
  }
})

