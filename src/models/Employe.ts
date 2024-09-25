import { queriesForSoftDelete } from '@/app/utils/helpers'
import { IEmploye } from '@/app/utils/types'
import crypto from 'crypto'
import { Schema, model, Model, models } from 'mongoose'

const baseEmployeSchema = new Schema<IEmploye, Model<IEmploye, any, any>, any>(
	{
		name: { type: String, text: true, trim: true, required: [true, 'نام الزامی است'], maxLength: [150, 'نام کارمند باید حداکثر 150 کاراکتر باشد'], },
		national_code: { type: Number, index: { unique: true, sparse: true }, required: [true, 'شماره ملی الزامی است'], },
		mobile_number: { type: Number, index: { unique: true, sparse: true }, required: [true, 'شماره همراه الزامی است'], },
		status: { type: String, trim: true, default: 'غیرفعال' },
		phone_number: { type: Number, },
		department_id: { type: Schema.Types.ObjectId, ref: 'Department' },
		skill: { type: String, trim: true },
		emergencyContacts: [{ type: Object }],
		empolyeCode: { type: String, trim: true },
		joinDate: { type: Date },
		birthdayDate: { type: Date },
		address: { type: String },
		email: { type: String },
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
