require('dotenv').config();
let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let User, Exercise;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
});

const exerciseSchema = new mongoose.Schema({
    description: String,
    duration: Number,
    date: String,
    userID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

User = mongoose.model('User', userSchema);
Exercise = mongoose.model('Exercise', exerciseSchema);

const createUser = (userdata, done) => {
    const user = new User(userdata);
    user.save(function (err, data) {
        if (err) return done(err);
        done(null, {
            username: data.username,
            _id: data._id
        });
    });
};

const findAllUsers = (done) => {
    User.find(function (err, data) {
        if (err) return done(err);
        done(null, data);
    });
};


const createExercise = (userId, body, done) => {
    User.findById({ _id: userId }, function (err, person) {
        if (err) return done(err);
        body.userID = userId;
        if (body.date === '' || body.date === undefined) {
            body.date = new Date().toISOString();
        } else {
            body.date = new Date(body.date).toISOString();
        }
        const exc = new Exercise(body);

        exc.save(function (error, data) {
            if (error) return done(error);
            const resp = {
                username: person.username,
                description: data.description,
                duration: data.duration,
                date: new Date(data.date).toDateString(),
                _id: person._id,
            }
            done(null, resp);
        });
    });
};

const findUserLogs = (req, done) => {
    userId = req.params._id;
    var { from, to, limit } = req.query;
    User.findById({ _id: userId }, function (err, userdata) {
        if (err) return done(err);
        let query = Exercise.find({ userID: userId });
        if (from !== undefined && to !== undefined) {
            let startDate = new Date(from).toISOString();
            let endDate = new Date(to).toISOString();
            query = query.where('date').gte(startDate).lte(endDate);
        }
        if (limit !== undefined) {
            query = query.limit(parseInt(limit));
        }
        query
            .select({ _id: false, userID: false, __v: false })
            .exec(function (error, data) {
                if (error) return done(error);

                data = data.map(function (val, index) {
                    val.date = new Date(val.date).toDateString();
                    return val
                });
                done(null, {
                    username: userdata.username,
                    count: data.length,
                    _id: userdata._id,
                    log: data,
                });
            });
    });
};


/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.createUser = createUser;
exports.createExercise = createExercise;
exports.findAllUsers = findAllUsers;
exports.findUserLogs = findUserLogs;