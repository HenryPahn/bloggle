// src/routes/api/get.js

const express = require('express');
const { db } = require('../../firebase');

const { createSuccessResponse } = require('../response')

module.exports = async (req, res) => {
  try {
    const snapshot = await db.collection('tests').get();
    const data = snapshot.docs.map(doc => doc.data());

    // create a success response
    const successResponse = createSuccessResponse({
      ...data
    })

    
    res.status(200).json(successResponse);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
}
