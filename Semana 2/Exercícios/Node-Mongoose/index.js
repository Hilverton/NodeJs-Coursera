const mongoose = require('mongoose');
const Dishes = require('./models/dish');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

connect.then(() => {
    console.log('Connected correctly to server');

    Dishes.create({
        name: 'Pizza',
        description: 'test'
    })
    .then(dish => {
        console.log(dish);

        return Dishes.findByIdAndUpdate(dish._id, {
            $set: { description: 'Updated test'}
        },{ 
            new: true 
        })
        .exec();
    })
    .then(dish => {
        console.log('dish:',dish);
        
        dish.comments.push({
            rating: 5,
            comment: 'I\'m getting a sinking feeling!',
            author: 'Leonardo di Carpaccio'
        });

        return dish.save();
    })
    .then(dish => {
        console.log(dish);

        return Dishes.deleteOne({});
    })
    .then(() => mongoose.connection.close())
    .catch(err => console.log(err));
});
