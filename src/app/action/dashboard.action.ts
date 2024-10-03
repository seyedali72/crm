'use server'

import Expert from '@/models/Expert'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Lead from '@/models/Lead'
import Employe from '@/models/Employe'
import CustomerCat from '@/models/CustomerCategory'
import Contact from '@/models/Contact'
import Company from '@/models/Company'
import Customer from '@/models/Customer'

/* ----- dashboard ----- */
export const getAdminDashboard = async () => {
    await connect()
    const time = Date.now()
    try {
        const allLeads = await Lead.find().select('createdAt').lean()
        const allCustomers = await Customer.find().select('createdAt').lean()

        let leadLength = allLeads.length
        let lastWeekLead = allLeads.filter((lead: any) => (time - lead.createdAt) < 604800000)
        let lastWeekLeadLength = lastWeekLead.length

        let customerLength = allCustomers.length
        let lastWeekCustomer = allCustomers.filter((customer: any) => time - customer.createdAt < 604800000)
        let lastWeekCustomerLength = lastWeekCustomer.length

        let data = { customerLength, lastWeekCustomerLength, leadLength, lastWeekLeadLength }
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getExpertDashboard = async (id: string) => {
    await connect()

    try {
        const singleLead = await Lead.findById(id).populate([{ path: 'contactId', model: Contact, populate: ([{ path: 'categoryId', select: 'name', model: CustomerCat }, { path: 'companyId', select: 'name', model: Company }]) }, { path: 'expert', select: 'employe_id', model: Expert, populate: ({ path: 'employe_id', select: 'name', model: Employe }) }])
        return JSON.parse(JSON.stringify(singleLead))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

