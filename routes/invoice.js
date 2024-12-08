const { Router } = require("express");
const invoiceController = require('../controllers/invoicesController');  // Adjust the path as necessary
const requireAuth = require("../middlewares/requireAuth");

const router = Router();


// middleware for protexting apis
router.use(requireAuth);

// Add routes for invoices
router.post('/invoices', invoiceController.createInvoice); // Create an invoice
router.get('/invoices', invoiceController.getAllInvoices); // Get all invoices
router.get('/invoices/:id', invoiceController.getInvoiceById); // Get an invoice by ID
router.put('/invoices/:id', invoiceController.editInvoice); // Edit an invoice by ID
router.delete('/invoices/:id', invoiceController.deleteInvoice); // Delete an invoice by ID

module.exports = router;
