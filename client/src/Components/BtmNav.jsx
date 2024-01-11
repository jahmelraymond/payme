import Icon from '../Logo/sendGetIcon.png'
import { useStateContext } from '../Provider/contextProvider'
import { BiSolidWallet } from 'react-icons/bi'

export default function BtmNav() {

    const { setContext, context } = useStateContext()
    // const handleWallet = () => {
    //     if (!context.wallet)
    //         setContext(prev => ({
    //             ...prev,
    //             wallet: true,
    //             recent: false,
    //             search: false,
    //             userProfile: false,
    //             settings: false,
    //             viewProfile: false,
    //             alerts: false,
    //             privacy: false,
    //             support: false,
    //             transaction: false,
    //             requesting: false,
    //             sending: false,
    //             fetching: true,
    //             contactPage: false,
    //             confirmAdd: false,
    //             confirmDelete: false,
    //             addCash: false,
    //             cashOut: false,
    //             input: '',
    //             recipient: null,
    //             contactProfile: '',
    //             bankInfo: false,
    //             userNotFound: false,
    //             addBank: false

    //         }))
    //     else {

    //         setContext(prev => ({
    //             ...prev,
    //             wallet: true,
    //             recent: false,
    //             search: false,
    //             userProfile: false,
    //             settings: false,
    //             viewProfile: false,
    //             alerts: false,
    //             privacy: false,
    //             support: false,
    //             transaction: false,
    //             requesting: false,
    //             sending: false,
    //             contactPage: false,
    //             confirmAdd: false,
    //             confirmDelete: false,
    //             addCash: false,
    //             cashOut: false,
    //             input: '',
    //             recipient: null,
    //             contactProfile: '',
    //             bankInfo: false,
    //             userNotFound: false,
    //             addBank: false

    //         }))
    //     }
    // }
    const handleHome = (e) => {
        setContext(prev => ({
            ...prev,
            recent: false,
            search: false,
            userProfile: false,
            settings: false,
            viewProfile: false,
            wallet: false,
            transaction: false,
            requesting: false,
            sending: false,
            input: '',
            fetching: false,
            contactPage: false,
            confirmAdd: false,
            confirmDelete: false,
            addCash: false,
            cashOut: false,
            recipient: null,
            contactProfile: '',
            userNotFound: false,
            wasOnRecent: false,
            wasOnContacts: false


        }))
    }
    const handleRecent = () => {
        if (!context.recent)
            setContext(prev => ({
                ...prev,
                recent: true,
                search: false,
                userProfile: false,
                settings: false,
                privacy: false,
                support: false,
                alerts: false,
                linked: false,
                contactPage: false,
                wallet: false,
                fetching: true,
                transaction: false,
                requesting: false,
                sending: false,
                input: '',
                contactProfile: '',
                addCash: false,
                cashOut: false,
                recipient: null,
                userNotFound: false,
                addBank: false
            }))
        else {
            setContext(prev => ({
                ...prev,
                recent: true,
                search: false,
                userProfile: false,
                settings: false,
                privacy: false,
                support: false,
                alerts: false,
                linked: false,
                contactPage: false,
                wallet: false,
                transaction: false,
                requesting: false,
                sending: false,
                input: '',
                contactProfile: '',
                addCash: false,
                cashOut: false,
                recipient: null,
                addBank: false
            }))
        }
    }


    return (
        <div className="btmNav" style={{ maxHeight: '60px' }}>
            <div className="recentTransactions" onClick={() => handleRecent()}><button><i style={{ color: 'white' }} className='fas fa-clock'></i></button></div>
            <div className="sendGet" onClick={() => handleHome()}><button><img className='icon' src={Icon} alt="" /></button></div>
            {/* <div className="invest"><button><i className='fas fa-chart-bar' style={{ color: 'white' }}></i></button></div> */}


            <div className="camera">
                <button><i className='fas fa-qrcode' style={{ color: 'white' }}></i></button>
            </div>

        </div>
    )
}