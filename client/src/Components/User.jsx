import TopNav from './TopNav'
import BtmNav from './BtmNav'
import Content from './Content'
import { useStateContext } from '../Provider/contextProvider'
import Logo from '../Logo/PayMeLogo.png'
import axios from 'axios'



export default function User() {
    const { context, setContext } = useStateContext()
    const handleLogOut = () => {
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/logout',
            withCredentials: true,

        })
            .then(res => {
            }).finally(() => {
                setContext(prev => ({
                    signedIn: false,
                    contactInfo: false,
                    codeMatch: false,
                    phoneOrEmail: false,
                    codeHeader: false,
                    cardHeader: false,
                    userHeader: false,
                    passwordHeader: false,
                    usernameTaken: false,
                    usernamePicked: false,
                    authenticate: false,
                    matched: false,
                    userProfile: false,
                    search: false,
                    recent: false,
                    send: false,
                    logIn: true,
                    userNotFound: false,
                    confirmAdd: false,
                    contactPage: false,
                    settings: false,
                    usernotFound: false,
                    userFound: false,
                    personal: false,
                    input: '',
                    phone: '',
                    email: '',
                    code: '',
                    confirmCode: '',
                    payTag: '',
                    fullname: '',
                    password: '',
                    verifyPassord: '',
                    searchKey: '',
                    contacts: [],
                    results: [],
                    recentActivity: [],
                    find: 'Find Your Friends',
                    session: '',
                    profilePic: '',
                    bio: ''
                }))
                localStorage.clear()
                console.log(sessionStorage.clear())
            })
            .catch(err => console.error('handleLogout caught error ', err))



    }

    return (

        <>
            {context.locked ? <>
                <div className="topNav" style={{ order: '1', zIndex: '1', maxHeight: '40px' }}  >
                    <div className="logo">
                        <h3><img src={Logo} className='appLogo' alt="app Logo" /></h3>
                    </div>
                </div>
                <div className="disabled" style={{ height: '100%', order: '2', textAlign: 'center', color: 'royalblue' }}>
                    <div className="message" style={{ position: 'relative', top: '8rem' }}>
                        <h3 style={{ margin: '10px 0 10rem 0' }}>Your account has been temporarily disabled please contact payme support team @ paymesupport@payme.com </h3>
                        <button className='next' onClick={() => handleLogOut()}>Log Out</button>
                    </div>
                </div>
            </> :
                <>
                    <TopNav />
                    <Content />
                    <BtmNav />
                </>
            }
        </>

    )
}