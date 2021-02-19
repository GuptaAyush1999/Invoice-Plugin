import express from 'express'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js'
import { createInvoice ,getInvoices,getAllInvoices,updateInvoice,getInvoiceById,deleteInvoice,invoiceNumberGenerator,editStatus} from '../controllers/invoiceController.js'

router.route('').get(protect,admin,getAllInvoices)
router.route('/invoicenumber').get(protect,invoiceNumberGenerator)
router.route('/myinvoices').get(protect,getInvoices)
router.route('/edit/:id').put(protect,updateInvoice)
router.route('/delete/:id').delete(protect,deleteInvoice)
router.route('/editStatus/:id').put(protect,editStatus)
router.route('/getinvoice/:id').get(protect,getInvoiceById)
router.route('/:id').post(protect,createInvoice)


export default router;