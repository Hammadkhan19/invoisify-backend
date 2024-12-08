const Invoice = require("../models/Invoice"); // Adjust the path as necessary
const Counter = require("../models/Counter");
// Controller to create a new invoice
exports.createInvoice = async (req, res) => {
  const user_id = req.user.id;
 
  try {
    // Extract invoice data from the request body
    const {
      currency,
      company,
      client,
      invoiceNumber,
      subject,
      invoiceDate,
      dueDate,
      items,
      notes,
      customFields,
    } = req.body;
    async function getNextInvoiceNumber() {
      const counter = await Counter.findOneAndUpdate(
        { name: "invoiceNumber" },
        { $inc: { sequence: 1 } },
        { new: true, upsert: true }
      );
      const invoiceNumber = `INV-${counter.sequence
        .toString()
        .padStart(6, "0")}`;
      return invoiceNumber;
    }
    // Generate invoice number if not provided
    const generatedNumber = invoiceNumber || (await getNextInvoiceNumber());

    // Check if provided or generated invoiceNumber is unique
    const existingInvoice = await Invoice.findOne({
      invoiceNumber: generatedNumber,
    });
    if (existingInvoice) {
      return res.status(400).json({ message: "Invoice number already exists" });
    }
    // Calculate subtotal and total after tax for each item
    const updatedItems = items.map((item) => {
      const subtotal = item.quantity * item.rate;
      const taxAmount = Number(item.taxAmount);
      const totalAfterTax = subtotal + taxAmount;
      return { ...item, subtotal, totalAfterTax };
    });

    // Calculate the total subtotal and total amount for the invoice
    const subtotal = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);
    const total = updatedItems.reduce(
      (acc, item) => acc + item.totalAfterTax,
      0
    );

    // Create the new invoice document
    const invoice = new Invoice({
      user_id,
      company,
      client,
      currency,
      invoiceNumber,
      invoiceDate,
      dueDate,
      subject,
      items: updatedItems,
      subtotal,
      total,
      notes,
      customFields,
    });

    // Save to the database
    await invoice.save();
    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create invoice add all fields,", error });
  }
};

// Controller to get all invoices
exports.getAllInvoices = async (req, res) => {
  const user_id = req.user.id;
  try {
    const invoices = await Invoice.find({ user_id }).sort({ invoiceDate: -1 }); // Sort by invoiceDate, latest first
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve invoices", error });
  }
};

// Controller to get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve invoice", error });
  }
};

// Controller to edit an invoice by ID
exports.editInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      client,
      invoiceNumber,
      invoiceDate,
      dueDate,
      items,
      notes,

      customFields,
    } = req.body;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        company,
        client,
        invoiceNumber,
        invoiceDate,
        dueDate,
        items,
        notes,

        customFields,
      },
      { new: true } // Return the updated document
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update invoice", error });
  }
};

// Controller to delete an invoice by ID
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete invoice", error });
  }
};
