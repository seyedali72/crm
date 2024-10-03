import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IReminder } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseReminderSchema = new Schema<IReminder, Model<IReminder, any, any>, any>(
	{
		name: { type: String, trim: true },
		type: { type: String, trim: true },
		excerpt: [{ text: { type: String } }],	
		description: { type: String, trim: true },
		schedule:  { type: Date },
		status: { type: String, trim: true, default: 'جدید' },
		expertId: { type: Schema.Types.ObjectId, ref: 'Expert' },
		leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
		customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
 		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseReminderSchema.method({
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
baseReminderSchema.static('fillRandom', function () {
	return `reminder-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseReminderSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Reminder = models.Reminder || model<IReminder>('Reminder', baseReminderSchema)
export default Reminder
