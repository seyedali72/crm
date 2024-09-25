import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IContact } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseContactSchema = new Schema<IContact, Model<IContact, any, any>, any>(
	{
		name: { type: String, text: true, trim: true, required: [true, 'نام مخاطب الزامی است'], maxLength: [150, 'نام مخاطب باید حداکثر 150 کاراکتر باشد'], },
		phone_number_1: { type: String, trim: true, index: { unique: true, sparse: true }, required: [true, 'شماره همراه مخاطب الزامی است'], },
		phone_number_2: { type: String, trim: true },
		status: { type: String, trim: true, default: 'جدید' },
		title: { type: String },
		source: { type: String },
		description: { type: String },
		categoryId: { type: Schema.Types.ObjectId, ref: 'CustomerCategory' },
		companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
		creator: { type: Schema.Types.ObjectId, ref: 'Client' },
		address: { type: String },
		email: { type: String, trim: true, },
		birthdayDate: { type: Date },
		converted: { type: Boolean, required: true, default: false },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseContactSchema.method({
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
baseContactSchema.static('fillRandom', function () {
	return `contact-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseContactSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Contact = models.Contact || model<IContact>('Contact', baseContactSchema)
export default Contact
