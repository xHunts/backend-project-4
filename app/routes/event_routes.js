
//import express 
const express = require ('express')
// import router
const router = express.Router();
// import model
const Event = require ('../models/event')
//we use already made error handling by the template
const customError = require('../../lib/custom_errors')
//import passport
const passport = require('passport')
// we'll use this function to send 404 when non-existant document is requested
const requireOwnership = customError.requireOwnership;
//jwt
const requireToken = passport.authenticate('bearer',{session:false})
//index 
router.get('/events',(req,res,next)=> {
    Event.find()
    .then(events=> {
        res.status(200).json({events:events})
    })
    .catch(next)
})

//index for my own events
router.get('/myevents',requireToken,(req,res,next)=> {
    const userId = req.user._id
    Event.find({'owner':userId})
    .then(events=> {
        res.status(200).json({events:events})
    })
    .catch(next)
})

//create
router.post('/events',requireToken,(req,res,next)=> {
    const userId = req.user._id
    const newEvent = req.body.event
    // console.log(newEvent)
    newEvent.owner = userId
    Event.create(newEvent)
    .then(event => {
        res.status(201).json({event:event})
    })
    .catch(next)
})
//show
router.get('/events/:id',(req,res,next)=> {
    const eventId = req.params.id
    Event.findById(eventId)
    .then(event=> {
        res.status(200).json({event:event})
    })
    .catch(next)
})

//create a new registers to event 
router.post('/events/:id/registers',requireToken,(req,res,next)=> {
    const eventId = req.params.id
    const userId = req.user._id
    Event.update({
        _id:eventId
    },{
        $push: {registers:userId}
    })
    .then(() => res.sendStatus(204))
    // Event.findById(eventId)
    // .then(event=> {
    //     event.registers = userId
    //     return event.save()
    // })
    // .then((event)=> {

    //     res.status(200).json({event:event})
    // })
    .catch(next)
})

//update
router.patch('/events/:id',requireToken,(req,res,next)=> {
    const eventId = req.params.id
    const updatedEvent = req.body.event
    Event.findByIdAndUpdate(eventId,updatedEvent)
    .then((event)=> {
        // requireOwnership(req,event)
        res.sendStatus(204)
    })
    .catch(next)
})
//delete
router.delete('/events/:id',requireToken,(req,res,next)=> {
    const eventId = req.params.id
    Event.findById(eventId)
    .then((event)=> {
        // requireOwnership(req,event)
        return event.remove()
    })
    .then(()=> res.sendStatus(204))
    .catch(next)
})
module.exports = router