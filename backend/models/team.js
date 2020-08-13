const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    skills:{
        type: String,
        required: false
    }
},{ timestamps: true })

teamSchema.plugin(mongoose_delete,{ overrideMethods: 'all' }),
module.exports = mongoose.model('Team',teamSchema)
