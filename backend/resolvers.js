const events = [{
    _id: '3435',
    title: 'first',
    description: 'this is description',
    price: 240.00,
    date: '20-02-2020' 
}];  
const resolvers = {
        Query:{   
            events: () => {
                return events
            }
        },
        Mutation: {
            createEvent: args => {
                console.log(args,'args')
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date().toISOString
                }
                events.push(event)
            }
        }
        
}
module.exports = {resolvers}


