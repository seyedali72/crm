import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IEmploye } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseEmployeSchema = new Schema<IEmploye, Model<IEmploye, any, any>, any>(
	{
		name: {
			type: String,
			text: true,
			trim: true,
			required: [true, 'نام الزامی است'],
			maxLength: [150, 'نام کارمند باید حداکثر 150 کاراکتر باشد'],
		},
		mobile_number: {
			type: String,
			index: { unique: true, sparse: true },
			required: [true, 'شماره همراه الزامی است'],
		},
		gender: { type: String, trim: true },
 		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseEmployeSchema.method({
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
baseEmployeSchema.static('fillRandom', function () {
	return `employe-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseEmployeSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Employe = models.Employe || model<IEmploye>('Employe', baseEmployeSchema)
export default Employe
