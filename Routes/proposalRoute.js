const express = require('express');
const router = express.Router();
const { createProposal,editProposal, getMyProposals, hireProposal, deleteProposal } = require('../Controllers/proposalController');
const authenticate = require('../middleware/authenticationMiddle'); // your auth middleware

// POST /api/proposals - create a new proposal
router.post('/', authenticate, createProposal);

// PATCH /api/proposals/id - edit a proposal
router.patch('/:id', authenticate, editProposal);

// GET /api/proposals/mine - get logged-in freelancer's proposals
router.get('/mine', authenticate, getMyProposals);

// PATCH /api/proposals/:id/hire - hire a freelancer for a job (client only)
router.patch('/:id/hire', authenticate, hireProposal);

// DELETE /api/proposals/:id - delete a proposal
router.delete('/:id', authenticate, deleteProposal);

module.exports = router;
