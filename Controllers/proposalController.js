const Proposal = require('../Models/proposals')
const Job = require('../Models/Jobs');

/**********************************************************CREATING********************************************************/
const createProposal = async (req, res) => {
  try {
    // req.user is set by authenticate middleware
    const freelancerId = req.user.id;

    const { jobId, message, bidAmount, deliveryTime } = req.body;

    // Validate input
    if (!jobId || !message || !bidAmount || !deliveryTime) {
      return res.status(400).json({ message: 'All fields are required: jobId, message, bidAmount, deliveryTime.' });
    }

    // Check job existence and status
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (job.status !== 'open') return res.status(400).json({ message: 'Cannot submit proposal to a closed or in-progress job.' });

    // Prevent duplicate proposals
    const existingProposal = await Proposal.findOne({ job_id: jobId, freelancer_id: freelancerId });
    if (existingProposal) {
      return res.status(400).json({ message: 'You have already submitted a proposal for this job.' });
    }

    // Create proposal
    const proposal = await Proposal.create({
      job_id: jobId,
      freelancer_id: freelancerId,
      message,
      bidAmount,
      deliveryTime,
    });

    res.status(201).json({
      message: 'Proposal submitted successfully.',
      proposal: {
        id: proposal._id,
        job_id: proposal.job_id,
        freelancer_id: proposal.freelancer_id,
        bidAmount: proposal.bidAmount,
        deliveryTime: proposal.deliveryTime,
        status: proposal.status,
        createdAt: proposal.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not submit proposal.' });
  }
};
/**********************************************************EDITING********************************************************/
const editProposal = async (req, res) => {
  try {
    const proposalId = req.params.id;
    const { message, bidAmount, deliveryTime } = req.body;

    // Find proposal
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found.' });

    // Check ownership
    if (!proposal.freelancer_id.equals(req.user.id)) {
      return res.status(403).json({ message: 'You can only edit your own proposals.' });
    }

    // Check status
    if (['accepted', 'rejected', 'withdrawn'].includes(proposal.status)) {
      return res.status(400).json({ message: 'Cannot edit a proposal that has been processed.' });
    }

    // Update fields if provided
    if (message) proposal.message = message;
    if (bidAmount !== undefined) {
      if (bidAmount < 0) return res.status(400).json({ message: 'Bid amount cannot be negative.' });
      proposal.bidAmount = bidAmount;
    }
    if (deliveryTime !== undefined) {
      if (deliveryTime <= 0) return res.status(400).json({ message: 'Delivery time must be greater than 0.' });
      proposal.deliveryTime = deliveryTime;
    }

    await proposal.save();

    res.status(200).json({ message: 'Proposal updated successfully.', proposal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not update proposal.' });
  }
};
/**********************************************************Delete********************************************************/
// const deleteProposal = async (req, res) => {
//   try {
//     // make sure the user is logged by checking if there is token
//     const freelancerId = req.user?.id;
//     if (!freelancerId) {
//       return res.status(401).json({ message: 'Please login first.' });
//     }

//     const proposalId = req.params.id;

//     // find the proposal in DB
//     const proposal = await Proposal.findById(proposalId);

//     // if it does not exist -> "not found user-id" message
//     if (!proposal) {
//       return res.status(404).json({ message: 'Proposal not found.' });
//     }

//     // make sure the user-id in the payload is the same freelancer-id in proposal collection
//     if (!proposal.freelancer_id.equals(freelancerId)) {
//       // if no match -> "whatever" message
//       return res.status(403).json({ message: 'You can only delete your own proposals.' });
//     }

//     // check proposal status before deletion
//     if (proposal.status !== 'submitted') {
//       return res.status(400).json({ message: 'You can only delete proposals that are still submitted.' });
//     }

//     // if it matches delete
//     await Proposal.findByIdAndDelete(proposalId);

//     res.status(200).json({ message: 'Proposal deleted successfully.' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error. Could not delete proposal.' });
//   }
// };

/**********************************************************SHOW ALL PROPOSALS********************************************************/
const getMyProposals = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    // Fetch all proposals by this freelancer
    const proposals = await Proposal.find({ freelancer_id: freelancerId })
      .populate('job_id', 'title description budget') // optional: include some job details
      .sort({ createdAt: -1 }); // most recent first

    res.status(200).json({ proposals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not fetch proposals.' });
  }
};
/**********************************************************CHANGE A PROPOSAL STATUS THROUGH HIRE********************************************************/
const hireProposal = async (req, res) => {
  try {
    const proposalId = req.params.id;
    const clientId = req.user.id;

    // Find the proposal
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found.' });
    }

    // Find the job
    const job = await Job.findById(proposal.job_id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Check if logged-in user owns the job
    if (job.client.toString() !== clientId) {
      return res.status(403).json({ message: 'You can only hire for your own jobs.' });
    }

    // Check proposal status
    if (proposal.status !== 'submitted') {
      console.log(proposal.status)
      return res.status(400).json({ message: 'This proposal cannot be hired.' });
    }

    // Set the selected proposal as accepted
    proposal.status = 'accepted';
    await proposal.save();

    // Exclude all other submitted proposals for the same job
    await Proposal.updateMany(
      { job_id: job._id, _id: { $ne: proposalId }, status: 'submitted' },
      { $set: { status: 'excluded' } }
    );

    // Optional: update job status
    job.status = 'in_progress';
    await job.save();

    res.status(200).json({ message: 'Freelancer hired successfully.', hiredProposal: proposal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not hire freelancer.' });
  }
};

//get all proposals for admin dashboard
const getAllProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find()
        .populate('freelancer_id','email');
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/**********************************************************Delete a Proposal********************************************************/
//delete a proposal by admin and user (this needs authorizaion for role user too)
const deleteProposal = async (req, res) => {
  try {
    // Ensure the user is logged in
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Please login first.' });
    }

    const proposalId = req.params.id;

    // Find the proposal
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found.' });
    }

    // Admin can delete any proposal
    const isAdmin = userRole === 'admin';
    const isOwner = proposal.freelancer_id.equals(userId);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own proposals.' });
    }

    // Optional: check status only for non-admins
    if (!isAdmin && proposal.status !== 'submitted') {
      return res.status(400).json({ message: 'You can only delete proposals that are still submitted.' });
    }

    // Delete proposal
    await Proposal.findByIdAndDelete(proposalId);

    res.status(200).json({ message: 'Proposal deleted successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not delete proposal.' });
  }
};

module.exports = { createProposal, editProposal,getMyProposals, hireProposal, deleteProposal,getAllProposals };
