import { useStateContext } from '../Provider/contextProvider'
// import { useEffect } from 'react'
import { BsWallet2 } from 'react-icons/bs'
import { TbPlus } from 'react-icons/tb'
import { GiPayMoney } from 'react-icons/gi'
import { GiReceiveMoney } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Chase from '../Logo/chase.png'
import BOA from '../Logo/BOA.png'
import One from '../Logo/CapitalOne.png'
import Chime from '../Logo/chime.png'
import Citi from '../Logo/citi.png'
import PNC from '../Logo/PNC.png'
import US from '../Logo/USBank.png'
import WF from '../Logo/WellsFargo.png'
import Front from '../Logo/front.png'
export default function Wallet() {
    const { context, setContext } = useStateContext()
    const [line, setLines] = useState({
        bankNameLine: false,
        cardholderLine: false,
        expLine: false,
        cvvLine: false,
        zipLine: false,
        dcnLine: false,
        accountLine: false,
        routingLine: false,

    })
    const [info, setInfo] = useState({
        bankName: '',
        cardHolder: '',
        dcn: '',
        cvv: '',
        exp: '',
        zip: '',
        routing: '',
        account: '',
    })
    const [loading, NotLoading] = useState(true)
    useEffect(() => {
        axios.get('http://localhost:8080/getBalance/', { withCredentials: true })
            .then(res => {
                console.log('get balance fetch res', res.data)
                if (res.data.account.length) {
                    setContext(prev => ({
                        ...prev,
                        accountBalance: res.data.user.wallet.toString(),
                        fetching: false,
                        banks: [res.data.account[0]]
                    }))
                    NotLoading(false)
                }
                else {
                    setContext(prev => ({
                        ...prev,
                        accountBalance: '0',
                        fetching: false,
                        banks: []
                    }))
                    NotLoading(false)
                }
            })
            .catch(err => console.log('get balance fetch err', err))
    }, [])
    const handleNum = (e) => {
        if (context.input.includes('.') && context.input.split('.')[1].length < 2) {
            setContext(prev => ({ ...prev, input: prev.input + e.target.textContent }))
        }
        else if (!context.input.includes('.')) {
            setContext(prev => ({ ...prev, input: prev.input + e.target.textContent }))

        }
    }

    const handleDecimal = (e) => {
        if (!context.input.includes('.'))
            setContext(prev => ({ ...prev, input: prev.input + e.target.textContent }))
    }

    const handleDelete = (e) => setContext(prev => ({ ...prev, input: prev.input.split('').slice(0, prev.input.length - 1).join('') }))

    const handleToggleAddCash = () => {
        if (context.banks.length)
            setContext(prev => ({
                ...prev,
                addCash: true,
                cashOut: false,
            }))
    }
    const handleToggleCashOut = () => {
        if (context.banks.length)
            setContext(prev => ({
                ...prev,
                addCash: true,
                cashOut: true,
            }))
    }
    const handleToggleAddBank = () => {
        if (!context.banks.length)
            setContext(prev => ({
                ...prev,
                addBank: true
            }))
    }
    const handleCancel = () => {
        setContext(prev => ({
            ...prev,
            addCash: false,
            cashOut: false,
            addBank: false,
            input: ''
        }))
        setInfo(prev => ({
            ...prev,
            bankName: '',
            dcn: '',
            exp: '',
            zip: '',
            cvv: '',
            account: '',
            routing: '',
            cardHolder: ''
        }))
    }
    const handleAddCash = () => {
        if (context.banks.length)
            setContext(prev => ({
                ...prev,
                fetching: true
            }))
        axios.put(`http://localhost:8080/addCash/${context.input}/${context.session}/${context.banks[0]._id}`, { runValidators: true })
            .then(res => {
                console.log('handleAddCash res', res)
                setContext(prev => ({
                    ...prev,
                    addCash: false,
                    fetching: false,
                    input: '',
                    accountBalance: res.data.user.wallet.toString()
                }))
            })
            .catch(err => console.log('handleAddCash err ', err))

    }
    const handleCashOut = () => {
        setContext(prev => ({
            ...prev,
            fetching: true
        }))
        if (parseFloat(context.accountBalance) - parseFloat(context.input) >= 0)
            axios.put(`http://localhost:8080/cashOut/${context.session}/${context.input}/${context.banks[0]._id}`, { withCredentials: true })
                .then(res => {
                    setContext(prev => ({
                        ...prev,
                        addCash: false,
                        fetching: false,
                        input: '',
                        accountBalance: res.data.user.wallet.toString(),
                        cashOut: false
                    }))
                    console.log('handleCashOut res', res)

                })
                .catch(err => console.log('handleCashOut err ', err))

    }
    const toggleLines = (e) => {
        if (e.target.name === 'bank') setLines(prev => ({ ...prev, bankNameLine: true }))
        if (e.target.name === 'name') setLines(prev => ({ ...prev, cardholderLine: true }))
        if (e.target.name === 'dcn') setLines(prev => ({ ...prev, dcnLine: true }))
        if (e.target.name === 'cvv') setLines(prev => ({ ...prev, cvvLine: true }))
        if (e.target.name === 'exp') setLines(prev => ({ ...prev, expLine: true }))
        if (e.target.name === 'zip') setLines(prev => ({ ...prev, zipLine: true }))
        if (e.target.name === 'accountnum') setLines(prev => ({ ...prev, accountLine: true }))
        if (e.target.name === 'routingnum') setLines(prev => ({ ...prev, routingLine: true }))
    }
    const untoggleLines = (e) => {
        if (e.target.name === 'bank') setLines(prev => ({ ...prev, bankNameLine: false }))
        if (e.target.name === 'name') setLines(prev => ({ ...prev, cardholderLine: false }))
        if (e.target.name === 'dcn') setLines(prev => ({ ...prev, dcnLine: false }))
        if (e.target.name === 'cvv') setLines(prev => ({ ...prev, cvvLine: false }))
        if (e.target.name === 'exp') setLines(prev => ({ ...prev, expLine: false }))
        if (e.target.name === 'zip') setLines(prev => ({ ...prev, zipLine: false }))
        if (e.target.name === 'accountnum') setLines(prev => ({ ...prev, accountLine: false }))
        if (e.target.name === 'routingnum') setLines(prev => ({ ...prev, routingLine: false }))

    }
    const handleBankName = (e) => {
        setInfo(prev => ({
            ...prev,
            bankName: e.target.value
        }))
    }
    const handleCardHolder = (e) => {
        setInfo(prev => ({
            ...prev,
            cardHolder: e.target.value
        }))
    }
    const handleDcn = (e) => {
        setInfo(prev => ({
            ...prev,
            dcn: e.target.value
        }))
    }
    const handleCvv = (e) => {
        setInfo(prev => ({
            ...prev,
            cvv: e.target.value
        }))
    }
    const handleExp = (e) => {
        setInfo(prev => ({
            ...prev,
            exp: e.target.value
        }))
    }
    const handleZip = (e) => {
        setInfo(prev => ({
            ...prev,
            zip: e.target.value
        }))
    }
    const handleAccount = (e) => {
        setInfo(prev => ({
            ...prev,
            account: e.target.value
        }))
    }
    const handleRouting = (e) => {
        setInfo(prev => ({
            ...prev,
            routing: e.target.value
        }))
    }
    const handleAddBank = () => {
        if (info.routing && info.account && info.zip && info.exp && info.cvv && info.dcn && info.account && info.cardHolder && info.bankName)
            axios.post('http://localhost:8080/addBank', {
                userId: context.session,
                bankName: info.bankName,
                cardHolder: info.cardHolder,
                bankCardNumber: info.dcn,
                cvv: info.cvv,
                exp: info.exp,
                zip: info.zip,
                accountNumber: info.account,
                routingNumber: info.routing,
                balance: Math.floor(Math.random() * 3000)
            }, { withCredentials: true })
                .then(card => {
                    console.log('card  res', card)
                    setContext(prev => ({
                        ...prev,
                        addBank: false,
                        banks: [...prev.banks, card.data.bank]
                    }))
                })
                .catch(err => console.log('handleAddBank err', err))
    }
    // const viewBankInfo = () => {
    //     setContext(prev => ({
    //         ...prev,
    //         bankInfo: true
    //     }))
    // }
    return (
        <>
            {context.fetching ? <div className="loader"></div> : context.addCash ?
                <>
                    <div className="display">
                        <div className="inputDisplay">
                            <h3 style={{ fontSize: '60px', margin: '10px', fontWeight: 400, color: 'royalblue' }}>{context.input ? `$${context.input}` : `$${0}`}</h3>
                        </div>


                    </div>
                    <div className="keypad" >
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
                            <button className='request' style={{ width: '100%' }} onClick={() => handleCancel()}>Cancel</button>

                        </div>
                        <div className="btncontainer2" style={{ width: '100%', padding: '0' }}>
                            <button className='send' style={{ width: '100%', display: context.cashOut ? 'none' : 'block' }} onClick={() => handleAddCash()}>Add Cash</button>
                            <button className='send' style={{ width: '100%', display: context.cashOut ? 'block' : 'none' }} onClick={() => handleCashOut()}>Cash Out</button>

                        </div>
                    </div>
                </>
                : context.addBank ? <>
                    <div className="addCard" style={{ justifyContent: 'flex-start', display: 'flex', width: '100%', overflowX: 'hidden' }} >
                        <label htmlFor="number" style={{ color: line.bankNameLine ? 'royalblue' : 'black', textAlign: 'left' }}>Institutions Name</label>

                        <div className="signInContainers">
                            <input type="text" name="bank" id="bank" placeholder='e.g Wells Fargo' onChange={(e) => handleBankName(e)} required maxLength='19' onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                            <div className="underline" style={{ width: line.bankNameLine ? '100%' : '0' }}></div>

                        </div>
                        <label htmlFor="name" style={{ color: line.cardholderLine ? 'royalblue' : 'black', textAlign: 'left' }}>Cardholder Name</label>

                        <div className="signInContainers">
                            <input type="text" name="name" id="name" placeholder='John Doe' onChange={(e) => handleCardHolder(e)} maxLength='30' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                            <div className="underline" style={{ width: line.cardholderLine ? '100%' : '0' }}></div>
                        </div>

                        <label htmlFor="dcn" style={{ color: line.dcnLine ? 'royalblue' : 'black', textAlign: 'left' }}>Debit Card Number</label>

                        <div className="signInContainers">
                            <input type="text" name="dcn" id="dcn" placeholder='1234-5678-9101-1123' onChange={(e) => handleDcn(e)} required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                            <div className="underline" style={{ width: line.dcnLine ? '100%' : '0' }}></div>
                        </div>

                        <label htmlFor="cvv" style={{ color: line.cvvLine ? 'royalblue' : 'black', textAlign: 'left' }}>CVV</label>

                        <div className="signInContainers">
                            <input type="text" name="cvv" id="cvv" placeholder='123' onChange={(e) => handleCvv(e)} maxLength='3' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                            <div className="underline" style={{ width: line.cvvLine ? '100%' : '0' }}></div>
                        </div>

                        <p style={{ display: context.invalidCvv ? "block" : 'none', margin: '5px', color: 'red' }}>Invalid Card Cvv</p>
                        <label htmlFor="zip" style={{ color: line.expLine ? 'royalblue' : 'black', textAlign: 'left' }}>EXP</label>

                        <div className="signInContainers">
                            <input type="text" name="exp" id="exp" placeholder='08/24' onChange={(e) => handleExp(e)} maxLength='5' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                            <div className="underline" style={{ width: line.expLine ? '100%' : '0' }}></div>
                        </div>
                        <label htmlFor="zip" style={{ color: line.zipLine ? 'royalblue' : 'black', textAlign: 'left' }}>Postal Code</label>

                        <div className="signInContainers">
                            <input type="text" name="zip" id="zip" placeholder='85712' onChange={(e) => handleZip(e)} maxLength='5' pattern='[0-9]{5}' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                            <div className="underline" style={{ width: line.zipLine ? '100%' : '0' }}></div>
                        </div>
                        <label htmlFor="accountnum" style={{ color: line.accountLine ? 'royalblue' : 'black', textAlign: 'left' }}>Account Number</label>

                        <div className="signInContainers">
                            <input type="text" name="accountnum" id="accountnum" placeholder='1512025885' onChange={(e) => handleAccount(e)} maxLength='10' pattern='[0-9]{10}' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                            <div className="underline" style={{ width: line.accountLine ? '100%' : '0' }}></div>
                        </div>
                        <label htmlFor="routingnum" style={{ color: line.routingLine ? 'royalblue' : 'black', textAlign: 'left' }}>Routing Number</label>

                        <div className="signInContainers">
                            <input type="text" name="routingnum" id="routingnum" placeholder='1512025885' onChange={(e) => handleRouting(e)} maxLength='10' pattern='[0-9]{10}' required onFocus={(e) => toggleLines(e)} onBlur={(e) => untoggleLines(e)} />
                            <div className="underline" style={{ width: line.routingLine ? '100%' : '0' }}></div>
                        </div>
                        <p style={{ display: context.invalidZip ? "block" : 'none', margin: '5px', color: 'red' }}>Invalid Card Postal Code</p>
                        <div className="opt">
                            <button className='next' style={{ borderRadius: '10px' }} onClick={() => handleCancel()}>Cancel</button>
                            <button className='next' style={{ borderRadius: '10px' }} onClick={(e) => handleAddBank(e)}>Add Bank</button>
                        </div>
                    </div>
                </> :
                    <>
                        <h2 style={{ color: 'royalblue', fontWeight: '600', margin: '0' }}>Wallet <BsWallet2 /></h2>
                        <div className="balanceInfo">
                            <h1 style={{ fontWeight: '600', fontSize: '40px', margin: '10px 10px 0 10px' }}>
                                {context.accountBalance.includes('.') ? `$${parseFloat(context.accountBalance).toFixed(2)}` : context.accountBalance === '0' ? `$${context.accountBalance}` : `$${context.accountBalance}`}</h1>
                            <p style={{ margin: '0 0 10px 0', color: 'royalblue' }}>Balance</p>
                        </div>
                        <div className="addCash">
                            <button style={{ margin: '0 0 0 10px', backgroundColor: 'gainsboro', border: 'solid 3px gainsboro' }} onClick={() => handleToggleAddCash()}>Add Cash <GiPayMoney /> </button>
                            <button style={{ margin: '0 10px 0 0', backgroundColor: 'gainsboro', border: 'solid 3px gainsboro' }} onClick={() => handleToggleCashOut()}>Cash Out <GiReceiveMoney /></button>
                        </div>
                        <div className="linkedBanks" style={{ justifySelf: 'flex-start', width: '100%', margin: '10px 0 0 0' }}>
                            {!loading ? context.banks.length ? context.banks.map((item) => <div className="bank" style={{ display: 'flex', padding: '5px ', borderBottom: 'solid gainsboro 1px', borderTop: 'solid gainsboro 1px', cursor: 'pointer' }} onClick={() => viewBankInfo()}>
                                <img src={item.bankName === 'Chase' ? Chase : item.bankName === 'US Bank' ? US : item.bankName === 'Chime' ? Chime : item.bankName === 'Wells Fargo' ? WF : item.bankName === "PNC" ? PNC : item.bankName === 'Capital One' ? One : item.bankName === 'Citi' ? Citi : item.bankName === "Bank of America" || "Bank Of America" ? BOA : null} alt="" style={{ height: '4rem', width: '5rem', border: 'solid 3px gainsboro', borderRadius: '10px' }} />
                            </div>
                            ) : null : null}
                            <div className="addBank" style={{ display: 'flex', alignItems: 'center', padding: '0 20px 0 5px', borderBottom: 'solid gainsboro 1px', display: context.banks.length ? 'none' : 'flex' }}>
                                <p style={{ fontSize: '24px', margin: '0 10px 0 0', textAlign: 'center' }} onClick={() => handleToggleAddBank()}><TbPlus style={{ backgroundColor: 'gainsboro', color: 'royalblue', borderRadius: '10px', border: 'solid 3px gainsboro', margin: '5px 0 0 0' }} /> </p> <p style={{ color: 'gray', fontSize: '18px', margin: '5px 0 9px 0' }} >Add Bank</p>
                            </div>
                        </div>
                    </>
            }
        </>
    )
}