import { useStateContext } from '../Provider/contextProvider'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { MdAccountCircle } from 'react-icons/md'



export default function Personal() {
    const { context, setContext } = useStateContext()
    const [data, setData] = useState({
        contacts: [],
        saveBio: false,
        saveNumber: false,
        saveEmail: false,
        saveName: false,
        bioUpdated: false,
        emailUpdated: false,
        numberUpdated: false,
        nameUpdated: false,
        editBio: false,
        editNumber: false,
        editEmail: false,
        editName: false,
        numberLine: false,
        bioLine: false,
        addressLine: false,
        emailLine: false,
        bioInput: false,
        bio: '',
        email: '',
        number: '',
        name: '',

    })
    useEffect(() => {
        axios.get(`http://localhost:8080/update/${context.session}`)
            .then(res => {
                setContext(prev => ({
                    ...prev,
                    email: res.data.email,
                    bio: res.data.bio,
                    phone: res.data.phonenumber,
                    fullname: res.data.fullname,
                    fetching: false
                }))
            })
            .catch(err => console.error('update info error', err))


    }, [data.emailUpdated, data.nameUpdated, data.bioUpdated, data.numberUpdated, context.session])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get('http://localhost:8080/getbankinfo', { withCredentials: true })
            .then(bank => {
                console.log('fetch successful', bank.data)
                setContext(prev => ({
                    ...prev,
                    banks: [bank.data.accounts[0]],
                    bio: bank.data.bio,
                }))
            })
            .finally(() => setLoading(false)
            )
            .catch(err => console.log('getbankinfo err', err))
    }, [])

    const handleBio = (e) => {
        let bio = e.target.value
        if (!bio) {
            setData(prev => ({ ...prev, saveBio: false }))
        }
        else {
            setData(prev => ({ ...prev, bio: bio, saveBio: true, bioUpdated: false }))
        }
    }
    const saveBio = (e) => {
        axios.put(`http://localhost:8080/bio/${context.session}`, { bio: data.bio })
            .then(res => setData(prev => ({ ...prev, bioUpdated: true, editBio: false, saveBio: false })))
            .catch(err => console.error('saveBio error', err))
    }
    const editBio = (e) => {
        setContext(prev => ({ ...prev, bio: '' }))
        setData(prev => ({ ...prev, bio: '', editBio: true }))
    }
    const handlePhone = (e) => {
        let number = e.target.value
        if (!number) {
            setData(prev => ({ ...prev, saveNumber: false }))
        }
        else {
            setData(prev => ({ ...prev, saveNumber: true, number: number, numberUpdated: false }))
        }
    }
    const saveNumber = (e) => {
        axios.put(`http://localhost:8080/phone/${context.session}`, { phonenumber: data.number })
            .then(res => setData(prev => ({ ...prev, numberUpdated: true, saveNumber: false })))
            .catch(err => console.error('saveNumber error', err))
    }
    const editNumber = (e) => {
        setContext(prev => ({ ...prev, phone: '' }))
        setData(prev => ({ ...prev, number: '', editNumber: true }))
    }
    const toggleCancel = (e) => {
        if (e.target.name === 'email')
            setData(prev => ({
                ...prev,
                editEmail: true
            }))
        if (e.target.name === 'address')
            setData(prev => ({
                ...prev,
                editAddress: true
            }))
        if (e.target.name === 'number')
            setData(prev => ({
                ...prev,
                editNumber: true
            }))
        if (e.target.name === 'bio')
            setData(prev => ({
                ...prev,
                editBio: true
            }))
        console.log('firing')
    }
    const handleEmail = (e) => {
        let email = e.target.value
        if (!email) {
            setData(prev => ({ ...prev, saveEmail: false }))
        }
        else {
            setData(prev => ({ ...prev, saveEmail: true, email: email, emailUpdated: false }))
        }
        // e.target.addEventListener('click', toggleCancel, false)
    }
    const saveEmail = (e) => {
        axios.put(`http://localhost:8080/email/${context.session}`, { email: data.email })
            .then(res => setData(prev => ({ ...prev, emailUpdated: true, saveEmail: false })))
            .catch(err => console.error('saveEmail error', err))
    }
    const editEmail = (e) => {
        setContext(prev => ({ ...prev, email: '' }))
        setData(prev => ({ ...prev, email: '', editEmail: true }))
    }
    const handleName = (e) => {
        let name = e.target.value
        if (!name) {
            setData(prev => ({ ...prev, saveName: false }))
        }
        else {
            setData(prev => ({ ...prev, saveName: true, name: name, nameUpdated: false }))
        }
    }
    const saveName = (e) => {
        axios.put(`http://localhost:8080/name/${context.session}`, { fullname: data.name })
            .then(res => setData(prev => ({ ...prev, nameUpdated: true, saveName: false })))
            .catch(err => console.error('saveName error', err))
    }
    const editName = (e) => {
        setContext(prev => ({ ...prev, fullname: '' }))
        setData(prev => ({ ...prev, name: '', editName: true }))
    }
    const handleCancel = (e) => {
        axios.get(`http://localhost:8080/cancel/${context.session}`)
            .then(res => {
                setContext(prev => ({
                    ...prev,
                    email: res.data.email,
                    bio: res.data.bio,
                    phone: res.data.phonenumber,
                    fullname: res.data.fullname
                }))
                if (e.target.name === 'bio') {
                    setData(prev => ({
                        ...prev,
                        email: res.data.email,
                        bio: res.data.bio,
                        number: res.data.phonenumber,
                        address: res.data.address,
                        editBio: false,
                    }))
                    console.log('bio')

                }
                else if (e.target.name === 'phone') {
                    setData(prev => ({
                        ...prev,
                        email: res.data.email,
                        bio: res.data.bio,
                        number: res.data.phonenumber,
                        address: res.data.address,
                        editNumber: false,
                    }))
                    console.log('phone')
                }
                else if (e.target.name === 'email') {
                    setData(prev => ({
                        ...prev,
                        email: res.data.email,
                        bio: res.data.bio,
                        number: res.data.phonenumber,
                        address: res.data.address,
                        editEmail: false,
                    }))
                    console.log('email')
                }
                else if (e.target.name === 'name') {
                    setData(prev => ({
                        ...prev,
                        email: res.data.email,
                        bio: res.data.bio,
                        number: res.data.phonenumber,
                        name: res.data.fullname,
                        editName: false,
                    }))
                    console.log('address')
                }
            })
            .catch(err => console.error('handleCancel error', err))
    }

    return (
        <>
            <div className="addBank">

            </div>

            {
                !loading ? <><h2 className='testHeader' style={{ color: 'royalblue', fontWeight: '350', position: 'sticky', top: '0', margin: '0', fontSize: '5vw', padding: '10px 0' }}>My Account <i class='fas fa-user-circle' style={{ color: 'royalblue' }}></i></h2>
                    <div className="editProfile">
                        <div className="paytag">
                            <p className="heading" style={{ backgroundColor: 'white', color: 'royalblue   ', padding: '0 0 3px 16px', margin: '9px 0 9px 0', fontWeight: '350' }}>Paytag</p>
                            <div style={{ borderBottom: 'solid 0.5px royalblue', width: '100%' }}></div>
                            <h5 style={{ padding: '0.5rem 0 0.5rem 1rem', fontSize: '16px', fontWeight: '600', margin: '9px 0 9px 0' }}>{context.payTag}</h5>
                        </div>
                        <div className="addBio">
                            <p className="heading" style={{ backgroundColor: 'white', color: 'royalblue   ', padding: '0 0 3px 16px', fontWeight: '350' }}>Bio</p>
                            <div style={{ borderBottom: 'solid 0.5px royalblue', width: '100%' }}></div>
                            {
                                context.bio ?
                                    <div className="bioHeader">
                                        <h5 style={{ padding: '5px 0 2px 1rem', margin: '9px 0 9px 0' }}>{context.bio}</h5>
                                        <p style={{ alignSelf: 'flex-end', color: 'royalblue', fontSize: '18px', backgroundColor: 'transparent', padding: '0 0 0 3rem', cursor: 'pointer', fontWeight: '400' }} onClick={(e) => editBio(e)}><i class='fas fa-pencil-alt'></i></p>
                                    </div>
                                    :
                                    <div className="bioInput">


                                        <input type="text" name="bio" id="" placeholder="Add Bio" onChange={(e) => handleBio(e)} style={{ flex: data.saveBio ? '0.6' : '1', padding: '10px 15px' }} onClick={(e) => toggleCancel(e)} />

                                        <button name='bio' className='editBtn' style={{ display: data.editBio ? 'block' : 'none' }} onClick={(e) => handleCancel(e)}>Cancel</button>
                                        <button style={{ display: data.saveBio ? 'block' : 'none' }} onClick={(e) => saveBio(e)}>Save</button>
                                    </div>
                            }
                        </div>
                        <div className="yourinfo" >
                            <p className='heading' style={{ backgroundColor: 'white', color: 'royalblue   ', padding: '0 0 3px 16px', fontWeight: '350' }}>Account Info</p>
                            <div style={{ borderBottom: 'solid 0.5px royalblue', width: '100%' }}></div>
                            {context.phone ?
                                <div className="phoneHeader">

                                    <h5 style={{ padding: '5px 0 2px 1rem', margin: '9px 0 9px 0' }}>{context.phone}</h5>
                                    <p style={{ alignSelf: 'center', color: 'royalblue', fontSize: '18px', backgroundColor: 'transparent', padding: '0 0 0 3rem', cursor: 'pointer', fontWeight: '400' }} onClick={() => editNumber()}><i class='fas fa-pencil-alt'></i></p>
                                </div>
                                :
                                <div className="inputContainers">
                                    <div className="phoneInput">
                                        <input type="text" name="number" id="" placeholder='Add a Mobile Number' onChange={(e) => handlePhone(e)} style={{ flex: data.saveNumber ? '0.6' : '1', padding: '10px 15px' }} onClick={(e) => toggleCancel(e)} />
                                        <button name='phone' className='editBtn' style={{ display: data.editNumber ? 'block' : 'none' }} onClick={(e) => handleCancel(e)}>Cancel</button>
                                        <button style={{ display: data.saveNumber ? 'block' : 'none' }} onClick={(e) => saveNumber(e)}>Save</button>

                                    </div>

                                </div>
                            }
                            {context.email ?
                                <div className="emailHeader">
                                    <h5 style={{ padding: '5px 0 2px 1rem', margin: '9px 0 9px 0' }}>{context.email}</h5>
                                    <p style={{ alignSelf: 'center', color: 'royalblue', fontSize: '18px', backgroundColor: 'transparent', padding: '0 0 0 3rem', cursor: 'pointer', fontWeight: '400' }} onClick={() => editEmail()}><i class='fas fa-pencil-alt'></i></p>
                                </div>
                                :
                                <div className="inputContainers">
                                    <div className="emailInput">
                                        <input type="text" name="email" id="" placeholder='Add an Email Address' onChange={(e) => handleEmail(e)} style={{ flex: data.saveEmail ? '0.6' : '1', padding: '10px 15px' }} onClick={(e) => toggleCancel(e)} />
                                        <button name='email' style={{ display: data.editEmail ? 'block' : 'none' }} onClick={(e) => handleCancel(e)}>Cancel</button>
                                        <button style={{ display: data.saveEmail ? 'block' : 'none' }} onClick={(e) => saveEmail(e)}>Save</button>
                                    </div>

                                </div>

                            }
                            {context.fullname ?
                                <div className="nameHeader" >
                                    <h5 style={{ padding: '5px 0 2px 1rem', margin: '9px 0 9px 0' }}>{context.fullname}</h5>
                                    <p style={{ alignSelf: 'center', color: 'royalblue', fontSize: '18px', backgroundColor: 'transparent', padding: '0 0 0 3rem', cursor: 'pointer', fontWeight: '400' }} onClick={() => editName()}><i class='fas fa-pencil-alt'></i></p>
                                </div>
                                : <div className="inputContainers">
                                    <div className="emailInput">
                                        <input type="text" name="name" id="" placeholder='e.g John Doe' onChange={(e) => handleName(e)} style={{ flex: data.saveName ? '0.6' : '1', padding: '10px 15px' }} onClick={(e) => toggleCancel(e)} />
                                        <button name='name' style={{ display: data.editName ? 'block' : 'none' }} onClick={(e) => handleCancel(e)}>Cancel</button>
                                        <button style={{ display: data.saveName ? 'block' : 'none' }} onClick={(e) => saveName(e)}>Save</button>
                                    </div>

                                </div>
                            }
                        </div>
                        <div className="currency">
                            <p className='heading' style={{ backgroundColor: 'white', color: 'royalblue   ', padding: '0 0 3px 16px', fontWeight: '350' }}>Currency</p>
                            <div style={{ borderBottom: 'solid 0.5px royalblue', width: '100%' }}></div>
                            <div className="currencyInfo" style={{ padding: '0 1rem 0 0' }} >

                                <h5 style={{ padding: '5px 0 2px 1rem', margin: '9px 0 9px 0' }}>USD</h5>
                                <select name="currency" id="currency" style={{ fontSize: '16px', border: 'solid 0.5px royalblue' }}>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>
                        <div className="bank">
                            <p className='heading' style={{ backgroundColor: 'white', color: 'royalblue   ', padding: '0 0 3px 16px', fontWeight: '350' }}>Bank</p>
                            <div style={{ borderBottom: 'solid 0.5px royalblue', width: '100%' }}></div>
                            <div className="bankInfo" style={{ padding: '0 1rem 0 0' }} >


                                <h5 style={{ padding: '5px 0 2px 1rem', margin: '9px 0 9px 0' }}>{context.banks[0].bankName}</h5>

                                <p style={{ alignSelf: 'center', color: 'royalblue', fontSize: '18px', backgroundColor: 'transparent', padding: '0 0 0 3rem', cursor: 'pointer', fontWeight: '400' }} onClick={() => editName()}><i class='fas fa-pencil-alt'></i></p>

                            </div>
                        </div>


                    </div>
                </> : null}
        </>
    )
}