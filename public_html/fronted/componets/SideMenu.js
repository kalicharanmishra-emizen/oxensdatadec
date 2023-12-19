import { useRouter } from 'next/router'
import Link from 'next/link'
import { logout } from '../reducers/authSlice'
import { useDispatch } from 'react-redux';
import { manageCartData } from '../reducers/mainSlice';
export default function SideMenu({closeNavWrap,authrize}) {
    const router = useRouter();
    const dispatch = useDispatch()
    const Logout=()=>{
        dispatch(logout())
        let cart = {
            orderItems:{},
            storeId:null,
            totalQuantity:0,
            totalAmount:0.00
          }
          localStorage.setItem('cart',JSON.stringify(cart))
          dispatch(manageCartData())
        document.body.classList=''
        router.push('/login')
    }
    return (
        <div className="navigation-wrap" >
            <div className="navigation-header">
            <h2>Menu</h2>
                <span className="close-icon" onClick={closeNavWrap}></span>
            </div>
            <ul>
                {
                    authrize?
                    <>
                        <li>
                            <Link href="/myOrder">
                                <a onClick={closeNavWrap}>My Order</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile">
                                <a onClick={closeNavWrap}>Profile</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/address">
                                <a onClick={closeNavWrap}>My Address</a>
                            </Link>
                        </li>
                    </>
                    :
                    <>
                        <li>
                            <Link href="/register-a-store">
                                <a onClick={closeNavWrap}>Register Restaurants </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/become-a-rider">
                                <a onClick={closeNavWrap}>Become a Rider</a>
                            </Link>
                        </li>
                    </>
                }
            <li>
                <Link href="/contact-us">
                    <a onClick={closeNavWrap}>Contact Us</a>
                </Link>
            </li>
            <li>
                <Link href="/terms-and-conditions">
                    <a onClick={closeNavWrap}>Terms &amp; Condition</a>
                </Link>
            </li>
            <li>
                <Link href="/privacy-policy">
                    <a onClick={closeNavWrap}>Privacy Policy</a>
                </Link>
            </li>
            {
               authrize?
                    <li>
                        <span role="button" onClick={(e) => {e.preventDefault();Logout()} } >
                            <a>Logout</a>
                        </span>
                    </li>
                :''
            }
            </ul>        
        </div>
    )
}
