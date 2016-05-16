import { dbActions as db } from '../api/database' // These are the database queries we're using

handleSelection = (event) => {
  addClass('.warning', 'hidden')
  addClass('#thanks', 'hidden')
  removeClass('.submit', 'hidden')
  removeSelected()
  event.target.parentNode.classList.add('selected')
}

addClass = (target, classToAdd) => {
  document.querySelector(target).classList.add(classToAdd)
}

removeClass = (target, classToRemove) => {
  document.querySelector(target).classList.remove(classToRemove)
}

removeSelected = () => {
  const isSelected = document.querySelectorAll('.selected')
  if(isSelected.length !== 0) {
    let i = isSelected.length
    while(i) {
      isSelected[i-1].classList.remove('selected')
      i--
    }
  }
}

showAgeOptions = () => {  
  addClass('#initialQuestion', 'hidden')
  removeClass('#validityAge', 'hidden')
}

showLocationOptions = () => {
  addClass('#validityAge', 'hidden')
  removeClass('#validityLocation', 'hidden')
}

showConfirmation = () => {
  addClass('#validityAge', 'hidden')
  addClass('#validityLocation', 'hidden')
  updateCount(stay)
  displayOptions()
}

displayOptions = () => {
  removeClass('#initialQuestion', 'hidden')
}

updateCount = (stayVote) => {
  handleVote(stayVote)
}

checkIfSelected = (container) => {
  const isSelected = document.querySelectorAll('.selected')
  return isSelected.length !== 0
}

hasVoted = () => document.getElementById('hasVoted').innerText

// db stuff
handleVote = (vote) => {
  const userID = document.getElementById('userID').innerText
  let hasAlreadyVoted = db.checkIfUserHasVoted(userID)
  if(hasAlreadyVoted) {
    db.updateVote(userID, vote)
  } else {    
    db.insertVote(userID, vote, window.inAgeRange, window.inLocationRange)
  }
  logVotes()
}

// log votes for Jambo
logVotes = () => {
    console.clear()
    console.log('Total votes:', db.getTotalVotes())
    console.log('Total votes to stay, in age range and in North-East: ', db.getStayVotesInRangeAndInLocation())
    console.log('Total votes to leave, in age range and in North-East:', db.getLeaveVotesInRangeAndInLocation())
    console.log('Total votes to stay, out of age range: ', db.getStayVotesOutOfRange())
    console.log('Total votes to leave, out of age range: ', db.getLeaveVotesOutOfRange())
    console.log('Total votes to stay, in age range but out of North-East: ', db.getStayVotesInRangeButOutOfLocation())
    console.log('Total votes to leave, in age range but out of North-East: ', db.getTotalVotesOutOfLocation())
}