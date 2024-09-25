import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ILead } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseLeadSchema = new Schema<ILead, Model<ILead, any, any>, any>(
	{ 
		contactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
		expert: { type: Schema.Types.ObjectId, ref: 'Expert' },
		assignedAt: { type: Date },
 		edits: [{ time: { type: Date }, editor: { type: Schema.Types.ObjectId, ref: 'User' } }], 
		dialog: [{ text: { type: String }, time: { type: Date }, editedTime: { type: Date }, expert: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
		call: [{ status: { type: String }, time: { type: Date }, expert: { type: Schema.Types.ObjectId, ref: 'Expert' } }],
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
