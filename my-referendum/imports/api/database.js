import { Votes } from './votes'

export const dbActions = {
  getTotalVotes: () => Votes.find().count(),
  
  getStayVotesInRangeAndInLocation: () => Votes.find({'vote': true, 'inAgeRange': true, 'inLocationRange' : true}).count(),
  
  getLeaveVotesInRangeAndInLocation: () => Votes.find({'vote': false, 'inAgeRange': true, 'inLocationRange' : true}).count(),
  
  getStayVotesOutOfRange: () => Votes.find({'vote': true, 'inAgeRange': false}).count(),
  
  getLeaveVotesOutOfRange: () => Votes.find({'vote': false, 'inAgeRange': false}).count(),
  
  getStayVotesInRangeButOutOfLocation: () => Votes.find({'vote': true, 'inAgeRange': true, 'inLocationRange' : false}).count(),
  
  getTotalVotesOutOfLocation: () => Votes.find({'vote': false, 'inAgeRange': true, 'inLocationRange' : false}).count(),
  
  checkIfUserHasVoted: userID => Votes.find({"_id": userID}).count() > 0 ? true : false,
  
  insertVote:  (userID = false, vote = false, inAgeRange = false, inLocationRange = false) => {
    Votes.insert({
      vote,
      inAgeRange,
      inLocationRange,
      '_id' : userID
    })
  },
  
  updateVote: (userID = false, vote = false) => {
    Votes.update({
      '_id' : userID
    }, {
      $set : {
        'vote' : vote
      }
    })
  }
}
