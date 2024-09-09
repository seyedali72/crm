import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ILead } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseLeadSchema = new Schema<ILead, Model<ILead, any, any>, any>(
	{
		name: {
			type: String,
			text: true,
			trim: true,
			required: [true, 'نام الزامی است'],
			maxLength: [150, 'نام کاربر باید حداکثر 150 کاراکتر باشد'],
		},
		mobile_number: {
			type: String,
			index: { unique: true, sparse: true },
			required: [true, 'شماره همراه الزامی است'],
		},
		status: { type: String, trim: true, default: 'جدید' },
		province: { type: String, trim: true },
		city: { type: String, trim: true },
		address: {
			type: String,
			trim: true,
			maxLength: [300, 'آدرس باید حداکثر 300 کاراکتر باشد'],
		},
		email: {
			type: String,
			trim: true,
			maxLength: [100, 'ایمیل کاربر باید حداکثر 100 کاراکتر باشد'],
		},
		dialog: [{ text: { type: String }, time: { type: Date }, editedTime: { type: Date } }],
 		call: [{status:{ type: String }, time: { type: Date }}],
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseLeadSchema.method({
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
baseLeadSchema.static('fillRandom', function () {
	return `lead-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseLeadSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Lead = models.Lead || model<ILead>('Lead', baseLeadSchema)
export default Lead
