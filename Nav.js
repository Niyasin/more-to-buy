import N from './styles/Nav.module.css';
const Nav=(prop)=>{
    return(
        <div className={N.nav}>

                {prop.data?

                <div className={N.navIcon}>
                <img src={prop.data.profilepic} alt='images/unknown.jpg'/>
                <span className={N.small}>
                    {prop.data.username}
                    </span>
                </div>
                :''}
                <div className={N.navIcon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m4.333 9.286 6.75-5.223a1.499 1.499 0 0 1 1.834 0l6.75 5.223a1.5 1.5 0 0 1 .583 1.188v8.274c0 .83-.672 1.502-1.5 1.502h-3a1.5 1.5 0 0 1-1.5-1.5v-2.255A2.251 2.251 0 0 0 12 14.242a2.251 2.251 0 0 0-2.25 2.253v2.255a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.502v-8.274a1.5 1.5 0 0 1 .583-1.188Z"/></svg>
                Home
                </div>

                <div className={N.navIcon}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Cart
                </div>

                <div className={N.navIcon}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                Cart
                </div>
                <div className={N.navIcon}>
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="m10 3.22-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z"/></svg>Whishlist
                </div>
            </div>
    );
}
export default Nav;