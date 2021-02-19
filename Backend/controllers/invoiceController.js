import asyncHandler from 'express-async-handler'
import Invoice from '../models/invoiceModel.js'
import User from '../models/userModel.js';

var count=1;

const createInvoice = asyncHandler(async (req, res) => {

    const { creator,
            customerName,
            address,
            contactNo,
            email,
            invoiceNo,
            invoiceDate,
            currency,
            region,
            totalPrice,
            products,
            } = req.body;

    const user = await User.findById(req.params.id);
    console.log(user);
   
    const status = 'UnPaid'
  
    const invoice = await Invoice.create({
        user,
        creator,
        customerName,
        address,
        contactNo,
        email,
        invoiceNo,
        invoiceDate,
        currency,
        region,
        totalPrice,
        products,
        status
    })

   await user.invoices.push(invoice._id);
    console.log(user);
    await user.save();
  
    if (invoice) {
      res.status(201).json({
        user : invoice.user,
        _id: invoice._id,
        customerName: invoice.customerName,
        address : invoice.address,
        contactNo : invoice.contactNo,
        email : invoice.email,
        invoiceNo : invoice.invoiceNo,
        invoiceDate : invoice.invoiceDate,
        currency : invoice.currency,
        region : invoice.region,
        totalPrice : invoice.totalPrice,
        products : invoice.products,
        count : count,
        status : status
       
      })
      count ++;
    } else {
      res.status(400)
      throw new Error('Invalid Invoice data')
    }
})

//Invoice Number Generator
const invoiceNumberGenerator = asyncHandler(async (req,res) => {
  res.json(count)
})




// @desc    Get all invoices
// @route   GET /api/invoices/
// @access  Private/Admin
const getAllInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({}).populate('user','name');
  
  res.json(invoices)
})

// @desc    Get all invoices of a perticular user
// @route   GET /api/invoices
// @access  Public
const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({user : req.user._id}).populate('user','name');
  
  res.json(invoices)
})


// @desc    Get user by ID
// @route   GET /api/invoices/getinvoice/:id
// @access  Public
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)

  if (invoice) {
    res.json(invoice)
  } else {
    res.status(404)
    throw new Error('Invoice not found')
  }
})

// @desc    Update invoice
// @route   PUT /api/invoices/edit/:id
// @access  Public
const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
  console.log(invoice)

  if (invoice) {

    invoice.creator=req.body.creator || invoice.creator,
    invoice.customerName=req.body.customerName || invoice.customerName,
    invoice.address =req.body.address || invoice.address,
    invoice.contactNo =req.body.contactNo || invoice.contactNo,
    invoice.email =req.body.email || invoice.email,
    invoice.invoiceDate =req.body.invoiceDate || invoice.invoiceDate,
    invoice.currency =req.body.currency || invoice.currency,
    
    invoice.region= req.body.region || invoice.region
    invoice.totalPrice =req.body.totalPrice || invoice.totalPrice,
    invoice.products =req.body.products || invoice.products
    if(req.body.region === null){
      invoice.region = null
    }

    const updatedInvoice = await invoice.save()

    res.json({
      _id: updatedInvoice._id,
        customerName: updatedInvoice.customerName,
        address : updatedInvoice.address,
        contactNo : updatedInvoice.contactNo,
        email : updatedInvoice.email,
        invoiceDate : updatedInvoice.invoiceDate,
        currency : updatedInvoice.currency,
        region : updatedInvoice.region,
        totalPrice : updatedInvoice.totalPrice,
        products : updatedInvoice.products
     
    })
  } else {
    res.status(404)
    throw new Error('Invoice not found')
  }
})

// @desc    Delete invoice
// @route   DELETE /api/invoices/delete/:id
// @access  Public
const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)

  if (invoice) {
    await invoice.remove()
    res.json({ message: 'Invoice removed' })
  } else {
    res.status(404)
    throw new Error('Invoice not found')
  }
})

const editStatus = asyncHandler(async (req, res) => {
   const invoice = await Invoice.findById(req.params.id);
   if(invoice){
     console.log(req.body)
     
    invoice.status = req.body.updatedStatus || invoice.status

    const updatedInvoice = await invoice.save()

    res.json({
      _id: updatedInvoice._id,
        customerName: updatedInvoice.customerName,
        address : updatedInvoice.address,
        contactNo : updatedInvoice.contactNo,
        email : updatedInvoice.email,
        invoiceDate : updatedInvoice.invoiceDate,
        currency : updatedInvoice.currency,
        region : updatedInvoice.region,
        totalPrice : updatedInvoice.totalPrice,
        products : updatedInvoice.products,
        status : updatedInvoice.status
     
    })
   } else {
    res.status(404)
    throw new Error('Invoice not found')
  }

  
})

export {createInvoice,
        getAllInvoices,
        getInvoices,
        getInvoiceById,
        updateInvoice,
        deleteInvoice,
        invoiceNumberGenerator,
        editStatus}