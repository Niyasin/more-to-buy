import N from './styles/Nav.module.css';
const Nav=(prop)=>{


    return(
        <div className={N.nav}>
                <div className={N.navIcon} onClick={()=>{window.location!='/'?window.location='/':''}}>
                <svg viewBox="0 0 24 24" fill="none" ><path d="m4.333 9.286 6.75-5.223a1.499 1.499 0 0 1 1.834 0l6.75 5.223a1.5 1.5 0 0 1 .583 1.188v8.274c0 .83-.672 1.502-1.5 1.502h-3a1.5 1.5 0 0 1-1.5-1.5v-2.255A2.251 2.251 0 0 0 12 14.242a2.251 2.251 0 0 0-2.25 2.253v2.255a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.502v-8.274a1.5 1.5 0 0 1 .583-1.188Z"/></svg>
                Home
                </div>

                <div className={N.navIcon} onClick={()=>{prop.user?window.location='/dashboard':prop.login()}}>
                <svg viewBox="0 0 24 24"  fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Cart
                </div>

                <div className={N.navIcon} onClick={()=>{prop.user?window.location='/dashboard':prop.login()}}>
                <svg viewBox="0 0 24 24" ><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                Dashboard
                </div>
                <div className={N.navIcon} onClick={()=>{prop.user?window.location='/wishlist':prop.login()}}>
                <svg viewBox="0 0 24 24"><path d="M22 9.075c0 1.645-.714 3.084-1.837 4.215l-7.653 7.504c-.204.103-.306.206-.51.206a.776.776 0 0 1-.51-.206l-7.653-7.607C2.714 12.057 2 10.514 2 8.87c0-1.542.714-2.98 1.837-4.112 1.224-1.13 2.755-1.85 4.387-1.747 1.327 0 2.551.514 3.572 1.336 2.449-1.953 5.918-1.747 8.163.514C21.286 5.888 22 7.43 22 9.075Z"/></svg>
                Whishlist
                </div>
            </div>
    );
}
export default Nav;