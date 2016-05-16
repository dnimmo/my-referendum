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
    window.stay = true
  },
  'click #leave'(event) {
    handleSelection(event)
    window.stay = false 
  },
  'click #ageYes'(event) {
    handleSelection(event)
    window.inAgeRange = true
  },
  'click #ageNo'(event) {
    handleSelection(event)
    window.inAgeRange = false
  },
  'click #locationYes'(event) {
    handleSelection(event)
    window.inLocationRange = true
  },
  'click #locationNo'(event) {
    handleSelection(event)
    window.inLocationRange = false
  },
  'click #confirmation'(event) {
    logVotes()
  }
})

// fb stuff
Template.login.events({
  'click #facebook-login': function(event) {
      Meteor.loginWithFacebook({}, function(err){
          if (err) {
              throw new Meteor.Error("Facebook login failed");
          }
      })
  }
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