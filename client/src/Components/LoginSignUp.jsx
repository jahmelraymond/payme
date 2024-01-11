import { useStateContext } from '../Provider/contextProvider'
import Login from './Login'
import OnBoarding from './OnBoarding'
import Verify from './Verify'
import Logo from '../Logo/PayMeLogo.png'




export default function LoginSignUp() {
    const { context } = useStateContext()


    return (
        <>
            <div className="subNav" style={{ width: '100%', display: context.signedIn ? 'none' : 'flex' }}>

                <div className="logo">
                    <h3><img src={Logo} className='appLogo' alt="app Logo" /></h3>
                </div>

            </div>
            <div className="headersblock" style={{ textAlign: 'left' }}>

                <h3 style={{ display: context.phoneOrEmail ? 'block' : 'none' }}>Enter your phone or email</h3>
                <h3 style={{ display: context.codeHeader ? 'block' : 'none' }}>{context.email ? `Please enter the code sent to ${context.email}` : `Please enter the code sent to ${context.phone}`}</h3>
                <h3 style={{ display: context.addBank ? 'block' : 'none' }}>Please your bank account information</h3>
                <h3 style={{ display: context.userHeader ? 'block' : 'none', fontWeight: '300' }}>Enter your @ paytag</h3>
                <p style={{ display: context.userHeader ? 'block' : 'none', padding: '0 0 20px 20px', fontSize: '16px', margin: 'auto' }}>Share with friends & colleagues to send & recieve money</p>
                <h3 style={{ display: context.skipped ? 'block' : 'none', fontSize: '20px', margin: '5px' }}>Please enter  your shipping address to recieve your payme card.</h3>
                <h3 style={{ display: context.passwordHeader && !context.passwordsDontMatch ? 'block' : 'none' }}>Please enter your password</h3>
                <h3 style={{ display: context.passwordsDontMatch ? 'block' : 'none', color: 'red', }}>Passwords do not match please enter the same password in both fields</h3>

                <h3 style={{ display: context.authenticate ? 'block' : 'none' }}>Your account has been created please log in</h3>
                <h3 style={{ display: context.logIn && !context.usernotFound ? 'block' : 'none' }}>Please enter your username, phone, or email and password</h3>
                <h3 style={{ fontSize: '18px', padding: '10px', color: 'red', display: context.usernotFound ? 'block' : 'none', fontWeight: '200' }}>Incorrect username/password please try again</h3>

                {!context.contactInfo && !context.codeMatch ? <Login />
                    : context.codeMatch ? <OnBoarding /> : <Verify />}

            </div>
        </>
    )
}