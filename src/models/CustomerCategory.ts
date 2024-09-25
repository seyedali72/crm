import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ICustomerCat } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseCustomerCatSchema = new Schema<ICustomerCat, Model<ICustomerCat, any, any>, any>(
	{
		name: {
			type: String, 
			required: [true, 'نام الزامی است'],
			maxLength: [150, 'نام کارمند باید حداکثر 150 کاراکتر باشد'],
		},
		parent: { type: Schema.Types.ObjectId, ref: 'CustomerCat' },
		users: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
		status: { type: String, trim: true, default: 'فعال' },
		description: { type: String, trim: true },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseCustomerCatSchema.method({
	softDelete: async function () {
		this.name += '-deleted'
		this.$isDeleted(true)
		this.isDeleted = true
		this.deletedAt = new Date()
		return this.save()
	},
	restore: async function () {
		this.name = this.name.replace('-deleted', '')
		this.$isDeleted(false)
		this.isDeleted = false
		this.deletedAt = null
		return this.save()
	},
})

// calling methods
baseCustomerCatSchema.static('fillRandom', function () {
	return `customerCat-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseCustomerCatSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const CustomerCat = models.CustomerCat || model<ICustomerCat>('CustomerCat', baseCustomerCatSchema)
export default CustomerCat
