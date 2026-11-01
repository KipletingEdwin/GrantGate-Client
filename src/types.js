
/**
 * GrantGate data shapes. Mock data and the Rails API must both match these.
 */

/**
 * @typedef {'employee' | 'contractor' | 'manager' | 'reviewer' | 'admin'} Role
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {Role} role
 * @property {string} team
 * @property {'full_time' | 'contractor'} employment    Comes from the database, never from request text.
 * @property {string} managerId
 */

/**
 * @typedef {'read' | 'write' | 'admin'} AccessLevel
 */

/**
 * @typedef {Object} Resource
 * @property {string} name                               e.g. "analytics-db"
 * @property {'database' | 'repository' | 'cloud' | 'saas'} type
 * @property {'low' | 'medium' | 'high'} sensitivity
 */

/**
 * @typedef {'submitted' | 'investigating' | 'proposed' | 'approved' | 'rejected' | 'granted' | 'blocked'} RequestStatus
 */

/**
 * One read-only tool call the agent made. This is the "what the agent saw" record.
 * @typedef {Object} EvidenceItem
 * @property {string} id
 * @property {string} tool                               e.g. "lookup_user_role"
 * @property {Object} input                              Arguments the agent passed.
 * @property {string} summary                            One readable line for the UI.
 * @property {Object} output                             Raw result from the tool.
 */

/**
 * Result of one policy rule run against the proposal.
 * @typedef {Object} PolicyCheck
 * @property {string} rule                               e.g. "no-admin-for-contractors"
 * @property {'pass' | 'fail' | 'warn'} result
 * @property {string} reason                             Plain-language explanation.
 */

/**
 * What the agent suggests. Only a proposal: a human decides.
 * @typedef {Object} Proposal
 * @property {'grant' | 'narrow' | 'deny'} decision
 * @property {AccessLevel | null} accessLevel            null when decision is "deny".
 * @property {string | null} expiresAt                   ISO date, null if no expiry.
 * @property {string} rationale                          The agent's reasoning.
 * @property {number} confidence                         0 to 1.
 * @property {boolean} overriddenByPolicy                True if policy changed the agent's output.
 */

/**
 * The human decision.
 * @typedef {Object} Review
 * @property {string} reviewerId
 * @property {'approved' | 'rejected'} decision
 * @property {AccessLevel | null} accessLevel            May differ from the proposal if edited.
 * @property {string} note
 * @property {string} decidedAt
 */

/**
 * Append-only audit record.
 * @typedef {Object} AuditEvent
 * @property {string} id
 * @property {string} requestId
 * @property {string} type                               e.g. "request.submitted", "policy.evaluated"
 * @property {string} actor                              User name, or "agent" / "policy" / "system".
 * @property {string} message
 * @property {string} createdAt                          ISO timestamp.
 */

/**
 * @typedef {Object} Request
 * @property {string} id
 * @property {RequestStatus} status
 * @property {string} createdAt
 * @property {User} requester
 * @property {Resource} resource
 * @property {AccessLevel} requestedAccess
 * @property {string} justification                      Untrusted free text from the employee.
 * @property {'low' | 'medium' | 'high' | 'critical'} risk
 * @property {EvidenceItem[]} evidence
 * @property {PolicyCheck[]} policyChecks
 * @property {Proposal | null} proposal
 * @property {Review | null} review
 * @property {AuditEvent[]} events
 */

export {}