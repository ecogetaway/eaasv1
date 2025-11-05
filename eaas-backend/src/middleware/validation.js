import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Auth validation
export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('name').trim().notEmpty().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('address').optional().trim(),
  validate,
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
];

// Subscription validation
export const validateSubscription = [
  body('plan_id').isUUID(),
  body('address').trim().notEmpty(),
  body('monthly_bill').isFloat({ min: 0 }),
  validate,
];

// Energy data validation
export const validateEnergyQuery = [
  query('period').optional().isIn(['day', 'week', 'month', 'year']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validate,
];

// Billing validation
export const validateBillId = [
  param('billId').isUUID(),
  validate,
];

export const validatePayment = [
  body('payment_method').isIn(['upi', 'card', 'net_banking']),
  body('amount').isFloat({ min: 0 }),
  validate,
];

// Support ticket validation
export const validateTicket = [
  body('category').isIn(['technical', 'billing', 'installation', 'general']),
  body('priority').isIn(['low', 'medium', 'high', 'critical']),
  body('subject').trim().notEmpty().isLength({ min: 5, max: 500 }),
  body('description').trim().notEmpty().isLength({ min: 10 }),
  validate,
];

export const validateTicketReply = [
  body('message').trim().notEmpty().isLength({ min: 1 }),
  validate,
];

