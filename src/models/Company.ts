import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ICompany } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseCompanySchema = new Schema<ICompany, Model<ICompany, any, any>, any>(
	{
		name: { type: String, text: true, trim: true, required: [true, 'نام الزامی است'], maxLength: [150, 'نام شرکت باید حداکثر 150 کاراکتر باشد'], },
		phone_number_1: { type: String, trim: true, index: { unique: true, sparse: true }, required: [true, 'شماره همراه الزامی است'], },
		phone_number_2: { type: String, trim: true },
		status: { type: String, trim: true, default: 'جدید' },
		website: { type: String },
		source: { type: String },
		users: [{ type: Schema.Types.ObjectId, ref: 'Contatct' }],
		description: { type: String },
		categoryId: { type: Schema.Types.ObjectId, ref: 'CustomerCategory' },
		creator: { type: Schema.Types.ObjectId, ref: 'Expert' },
		address: { type: String },
		converted: { type: Boolean, required: true, default: false },
		email: { type: String, trim: true, },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseCompanySchema.method({
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
baseCompanySchema.static('fillRandom', function () {
	return `company-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseCompanySchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Company = models.Company || model<ICompany>('Company', baseCompanySchema)
export default Company
