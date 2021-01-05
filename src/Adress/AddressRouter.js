const express = require('express');
const {v4: uuid} = require('uuid');
const logger = require('../logger');
const store = require('../store');

const AddressRouter = express.Router();
const bodyParser = express.json();

AddressRouter
.route('/address')
.get((req, res) => {
    res.json(store.addresses);
})
.post((req, res) => {
    const {firstName, lastName, address1, address2, city, state, zip} = req.body;

    //validate 
    if(!firstName){
      logger.error(`First Name is required`);
      return res.status(400).send('First Name is required');
    }
  
    if(!lastName){
      logger.error(`Last Name is required`);
      return res.status(400).send('Last Name is required');
   }
  
    if(!address1){
      logger.error(`Address1 is required`);
      return res.status(400).send('Address1 is required');
    } 
  
    if(!city){
      logger.error(`City is required`);
      return res.status(400).send('City is required');
    }
    if(!state){
      logger.error('State is required');
      return res.status(400).send('State is required');
    }
  
    if(state.length !== 2){
      logger.error(`State must be 2 character`)
      return res.status(400).send('State must be 2 character');
    }
  
    if(!zip){
      logger.error('Zip is required');
      return res.status(400).send('Zip is required');
    }
  
    const numericZip = parseInt(zip)
  
    if(Number.isNaN(numericZip) || zip.length !== 5){
      logger.error(`Zip must be 5 digit number`);
      return res.status(400).send('Zip must be 5 digit number');
    }
  
    const id = uuid();
    const newAddress={
      id,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zip
    }
  
    store.addresses.push(newAddress);
  
    logger.info(`address with id ${id} is created`);
    res.status(201).location(`http://localhost:8000/address/${id}`)
    .json({newAddress});
})

AddressRouter
.route('/address/:id')
.get((req, res) => {
    const {id} = req.params;
    const address = store.addresses.find(ad => ad.id == id);
  
    if(!address){
      logger.error(`address with id ${id} not found`);
      return res.status(404).send(`404 not found`);
    }
    res.json(address);
})
.delete((req, res) => {
    const {id} = req.params;
    const addressIndex = store.addresses.findIndex(ad => ad.id == id);
  
    if(addressIndex === -1) {
      logger.error(`Address with id ${id} not found`);
      return res.status(404).send(`404 Not Found`);
    }
  
    store.addresses.splice(addressIndex, 1);
  
    logger.info(`address with id ${id} deleted`);
    res.status(204).end();
})

module.exports = AddressRouter;