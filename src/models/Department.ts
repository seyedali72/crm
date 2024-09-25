import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IDepartment } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseDepartmentSchema = new Schema<IDepartment, Model<IDepartment, any, any>, any>(
	{
		name: {
			type: String, 
 			required: [true, 'نام الزامی است'],
			maxLength: [150, 'نام کارمند باید حداکثر 150 کاراکتر باشد'],
		},
		parent: { type: Schema.Types.ObjectId, ref: 'Department' },
		users: [{ type: Schema.Types.ObjectId, ref: 'Employe' }],
		status: { type: String, trim: true, default: 'فعال' },
		description: { type: String, trim: true },
		isDeleted: { type: Boolean, required: true, default: false },
		deletedAt: { type: Date },
	},
	{
		timestamps: true,
	},
)

baseDepartmentSchema.method({
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
baseDepartmentSchema.static('fillRandom', function () {
	return `department-${crypto.randomUUID().slice(0, 10)}`
})

// calling hooks
queriesForSoftDelete.forEach((type: any) => {
	baseDepartmentSchema.pre(type, async function (next: any) {
		// @ts-ignore
		this.where({ isDeleted: false })
		next()
	})
})

const Department = models.Department || model<IDepartment>('Department', baseDepartmentSchema)
export default Department
