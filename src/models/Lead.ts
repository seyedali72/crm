import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ILead } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseLeadSchema = new Schema<ILead, Model<ILead, any, any>, any>(
	{
		name: { type: String, text: true, trim: true, required: [true, 'نام مخاطب الزامی است'], maxLength: [150, 'نام مخاطب باید حداکثر 150 کاراکتر باشد'], },
		phone_number_1: { type: String, trim: true, index: { unique: true, sparse: true }, required: [true, 'شماره همراه مخاطب الزامی است'], },
		phone_number_2: { type: String, trim: true },
		status: { type: String, trim: true, default: 'جدید' },
		title: { type: String },
		source: { type: String },
		description: { type: String },
		address: { type: String },
		email: { type: String, trim: true, },
		birthdayDate: { type: Date },
		assignedAt: { type: Date },
		categoryId: { type: Schema.Types.ObjectId, ref: 'CustomerCategory' },
		contactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
		companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
		creator: { type: Schema.Types.ObjectId, ref: 'Expert' },
		opportunity: [{ type: Schema.Types.ObjectId, ref: 'Expert' }],
		expert: { type: Schema.Types.ObjectId, ref: 'Expert' },
		edits: [{ time: { type: Date }, editor: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
		dialog: [{ text: { type: String }, time: { type: Date }, editedTime: { type: Date }, expert: { type: Schema.Types.ObjectId, ref: 'Expert' }, opportunity: { type: Boolean } }],
		call: [{ status: { type: String }, time: { type: Date }, expert: { type: Schema.Types.ObjectId, ref: 'Expert' }, opportunity: { type: Boolean } }],
		isCompany: { type: Boolean, required: true, default: false },
		converted: { type: Boolean, required: true, default: false },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseLeadSchema.method({
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
