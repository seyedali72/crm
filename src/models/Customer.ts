import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ICustomer } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseCustomerSchema = new Schema<ICustomer, Model<ICustomer, any, any>, any>(
	{
		name: {
			type: String,
			text: true,
			trim: true,
			required: [true, 'نام الزامی است'],
			maxLength: [150, 'نام کارمند باید حداکثر 150 کاراکتر باشد'],
		},
		mobile_number: { type: String, index: { unique: true, sparse: true }, required: [true, 'شماره همراه الزامی است'], },
		status: { type: String, trim: true, default: 'جدید' },
		website: { type: String, trim: true },
		title: { type: String, trim: true },
		source: { type: String, trim: true },
		description: { type: String, trim: true },
		expert: { type: Schema.Types.ObjectId, ref: 'Expert' },
		address: { type: String, trim: true, },
		email: { type: String, trim: true, },
		dialog: [{ text: { type: String }, time: { type: Date }, editedTime: { type: Date } }],
		call: [{ status: { type: String }, time: { type: Date } }],
		convert: { convertor:{ type: Schema.Types.ObjectId, ref: 'Expert' }, time: { type: Date } },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseCustomerSchema.method({
	softDelete: async function () {
		this.mobile_number += '-deleted'
		this.$isDeleted(true)
		this.isDeleted = true
		this.deletedAt = new Date()
		return this.save()
	},
	restore: async function () {
		this.mobile_number = this.mobile_number.replace('-deleted', '')
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
