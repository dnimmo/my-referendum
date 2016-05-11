import { Template } from 'meteor/templating'
import { Votes } from '../api/votes.js'

import './body.html'

let stay
let inAgeRange
let inLocationRange
let stayCount = 0
let leaveCount = 0

Template.results.helpers({
  votesToStay() {
    return Votes.find({"vote" : true}).count()
  },
  votesToLeave() {
    return Votes.find({"vote" : false}).count()
  },
})
Template.initial_question.helpers({
    votedStay() {
        const userID = document.getElementById('userID').innerText
        if (Votes.find({"_id" : userID}).count() > 0) {            
            return Votes.find({"_id" : document.getElementById('userID').innerText}).fetch()[0].vote   
        } else {
            return false
        }
    },
    votedLeave() {
        const userID = document.getElementById('userID').innerText
        if (Votes.find({"_id" : userID}).count() > 0) {            
            return !Votes.find({"_id" : document.getElementById('userID').innerText}).fetch()[0].vote   
        } else {
            return false
        }
    }
})
Template.body.helpers({
    hasVoted() {
      const userID = document.getElementById('userID').innerText
      return Votes.find({"_id" : userID}).count() > 0 
    }
})
Template.body.events({
  'submit #voteForm'(event) {
    event.preventDefault()
 
    if(!checkIfSelected()) {
      removeClass('.warning', 'hidden')
    } else {
      removeSelected()
      if(hasVoted()) {
        updateCount(stay)
        displayOptions()
      } else {
        showAgeOptions()
      }
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
        console.log('test')
      removeSelected()
      showConfirmation()
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

hasVoted = () => {
    return document.getElementById('hasVoted').innerText
}

// db stuff
addVote = (vote) => {
  const userID = document.getElementById('userID').innerText
  let hasAlreadyVoted = Votes.find({"_id": userID}).count() > 0 ? true : false
  if(hasAlreadyVoted) {
    Votes.update({
      '_id' : userID
    }, {
        $set : {
          'vote' : vote
        }
      })
  } else {    
      Votes.insert({
      vote,
      inLocationRange,
      inAgeRange,
      '_id' : userID
    })
  }
}

// fb stuff
Template.login.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        })
    },
})

Template.user_info.events({
    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
})
