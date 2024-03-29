'use strict';

require('../models/jobs.models')
var mongoose = require('mongoose');
var Job = mongoose.model('Jobs');

exports.createJob = function(req, res) {
  Job.create({
              author: req.decoded._id,
              title: req.body.title,
              description: req.body.description,
              tools: req.body.tools,
              skill: req.body.skill
            },
            function(err, job) {
              if(err){
                return res.json(err);
              }
              return res.json(job);
            });
};
exports.viewJobs = function(req, res) {
  Job.find()
  .populate('author')
  .exec(function(err, jobs) {
    if(err){
      return res.json(err);
    }
    res.json(jobs);
  });
};
exports.viewOneJob = function(req, res, next) {
  Job.findOne({
    'slug': req.params.slug
  })
  .populate('author')
  .exec(function(err, job) {
    if(err){
      return res.json(err);
    }
    return res.json(job);
  });
};

exports.applyForJob = function(req, res, next) {
  Job.findOne({
    'slug': req.params.slug
  },
  function(err, job) {
    if(err){
      return res.json(err);
    }
    job.applyFor(req.decoded._id,
      function(err, job){
        if (err) {
          return next(err);
        }
        return res.status(200).json(job);
      })
    });
};

exports.viewUserJob = function(req, res, next) {
  Job.find({
    'author' : req.decoded._id
  })
  .populate('applicants')
  .exec(function(err, job) {
    if(err){
      return res.json(err);
    }
    return res.json(job);

  });
};
exports.updateJob = function(req, res) {
  Job.update({
    'slug': req.params.slug
  },  req.body, function(err, job) {
    if(err){
      return res.json(err);
    }
    res.json(job);
  });
};
exports.deleteJobs = function(req, res) {
  Job.remove(function(err, jobs) {
    if(err){
      return res.json(err);
    }
    res.json(jobs);
  });
};
exports.deleteOneJob = function(req, res) {
  Job.remove({
    'slug': req.params.slug
  }, function(err, job) {
    if(err){
      return res.json(err);
    }
    res.json(job);
  });
};
