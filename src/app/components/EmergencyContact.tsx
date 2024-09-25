'use client'

import { useEffect, useState } from "react"

export default function EmergencyContact({ contactInfo, edit = false, data }: any) {
    const [edited, setEdited] = useState(false)
    const [nameOne, setNameOne] = useState('')
    const [relOne, setRelOne] = useState('')
    const [mobileOne, setMobileOne] = useState('')
    const [addressOne, setAddressOne] = useState('')
    const [nameTwo, setNameTwo] = useState('')
    const [relTwo, setRelTwo] = useState('')
    const [mobileTwo, setMobileTwo] = useState('')
    const [addressTwo, setAddressTwo] = useState('')
    const contactOne = { nameOne: nameOne, relOne: relOne, mobileOne: mobileOne, addressOne: addressOne }
    const contactTwo = { nameTwo: nameTwo, relTwo: relTwo, mobileTwo: mobileTwo, addressTwo: addressTwo }
    useEffect(() => {
        if (edit) {
            if (data !== undefined) {
                setNameOne(data[0]?.nameOne)
                setRelOne(data[0]?.relOne)
                setMobileOne(data[0]?.mobileOne)
                setAddressOne(data[0]?.addressOne)
                setNameTwo(data[1]?.nameTwo)
                setRelTwo(data[1]?.relTwo)
                setMobileTwo(data[1]?.mobileTwo)
                setAddressTwo(data[1]?.addressTwo)
            }
        }
    }, [data])
    return (
        <section className="main-body-container rounded">
            <h5>تماس ضروری</h5>
            <section className="row">
                <div className="col-12 col-md-3 mb-2">
                    <label className='my-1' htmlFor="">نام </label>
                    <input disabled={!edited} type="text" defaultValue={nameOne} onChange={(e: any) => setNameOne(e.target.value)} className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-md-3 mb-2">
                    <label className='my-1' htmlFor="">نسبت </label>
                    <input disabled={!edited} type="text" defaultValue={relOne} onChange={(e: any) => setRelOne(e.target.value)} className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-md-3 mb-2">
                    <label className='my-1' htmlFor="">شماره موبایل </label>
                    <input disabled={!edited} type="text" defaultValue={mobileOne} onChange={(e: any) => setMobileOne(e.target.value)} className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-md-3 mb-2">
                    <label className='my-1' htmlFor="">آدرس سکونت </label>
                    <input disabled={!edited} type="text" defaultValue={addressOne} onChange={(e: any) => setAddressOne(e.target.value)} className="form-control form-control-sm" />
                </div>
            </section>
            <section className="row">
                <div className="col-12 col-md-3 mb-2">
                    <label className='my-1' htmlFor="">نام </label>
                    <input disabled={!edited} type="text" defaultValue={nameTwo} onChange={(e: any) => setNameTwo(e.target.value)} className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-md-3 mb-2">
                    <label className='my-1' htmlFor="">نسبت </label>
                    <input disabled={!edited} type="text" defaultValue={relTwo} onChange={(e: any) => setRelTwo(e.target.value)} className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-md-3 mb-2">
                    <label className='my-1' htmlFor="">شماره موبایل </label>
                    <input disabled={!edited} type="text" defaultValue={mobileTwo} onChange={(e: any) => setMobileTwo(e.target.value)} className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-md-3 mb-2">
                    <label className='my-1' htmlFor="">آدرس سکونت </label>
                    <input disabled={!edited} type="text" defaultValue={addressTwo} onChange={(e: any) => setAddressTwo(e.target.value)} className="form-control form-control-sm" />
                </div>
            </section>
            <div className="col-12 my-2">
                {!edited ? <button type='button' onClick={() => setEdited(true)} className="btn btn-primary btn-sm">{edit ? 'درخواست ویرایش':'افزودن مخاطب'}</button> : <button type='button' onClick={() => { setEdited(false), contactInfo([contactOne.nameOne !== '' && contactOne, contactTwo.nameTwo !== '' && contactTwo]) }} className="btn btn-success btn-sm">ثبت اطلاعات تماس</button>}
            </div>
        </section>
    )
}