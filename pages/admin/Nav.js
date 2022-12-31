import N from '../../styles/Nav.module.css';
import { useEffect, useState } from 'react';

const Nav=(prop)=>{
    return(
        <div className={N.nav}>
                <div className={N.navIcon} onClick={()=>{window.location='/admin/dashboard'}}>
                <svg viewBox="0 0 24 24" fill="none" ><path d="m4.333 9.286 6.75-5.223a1.499 1.499 0 0 1 1.834 0l6.75 5.223a1.5 1.5 0 0 1 .583 1.188v8.274c0 .83-.672 1.502-1.5 1.502h-3a1.5 1.5 0 0 1-1.5-1.5v-2.255A2.251 2.251 0 0 0 12 14.242a2.251 2.251 0 0 0-2.25 2.253v2.255a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.502v-8.274a1.5 1.5 0 0 1 .583-1.188Z"/></svg>
                Home
                </div>

                <div className={N.navIcon} onClick={()=>{window.location='/admin/products'}}>
                <svg viewBox="0 0 24 24" color="#000"><path d="M5 7h14v12H5zm3 0a4 4 0 1 1 8 0"/></svg>
                Products
                </div>

                <div className={N.navIcon} onClick={()=>{window.location='/admin/orders'}}>
                <svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/></svg>Orders
                </div>
                <div className={N.navIcon} onClick={()=>{window.location='/admin/users'}}>
                <svg viewBox="0 0 24 24"><path d="M12 11.796c2.719 0 4.923-2.193 4.923-4.898C16.923 4.193 14.72 2 12 2S7.077 4.193 7.077 6.898c0 2.705 2.204 4.898 4.923 4.898Zm2.564 2.041H9.436C6.462 13.837 4 16.286 4 19.245c0 .714.308 1.327.923 1.633C5.846 21.388 7.897 22 12 22s6.154-.612 7.077-1.122A1.93 1.93 0 0 0 20 19.245c0-3.061-2.462-5.408-5.436-5.408Z"/></svg>
                Users
                </div>
                {prop.user && prop.user.username?
                    <div className={N.navIcon} onClick={prop.signout}>
                    <svg  viewBox="0 0 48 48" ><path d="M23.992 6H6v36h18m9-9 9-9-9-9m-17 8.992h26" strokeWidth="4"/></svg>
                    Logout
                    </div>
                :''}
            </div>
    );
}
export default Nav;