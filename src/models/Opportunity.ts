import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IOpportunity } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseOpportunitySchema = new Schema<IOpportunity, Model<IOpportunity, any, any>, any>(
	{
		title: { type: String },
		description: { type: String },
		stage: { type: String },
		amount: { type: Number },
		probability: { type: Number },
		leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
		expert: { type: Schema.Types.ObjectId, ref: 'Expert' },
		assignedAt: { type: Date },
		edits: [{ time: { type: Date }, editor: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
		dialog: [{ text: { type: String }, time: { type: Date }, editedTime: { type: Date }, expert: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
		call: [{ status: { type: String }, time: { type: Date }, expert: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
		failed: { type: Boolean, required: true, default: false },
		completed: { type: Boolean, required: true, default: false },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseOpportunitySchema.method({
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
baseOpportunitySchema.static('fillRandom', function () {
	return `opportunity-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseOpportunitySchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Opportunity = models.Opportunity || model<IOpportunity>('Opportunity', baseOpportunitySchema)
export default Opportunity

