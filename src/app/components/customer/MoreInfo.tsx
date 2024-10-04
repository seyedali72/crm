'use client'

import { addContactToCompany, editContactCompany, getCompanies } from "@/app/action/company.action"
import { editContact } from "@/app/action/contact.action"
import { createCustomer, editCustomer } from "@/app/action/customer.action"
import { addCustomerToCustomerCat, editCustomerFromCustomerCat, getCustomerCats } from "@/app/action/customerCat.action"
import { addCustomerToExpert, deleteLeadFromExpert } from "@/app/action/expert.action"
import { deleteLead, editLead } from "@/app/action/lead.action"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function MoreInfoCus({ singleCustomer, mutated }: any) {
    const [companyList, setCompanyList] = useState<any>([])
    const [catList, setCatList] = useState<any>([])
    const [edited, setEdited] = useState(false)
    const [editedCat, setEditedCat] = useState(false)
    const [status, setStatus] = useState('')
    const [companyId, setCompanyId] = useState<any>()
    const [catId, setCatId] = useState<any>()
    const { user } = useUser()
    const router = useRouter()
    const fetchData = useCallback(async () => {
        let company = await getCompanies({ isDeleted: false })
        setCompanyList(company)
        let categories = await getCustomerCats({ isDeleted: false })
        setCatList(categories)
    }, [])
    const changeStatus = async (type: string) => {
        let status = { status: type }
        let res = await editContact(singleCustomer?.contactId?._id, status)
        if (!res.error) {
            await editCustomer(singleCustomer?._id, {}, user?._id)
            toast.success('انجام شده')
            mutated()
        } else {
            toast.error('ridi')
        }
    }

    let a = singleCustomer?.edits?.length > 0 ? Date.parse(singleCustomer?.edits[singleCustomer?.edits?.length - 1]?.time) : 0
    let b = singleCustomer?.call?.length > 0 ? Date.parse(singleCustomer?.call[singleCustomer?.call?.length - 1]?.time) : 0
    let c = singleCustomer?.dialog?.length > 0 ? Date.parse(singleCustomer?.dialog[singleCustomer?.dialog?.length - 1]?.time) : 0
    let lastActivityArr = [a, b, c]
    const lastActivityResult = lastActivityArr.reduce((c: any, d: any) => Math.max(c, d));

    const addToCategory = async (contactId: any) => {
        let res = await addCustomerToCustomerCat(catId, contactId, 'customer')
        if (!res?.error) {
            await editLead(singleCustomer?._id, {}, user?._id)
            mutated()
        }
    }
    const changeCategory = async (contactId: any) => {
        let res = await editCustomerFromCustomerCat(catId, contactId, 'customer', singleCustomer?.contactId?.categoryId?._id)
        if (!res?.error) {
            mutated()
            setEditedCat(false)
        }
    }
    const addToCompany = async (contactId: any) => {
        let res = await addContactToCompany(companyId, contactId)
        if (!res?.error) {
            mutated()
        }
    }
    const changeCompany = async (contactId: any) => {
        let res = await editContactCompany(companyId, contactId, singleCustomer?.contactId?.companyId?._id)
        if (!res?.error) {
            mutated()
            setEdited(false)
        }
    }

    useEffect(() => { fetchData() }, [fetchData])
    return (

        <section className="main-body-container rounded fs90">

            <p>زمان اختصاص به کارشناس <b> {convertToPersianDate(singleCustomer?.assignedAt, 'YYMDHM')}</b></p>
            <p>زمان ساخت مشتری <b>{convertToPersianDate(singleCustomer?.createdAt, "YYMDHM")}</b></p>
            <p>آخرین فعالیت روی مشتری <b>{convertToPersianDate(lastActivityResult, "YYMDHM")}  </b></p>

            <div className="d-flex gap-1 align-items-center mb-3">
                <span className="text-nowrap" >شرکت مربوطه مشتری:</span>
                {singleCustomer?.contactId?.companyId == undefined ?
                    <>
                        <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                            <option value=''>یک شرکت را انتخاب کنید</option>
                            {companyList?.map((company: any) => { return (<option key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                        </select>
                        <button onClick={() => { addToCompany(singleCustomer?.contactId?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
                    </> : edited ?
                        <>
                            <select onChange={(e: any) => setCompanyId(e.target.value)} className="form-control form-control-sm fs80">
                                <option value='' hidden>{singleCustomer?.contactId?.companyId?.name}</option>
                                {companyList?.map((company: any) => { return (<option key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                            </select>
                            <i onClick={() => { changeCompany(singleCustomer?.contactId?._id) }} className="fa fa-check p-1 rounded-1 cursorPointer bg-success text-white"> </i>
                            <i onClick={() => { setEdited(!edited) }} className="fa fa-times p-1 rounded-1 cursorPointer bg-danger text-white"> </i></> : <><Link className="text-nowrap" href={`/expert/companeis/${singleCustomer?.contactId?.companyId?._id}`}>{singleCustomer?.contactId?.companyId?.name}</Link><i onClick={() => setEdited(!edited)} className="fa fa-edit cursorPointer w-100 text-start"></i>
                        </>}
            </div>

            <div className="d-flex gap-1 align-items-center mb-3">
                <span className="text-nowrap" >زمینه فعالیتی مشتری:</span>
                {singleCustomer?.contactId?.categoryId == undefined ?
                    <>
                        <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                            <option value=''>یک زمینه را انتخاب کنید</option>
                            {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                        </select>
                        <button onClick={() => { addToCategory(singleCustomer?.contactId?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
                    </>
                    : editedCat ? <>
                        <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                            <option value='' hidden>{singleCustomer?.contactId?.categoryId?.name}</option>
                            {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                        </select>
                        <i onClick={() => { changeCategory(singleCustomer?.contactId?._id) }} className="fa fa-check p-1 rounded-1 cursorPointer bg-success text-white"> </i>
                        <i onClick={() => { setEditedCat(!editedCat) }} className="fa fa-times p-1 rounded-1 cursorPointer bg-danger text-white"> </i>
                    </>
                        : <> <Link href={`/expert/customers/categoreis/${singleCustomer?.contactId?.categoryId?._id}`}>{singleCustomer?.contactId?.categoryId?.name}</Link><i onClick={() => setEditedCat(!editedCat)} className="fa fa-edit cursorPointer w-100 text-start"></i></>}
            </div>
            <div className="d-flex gap-1 align-items-center mb-2">
                <span >وضعیت:</span>
                <select onChange={(e: any) => setStatus(e.target.value)} className="form-control form-control-sm">
                    <option value={singleCustomer?.contactId?.status} hidden>{singleCustomer?.contactId?.status}</option>
                    {singleCustomer?.contactId?.status !== 'ارسال فاکتور' && <option value='ارسال فاکتور'>ارسال فاکتور</option>}
                    {singleCustomer?.contactId?.status !== 'قرارحضوری' && <option value='قرارحضوری'>قرارحضوری</option>}
                    {singleCustomer?.contactId?.status !== 'ارسال قرارداد' && <option value='ارسال قرارداد'>ارسال قرارداد</option>}
                    {singleCustomer?.contactId?.status !== 'امضا قرارداد' && <option value='امضا قرارداد'>امضا قرارداد</option>}
                </select>
                <button onClick={() => { changeStatus(status) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
            </div>
        </section>
    )
}