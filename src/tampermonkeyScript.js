var donations = $('.comment_td').parent()
var pastDonationsCount = localStorage.getItem('donationCount') || 0

if (donations.length > pastDonationsCount) {
  localStorage.setItem('donationCount', donations.length)

  console.log('sending donation(s)')

  for (var i = pastDonationsCount + 1; i <= donations.length; i++) {
    var donation = $(donations[i - 1])
    var amount = donation.children()[1].innerHTML
    console.log(amount.substr(4, amount.length))
    var params = [
      'name=' +
        donation
          .children()[2]
          .innerHTML.split('<br>')[0]
          .replace('.', ''),
      'amount=' + amount.substr(4, amount.length),
      'identifier=' + Math.random(),
      'currency=USD'
    ].join('&')

    console.log(params)
    var url = 'https://br-mario-marathon.herokuapp.com/donation?' + params

    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
  }
}

function reload () {
  location.reload()
}
setTimeout(reload, 20000)
