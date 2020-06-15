const Team = require('./models/team')  
const resolvers = {
        Query:{   
            teams: () => {
                try{
                    return Team.find({}, function(err, result) {
                        if (err) {
                          return err;
                        } else {
                           console.log(result,'resuly') 
                          return result;
                        }
                      });
                   

                }catch(err){

                }
                
            }
            
        },
        Mutation: {
           
            createTeam: (_,args) => {
                try{
                    const team = new Team({
                        name: args.input.name,
                        skills: args.input.skills
                    });
                    return team.save().then(result => {
                        console.log(result._doc,'result._doc')
                        return {...result._doc}
                    }).catch(err => {
                        return {'code': 500, 'message':'Problem in adding user'}
                        console.log(err)
                    });
                 }catch(err){
                    return {'code': 500, 'message':'Problem in adding user'}
                 }    
             
            }
        }
        
}
module.exports = {resolvers}


