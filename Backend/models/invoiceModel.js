import mongoose from 'mongoose'

const invoiceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'User',
    },
    creator: { type: String, required: true },
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    contactNo: { type: Number, required: true },
    email: { type: String, required: true },
    invoiceNo: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    currency: { type: String, required: true },
    region: { type: String},
    status : {type : String,
              required : true},
    pointsToRemember :  { type: String},

      totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
      },
      products : [
          {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
           
          },
      ],



  },
  {
    timestamps: true,
  }
)

const Invoice = mongoose.model('Invoice', invoiceSchema)

export default Invoice