import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IExpert } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseExpertSchema = new Schema<IExpert, Model<IExpert, any, any>, any>(
	{
		user_name: { type: String, text: true, trim: true, index: { unique: true, sparse: true }, required: [true, 'نام الزامی است'], maxLength: [150, 'نام کارمند باید حداکثر 150 کاراکتر باشد'], },
		employe_id: { type: Schema.Types.ObjectId, ref: 'Employe' },
		status: { type: String, trim: true, default: 'غیرفعال' },
		password: { type: String, trim: true },
		title: { type: String, trim: true },
		roles: { type: String, trim: true },
		teams: { type: Schema.Types.ObjectId, ref: 'Teams' },
 		description: { type: String, trim: true },
 		leads: [{ type: Schema.Types.ObjectId, ref: 'Leads' }],
		customers: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
		lastActivity: { activity: { type: String }, time: { type: Date } },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseExpertSchema.method({
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
baseExpertSchema.static('fillRandom', function () {
	return `expert-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseExpertSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Expert = models.Expert || model<IExpert>('Expert', baseExpertSchema)
export default Expert
