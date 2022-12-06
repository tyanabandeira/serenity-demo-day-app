
  // SCATTER PLOT: HOURS OF SLEEP VS. DEPRESSION SCALE ==============================
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawCharts);

async function drawCharts() {
  const progressData = await fetch('/progressApi')
  const json = await progressData.json()
  if (json.length > 0) {
    sleepChart(json)
    copingChart(json)
    symptomChart(json)
    lineChart(json)
  } else {
    // 'tell the user there is no data'
  }

}
function sleepChart(json) {
  // Set Data
  const array = [['Depression', 'Sleep']]
  for (let i = 0; i < json.length; i++) {
    const a = [Number(json[i].currentMood), Number(json[i].hoursOfSleep) / 10]
    array.push(a)
  }
  var data = google.visualization.arrayToDataTable(array)


  // Set Options
  var options = {
    title: 'Depression vs. Hours of Sleep',
    hAxis: { title: 'Hours of Sleep' },
    vAxis: { title: 'Depression Scale' },
    legend: 'none'
  };
  // Draw
  var chart = new google.visualization.ScatterChart(document.getElementById('myChart'));
  chart.draw(data, options);
}

  // COPING SKILLS ==============================

function copingChart(json) {
  // Set Data
  const copingCount = {}
  for (let i = 0; i < json.length; i++) {
    const copingSkill = json[i].copingSkills
    let count = copingCount[copingSkill]
    if (count) {
      count++
    } else {
      count = 1
    }
    copingCount[copingSkill] = count
  }
  const entries = Object.entries(copingCount)
  entries.unshift(['Coping Skill', 'Frequency'])
  var data = google.visualization.arrayToDataTable(entries)

  var options = {
    title: 'Coping Skills'
  };

  var chart = new google.visualization.PieChart(document.getElementById('pieChart'));
  chart.draw(data, options);
}


  // DEPRESSION VS. SYMPTOMS ==============================


function symptomChart(json) {
  let array = [['Symptoms', 'Mood']]
  for (let i = 0; i < json.length; i++) {
    const moodScale = Number(json[i].currentMood) / 10
    const symptom = json[i].symptoms
    const info = [symptom, moodScale]
    console.log(info)
    array.push(info)

  }
  console.log(array)
  var data = google.visualization.arrayToDataTable(array);

  var options = {
    title: 'Mood scale and symptoms'
  };

  var chart = new google.visualization.BarChart(document.getElementById('barChart'));
  chart.draw(data, options);
}





  // LINE GRAPH: DEPRESSION VS. TIME ==============================


async function lineChart(json) {
  // Set Data
  let array = [['Depression', 'Date']]
  for (let i = 0; i < json.length; i++) {
    const depressionScale = Number(json[i].currentMood) / 10
    const date = json[i].date 
    const info = [date, depressionScale]
    console.log(info, json[i])
    array.push(info)
  }
  var data = google.visualization.arrayToDataTable(array);
  // Set Options
  var options = {
    title: 'Depression over time',
    hAxis: { title: 'Date' },
    vAxis: { title: 'Depression Scale' },
    legend: 'none'
  };
  // Draw
  var chart = new google.visualization.LineChart(document.getElementById('lineChart'));
  chart.draw(data, options);
}



