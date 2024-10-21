import { Types } from 'mongoose'

interface ICustomerCat {
	name: string
	status: string
	description: string
	parent?: Types.ObjectId
	users?: [Types.ObjectId]
	isDeleted?: boolean
	deletedAt?: Date
}
interface IReminder {
	name: string
	type: string
	status: string
	description: string
	excerpt?: string[]
	schedule?: Date
	expertId: Types.ObjectId
	leadId?: Types.ObjectId
	opportunityId?: Types.ObjectId
	customerId?: Types.ObjectId
	isDeleted?: boolean
	deletedAt?: Date
}

interface ITeams {
	name: string
	status: string
	description: string
	parent?: Types.ObjectId
	users?: [Types.ObjectId]
	isDeleted?: boolean
	deletedAt?: Date
}
interface IDepartment {
	name: string
	status: string
	description: string
	parent?: Types.ObjectId
	users?: [Types.ObjectId]
	isDeleted?: boolean
	deletedAt?: Date
}

interface ICategory {
	name: string
	slug: string
	cat_code: string
	thumbnail?: File
	parent?: Types.ObjectId
	description?: string
	isDeleted?: boolean
	deletedAt?: Date
}

interface IClient extends IUser {
	mobile_number: number
}

interface IExpert {
	employe_id: Types.ObjectId
	user_name: string
	password: string
	role: number
	roles?: string
	teams?: string
	title?: string
	status?: string
	description?: string
	dialogs?: string[]
	calls?: string[]
	leads?: [Types.ObjectId]
	customers?: [Types.ObjectId]
	lastActivity: object
	isDeleted?: boolean
	deletedAt?: Date
}

interface IUser {
	name: string
	user_name: string
	password: string
	role?: string
	email?: string
	isDeleted?: boolean
	deletedAt?: Date
}

interface IContact {
	name: string
	phone_number_1: string
	phone_number_2: string
	source?: string
	title?: string
	description?: string
	address?: string
	email?: string
	status?: string
	categoryId?: Types.ObjectId
	companyId?: Types.ObjectId
	creator?: Types.ObjectId
	birthdayDate?: Date
	converted: boolean
	isDeleted?: boolean
	deletedAt?: Date
}
interface IOpportunity {
	leadId: Types.ObjectId
	expert: Types.ObjectId
	assignedAt: Date
	probability: number
	amount: number
	stage: string
	title: string
	description: string
	dialog: string[]
	call: string[]
	edits: string[]
	convert: object
	failed: boolean
	completed: boolean
	isDeleted: boolean
	deletedAt?: Date
}
interface ICustomer {
	contactId?: Types.ObjectId
	expert?: Types.ObjectId
	assignedAt?: Date
	dialog?: string[]
	call?: string[]
	edits?: string[]
	convert?: object
	isDeleted?: boolean
	deletedAt?: Date
}

interface ICompany {
	name: string
	phone_number_1: string
	phone_number_2: string
	website: string
	address: string
	categoryId: Types.ObjectId
	creator: Types.ObjectId
	users: [Types.ObjectId]
	email: string
	status: string
	source: string
	description: string
	converted: boolean
	isDeleted: boolean
	deletedAt?: Date
}

interface ILead {
	name: string
	phone_number_1: string
	phone_number_2: string
	source: string
	title: string
	description: string
	address: string
	email: string
	status: string
	contactId: Types.ObjectId
	categoryId: Types.ObjectId
	companyId: Types.ObjectId
	creator: Types.ObjectId
	birthdayDate: Date
	opportunity: Types.ObjectId[]
	expert: Types.ObjectId
	assignedAt?: Date
	dialog: string[]
	call: string[]
	edits: string[]
	converted: boolean
	isCompany: boolean
	isDeleted: boolean
	deletedAt: Date
}

interface IEmploye {
	name: string
	national_code: string
	mobile_number: string
	phone_number: string
	role: number
	department_id: Types.ObjectId
	gender: string
	email: string
	status: string
	emergencyContacts: string[]
	skill: string
	empolyeCode: string
	address: string
	birthdayDate?: Date
	joinDate?: Date
	isDeleted?: boolean
	deletedAt?: Date
}

interface IFile {
	fileName: string
	fileAddress: string
	fileSize?: string
	altText?: string
	mimeType?: string
	thumbnails?: [
		{
			url: string
			size: string
		},
	]
}

interface IOTP {
	lead_phone: string
	otp: string
	expireAt: Date
}

interface IPage {
	name: string
	slug: string
	content: string
	status: string
	author?: Types.ObjectId | null
	isDeleted?: boolean
	deletedAt?: Date
}

interface IProduct extends IPage {
	image?: Types.ObjectId
	gallery?: Types.ObjectId[]
	tags: Types.ObjectId[]
	categories: Types.ObjectId
	isCommentsOpen: boolean
	product_code: string
	technical_attribute: string
	models: number
	introduction: string
}

interface ITicket {
	code: string
	client: Types.ObjectId
	// client: string
	topic: string
	department: string
	status: string
	messages: any[]
	isDeleted?: boolean
	deletedAt?: Date
}

interface ISetting {
	name: string
	phoneNumber: string
	telegram: string
	instagram: string
	whatsapp: string
	rubika: string
	eita: string
	address: string
	favIcon?: File
	logo?: File
	description?: string
	indexed?: boolean
}
interface IMeta {
	page_id: Types.ObjectId
	mtitle: String
	mdesc: String
	keywords: String
	permalink: String
	canonical: String
	markup: String
	mindex: String
	mfollow: String
}

export type {
	ICategory, ICustomerCat,
	IMeta, ITeams,
	IClient, IUser,
	ILead, ICustomer,IOpportunity,
	IFile, IExpert,
	IOTP, IEmploye,
	IPage, IDepartment,
	IProduct, ICompany,
	ITicket, IContact,
	ISetting, IReminder
}
