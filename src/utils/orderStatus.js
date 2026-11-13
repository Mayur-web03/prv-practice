export const STATUS = {
  draft: "Draft",
  pending_approval: "Pending Admin Approval",
  needs_clarification: "Needs Clarification",
  approved: "Approved / Confirmed",
  processing: "Processing",
  ready_for_dispatch: "Ready for Dispatch",
  dispatched: "Dispatched",
  delivered: "Delivered",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const statusLabel = (s) => STATUS[s] || s;
