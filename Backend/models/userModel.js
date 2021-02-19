import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Invoice from '../models/invoiceModel.js'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isSuperAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    invoices:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice', 
        }
    ]
    
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
      await Invoice.deleteMany({
          _id: {
              $in: doc.invoices
          }
      })
  }
})

const User = mongoose.model('User', userSchema)

export default User
