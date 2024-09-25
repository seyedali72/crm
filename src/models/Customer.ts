import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ICustomer } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseCustomerSchema = new Schema<ICustomer, Model<ICustomer, any, any>, any>(
	{
		contactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
		expert: { type: Schema.Types.ObjectId, ref: 'Expert' },
		assignedAt: { type: Date },
		edits: [{ time: { type: Date }, editor: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
		dialog: [{ text: { type: String }, time: { type: Date }, editedTime: { type: Date }, expert: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
		call: [{ status: { type: String }, time: { type: Date }, expert: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
		convert: { time: { type: Date }, convertor: { type: Schema.Types.ObjectId, ref: 'Expert' } },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseCustomerSchema.method({
	softDelete: async function () {
		this.phone_number_1 += '-deleted'
		this.$isDeleted(true)
		this.isDeleted = true
		this.deletedAt = new Date()
		return this.save()
	},
	restore: async function () {
		this.phone_number_1 = this.phone_number_1.replace('-deleted', '')
		this.$isDeleted(false)
		this.isDeleted = false
		this.deletedAt = null
		return this.save()
	},
})

// calling methods
baseCustomerSchema.static('fillRandom', function () {
	return `customer-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseCustomerSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Customer = models.Customer || model<ICustomer>('Customer', baseCustomerSchema)
export default Customer

