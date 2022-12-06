const btn = document.querySelector('.btn')

btn.addEventListener('click', (e) => {
  // e.preventDefault()
  console.log('logging...')
  const selectMenu =e.target.parentNode.childNodes[3]
  const therapy = selectMenu.childNodes[3].value

  fetch('startTherapy', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      therapy: "group"
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
  })
})