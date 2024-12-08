const mongoose = require("mongoose");

// Define the item schema for the invoice
const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    totalAfterTax: { type: Number, required: true },
  },
  { _id: false }
); // Disable creation of separate _id for items

// Define the invoice schema
const invoiceSchema = new mongoose.Schema(
  {
    company: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    client: {
      companyName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    currency: { type: String, required: true, default: 'USD' },
    invoiceNumber: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    items: [itemSchema], // Array of items
    notes: { type: String },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    customFields: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Calculate subtotal and total before saving the invoice
invoiceSchema.pre("save", function (next) {
  // Calculate subtotal from all items
  const subtotal = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  this.subtotal = subtotal;

  // Calculate total after tax (Subtotal + tax amount from all items)
  const total = this.items.reduce((acc, item) => acc + item.totalAfterTax, 0);
  this.total = total;

  next();
});

// Create the invoice model
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
