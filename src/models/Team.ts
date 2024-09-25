import { queriesForSoftDelete } from '@/app/utils/helpers'
import { ITeams } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseTeamsSchema = new Schema<ITeams, Model<ITeams, any, any>, any>(
	{
		name: {
			type: String,
			text: true, 
			required: [true, 'نام الزامی است'],
			maxLength: [150, 'نام کارمند باید حداکثر 150 کاراکتر باشد'],
		},
		parent: { type: Schema.Types.ObjectId, ref: 'Team' },
		users: [{ type: Schema.Types.ObjectId, ref: 'Expert' }],
		status: { type: String, trim: true, default: 'فعال' },
		description: { type: String, trim: true },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseTeamsSchema.method({
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
baseTeamsSchema.static('fillRandom', function () {
	return `teams-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseTeamsSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Team = models.Team || model<ITeams>('Team', baseTeamsSchema)
export default Team
