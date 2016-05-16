import { Template } from 'meteor/templating'
import { Votes } from '../api/votes.js'

import './body.html'

let stay
let inAgeRange
let inLocationRange

Template.results.helpers({
  votesToStay() {
    return Votes.find({"vote" : true}).count()
  },
  votesToLeave() {
    return Votes.find({"vote" : false}).count()
  },
  totalVotes() {
    let votes = Votes.find().count().toString()
    votes = votes.replace(new RegExp("^(\\d{" + (votes.length%3?votes.length%3:0) + "})(\\d{3})", "g"), "$1 $2").trim().replace(/(\d{3})+?/gi, " , $1").trim()
    return votes
  }
})
Template.body.helpers({
    hasVoted() {
      const userID = document.getElementById('userID').innerText
      return Votes.find({"_id" : userID}).count() > 0 
    },    
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
    },
    fbShareLink() {
      const link = 'http://www.facebook.com/sharer/sharer.php?&u=' + window.location.href
      return link
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
  },
  'click #confirmation'(event) {
    logVotes()
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
  addVote(stayVote)
}

checkIfSelected = (container) => {
  const isSelected = document.querySelectorAll('.selected')
  return isSelected.length !== 0
}

hasVoted = () => document.getElementById('hasVoted').innerText

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
  logVotes()
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

// log votes for Jambo

getTotalVotes = () => Votes.find().count()
getStayVotesInRangeAndInLocation = () => Votes.find({'vote': true, 'inAgeRange': true, 'inLocationRange' : true}).count()
getLeaveVotesInRangeAndInLocation = () => Votes.find({'vote': false, 'inAgeRange': true, 'inLocationRange' : true}).count()
getStayVotesOutOfRange = () => Votes.find({'vote': true, 'inAgeRange': false}).count()
getLeaveVotesOutOfRange = () => Votes.find({'vote': false, 'inAgeRange': false}).count()
getStayVotesInRangeButOutOfLocation = () => Votes.find({'vote': true, 'inAgeRange': true, 'inLocationRange' : false}).count()
getTotalVotesOutOfLocation = () => Votes.find({'vote': false, 'inAgeRange': true, 'inLocationRange' : false}).count()

logVotes = () => {
    console.clear()
    console.log('Total votes:', getTotalVotes())
    console.log('Total votes to stay, in age range and in North-East: ', getStayVotesInRangeAndInLocation())
    console.log('Total votes to leave, in age range and in North-East:', getLeaveVotesInRangeAndInLocation())
    console.log('Total votes to stay, out of age range: ', getStayVotesOutOfRange())
    console.log('Total votes to leave, out of age range: ', getLeaveVotesOutOfRange())
    console.log('Total votes to stay, in age range but out of North-East: ', getStayVotesInRangeButOutOfLocation())
    console.log('Total votes to leave, in age range but out of North-East: ', getTotalVotesOutOfLocation())
}
