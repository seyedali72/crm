'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function SideBar() {
    const path = usePathname()
    const [toggle, setToggle] = useState<boolean>(false)
    const [idx, setIdx] = useState<number>(0)
    useEffect(() => {
        if (path?.includes('/employe') || path?.includes('/departments') || path?.includes('/expert') || path?.includes('/teams')) { setToggle(true); setIdx(0) }
        if (path?.includes('/contacts') || path?.includes('/customers/categories') || path?.includes('/leads') || path?.includes('/customers')) { setToggle(true); setIdx(1) }
    }, [path])
    return (
        <aside id="sidebar" className="sidebar">
            <section className="sidebar-container">
                <section className="sidebar-wrapper">
                    <Link href="/" className="side-bar-link">
                        <i className="fa fa-home"></i>
                        <span>پیشخوان</span>
                    </Link>
                    {/* <section className="sidebar-title"> بخش فروش </section> */}
                    <section onClick={() => { setToggle(idx == 0 ? !toggle : true), setIdx(0) }} className={`sidebar-group-link ${(toggle && idx == 0) && 'sidebar-group-link-active'}`}>
                        <section className="sidebar-dropdown-toggle pointer">
                            <i className="fa fa-users icon"></i>
                            <span>مدیریت پرسنل</span>
                            <i className={`fa angle ${(toggle && idx == 0) ? 'fa-angle-down' : 'fa-angle-left'} `}></i>
                        </section>
                        <section className="sidebar-dropdown">
                            <Link href="/account/employe" className="sidebar-dropdown-link">پرسنل</Link>
                            <Link href="/account/departments" className="sidebar-dropdown-link">دپارتمان ها</Link>
                            <Link href="/account/expert" className="sidebar-dropdown-link">کارشناس ها  </Link>
                            <Link href="/account/teams" className="sidebar-dropdown-link">گروه بندی</Link>
                        </section>
                    </section>

                    <section onClick={() => { setToggle(idx == 1 ? !toggle : true), setIdx(1) }} className={`sidebar-group-link ${(toggle && idx == 1) && 'sidebar-group-link-active'}`}>
                        <section className="sidebar-dropdown-toggle pointer">
                            <i className="fa fa-users icon"></i>
                            <span>مدیریت مشتریان</span>
                            <i className={`fa angle ${(toggle && idx == 1) ? 'fa-angle-down' : 'fa-angle-left'} `}></i>
                        </section>
                        <section className="sidebar-dropdown">
                            <Link href="/account/contacts" className="sidebar-dropdown-link">مخاطبان</Link>
                            <Link href="/account/customers/categories" className="sidebar-dropdown-link">زمینه های فعالیتی</Link>
                            <Link href="/account/leads" className="sidebar-dropdown-link">سرنخ ها  </Link>
                            <Link href="/account/customers" className="sidebar-dropdown-link">مشتریان</Link>
                        </section>
                    </section>
                </section>
            </section>
        </aside>
    )
}