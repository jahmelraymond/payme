import { useStateContext } from '../Provider/contextProvider'
import SendRequest from './SendRequest'
import { GiPayMoney } from 'react-icons/gi'
import { GiReceiveMoney } from 'react-icons/gi'
import axios from 'axios'
import { v4 } from 'uuid'
export default function Home() {

    const { context, setContext, icon } = useStateContext()

    const handleNum = (e) => {
        // setContext(prev => ({ ...prev, input: prev.input + e.target.textContent }))
        if (context.input.includes('.') && context.input.split('.')[1].length < 2) {
            setContext(prev => ({ ...prev, input: prev.input + e.target.textContent }))
        }
        else if (!context.input.includes('.')) {
            setContext(prev => ({ ...prev, input: prev.input + e.target.textContent }))

        }
        console.log('event fired')
    }


    const handleDecimal = (e) => {
        if (!context.input.includes('.'))
            setContext(prev => ({ ...prev, input: prev.input + e.target.textContent }))
    }

    const handleDelete = (e) => setContext(prev => ({ ...prev, input: prev.input.split('').slice(0, prev.input.length - 1).join('') }))

    const handleSend = () => {
        if (context.input)
            setContext(prev => ({
                ...prev,
                transaction: true,
                sending: true,
                enterPin: false
            }))
    }
    const handleRequest = () => {
        if (context.input)
            setContext(prev => ({
                ...prev,
                transaction: true,
                requesting: true,
                enterPin: false
            }))
    }
    const handleViewContact = (id) => {
        setContext(prev => ({
            ...prev,
            contactProfile: id,
            viewProfile: true,
            contactPage: false,
            recent: false,
            settings: false,
            search: false,
            searched: false,
            results: []

        }))
    }
    const handleRequestTwo = (e) => {
        let id = e.target.id
        axios.get(`http://localhost:8080/getContactOne/${id}`)
            .then(contact => {
                setContext(prev => ({
                    ...prev,
                    recipient: contact.data,
                    transaction: true,
                    requesting: true,
                    settings: false,
                    contactPage: false,
                    viewProfile: false,
                    results: []

                }))
            })
            .catch(err => console.log('handleRequest err', err))
        console.log('handleRequest fired')



    }
    const handleSendTwo = (e) => {
        let id = e.target.id
        axios.get(`http://localhost:8080/getContactTwo/${id}`)
            .then(contact => {
                setContext(prev => ({
                    ...prev,
                    recipient: contact.data,
                    transaction: true,
                    sending: true,
                    settings: false,
                    contactPage: false,
                    viewProfile: false,
                    results: []
                }))
            })
            .catch(err => console.log('handleSend err', err))
    }
    const handleCloseResult = () => {
        setContext(prev => ({
            ...prev,
            results: []
        }))
        console.log('results reset')
    }


    return (
        <>
            <div className="searchResult" style={{ position: 'absolute', height: context.results.length ? '10%' : '0' , zIndex:'2'}} onClick={() => console.log('test 1')}>
                {context.results.length ? context.results.map((item) => item.findMe ? <div className="result" style={{ display: 'flex', borderBottom: 'solid 0.5px royalblue', width: '100%', zIndex: '2', backgroundColor: 'white', boxShadow: '2px 2px 15px royalblue' }} key={v4()} id={item._id} >


                    {/* <div className="searchUserIcon" onClick={(id) => handleViewContact(item._id)} style={{ padding: '0', flex: '.20' }}>
                        {
                            <i className={`fas-sharp fa-${item.username[1]}`} style={icon}></i>
                        }
                    </div> */}
                    <div className="searchUserInfo" style={{ flex: '.4', display: 'flex', justifyContent: 'flex-start', padding: '0 0 0 15px' }} id={item._id} onClick={(id) => handleViewContact(item._id)}>
                        <h5 style={{ margin: '5px 0 5px 0', fontWeight: '350' }}>{item.username}</h5>
                    </div>
                    <div className="searchViewProfile" style={{ padding: '10px', justifyContent: 'center', alignItems: 'center', flex: '.5', }}>
                        <button onClick={(e) => handleRequestTwo(e)} style={{ borderRadius: '5px 0 0 5px', height: '50%', border: 'solid 0.5px royalblue', padding: '0 20px' }} id={item._id}>Request</button>
                        <button onClick={(e) => handleSendTwo(e)} style={{ borderRadius: '0 5px 5px 0', height: '50%', border: 'solid 0.5px royalblue', padding: '0 30px' }} id={item._id}>Pay</button>
                    </div>
                    <div className="close" style={{ flex: '0.1', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px' }}  onClick={handleCloseResult}>
                        <i className="fa-regular fa-circle-xmark" style={{ fontSize: '22px', color: 'royalblue' }}  onClick={handleCloseResult}></i>
                    </div>


                </div> : null
                )
                    : null
                }

            </div>
            {context.transaction ? <SendRequest /> :
                <>
                    <div className="display" style={{ zIndex: '1' }} >
                        <div className="inputDisplay">
                            <h3 style={{ fontSize: '60px', margin: context.results.length ? '40px 10px 10px 10px' : '10px', fontWeight: 400, color: 'royalblue', transition: '0.15s' }}>{context.input ? `$${context.input}` : `$${0}`}</h3>
                        </div>

                    </div>
                    <div className="keypad">
                        <div className="keys">
                            <button className='key' onClick={(e) => handleNum(e)}>1</button>
                            <button className='key' onClick={(e) => handleNum(e)}>2</button>
                            <button className='key' onClick={(e) => handleNum(e)}>3</button>
                            <button className='key' onClick={(e) => handleNum(e)}>4</button>
                            <button className='key' onClick={(e) => handleNum(e)}>5</button>
                            <button className='key' onClick={(e) => handleNum(e)}>6</button>
                            <button className='key' onClick={(e) => handleNum(e)}>7</button>
                            <button className='key' onClick={(e) => handleNum(e)}>8</button>
                            <button className='key' onClick={(e) => handleNum(e)}>9</button>
                            <button className='key' onClick={(e) => handleDecimal(e)}>.</button>
                            <button className='key' onClick={(e) => handleNum(e)}>0</button>
                            <button className='key' onClick={(e) => handleDelete(e)}><i className='fas fa-backspace'></i></button>
                        </div>
                    </div>
                    <div className="reqSend">
                        <div className="btncontainer1" style={{ width: '100%', padding: '0' }}>
                            <button className='request' style={{ width: '100%' }} onClick={() => handleRequest()}>Request </button>

                        </div>
                        <div className="btncontainer2" style={{ width: '100%', padding: '0' }}>
                            <button className='send' style={{ width: '100%' }} onClick={() => handleSend()}>Pay  </button>

                        </div>
                    </div>
                </>
            }

        </>
    )
}