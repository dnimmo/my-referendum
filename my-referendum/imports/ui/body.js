import { Template } from 'meteor/templating'
import { Votes } from '../api/votes.js'

import './body.html'

let stay
let inAgeRange
let inLocationRange
let stayCount = 0
let leaveCount = 0
Template.results.helpers({
  test() {
    return "hello"
  },
  votesToStay() {
    return Votes.find({"vote" : true, "inLocationRange" : true}).count()
  },
  votesToLeave() {
    return Votes.find({"vote" : false, "inLocationRange" : true}).count()
  }
})

Template.body.events({
  'submit #voteForm'(event) {
    event.preventDefault()
 
    if(!checkIfSelected()) {
      removeClass('.warning', 'hidden')
    } else {
      removeSelected()
      showAgeOptions()
    }
  },
  'submit #ageForm'(event) {
    event.preventDefault()
    if(!checkIfSelected()) {
      removeClass('.warning', 'hidden')
    } else if(inAgeRange) {
      removeSelected()
      showLocationOptions()
    } else {
      removeSelected()
      showConfirmation(false)
    }
  },
  'submit #locationForm'(event) {
    event.preventDefault()
    if(!checkIfSelected()) {
      removeClass('.warning', 'hidden')
    } else {    
      handleSelection(event)
      showConfirmation()
    }
  },
  'click #stay'(event) {
    handleSelection(event)
    stay = true
  },
  'click #leave'(event) {
    handleSelection(event)
    stay = false 
  },
  'click #ageYes'(event) {
    handleSelection(event)
    inAgeRange = true
  },
  'click #ageNo'(event) {
    handleSelection(event)
    inAgeRange = false
  },
  'click #locationYes'(event) {
    handleSelection(event)
    inLocationRange = true
  },
  'click #locationNo'(event) {
    handleSelection(event)
    inLocationRange = false
  }  
})

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

showConfirmation = (metAgeCriteria = true) => {
  addClass('#validityAge', 'hidden')
  addClass('#validityLocation', 'hidden')
  removeClass('#confirmation', 'hidden')
  if(!metAgeCriteria) {
    removeClass('#ageMessage', 'hidden')
  } else {
    updateCount(stay)
    removeClass('#voteAgainMessage', 'hidden')
    displayOptions()
  }
}

displayOptions = () => {
  removeClass('#initialQuestion', 'hidden')
}

updateCount = (stayVote) => {
  if(stayVote) {
    stayCount += 1
  } else {
    leaveCount += 1
  }
  addVote(stayVote)
}

checkIfSelected = (container) => {
  const isSelected = document.querySelectorAll('.selected')
  return isSelected.length !== 0
}

// db stuff
addVote = (vote) => {
  Votes.insert({
    vote,
    inLocationRange
  })
}
