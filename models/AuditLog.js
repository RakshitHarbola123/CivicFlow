const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        complaintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint',
            required: [true, 'Audit log must be linked to a complaint'],
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Action must be performed by a registered user'],
        },
        action: {
            type: String,
            required: [true, 'Action type is required'],
            enum: ['COMPLAINT_CREATED', 'WORKER_ASSIGNED', 'STATUS_CHANGE', 'PRIORITY_UPGRADED', 'COMMENT_ADDED'],
        },
        changes: {
            from: mongoose.Schema.Types.Mixed, 
            to: mongoose.Schema.Types.Mixed,
        },
        notes: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false } 
    }
);

auditLogSchema.index({ complaintId: 1 });
auditLogSchema.index({ createdAt: -1 }); 
module.exports = mongoose.model('AuditLog', auditLogSchema);