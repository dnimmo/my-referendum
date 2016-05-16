import { Votes } from '../api/votes'

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