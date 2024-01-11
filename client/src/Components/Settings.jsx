import { useStateContext } from '../Provider/contextProvider'
import Personal from './Personal'
import Contacts from './Contacts'
import Notifications from './Notifications'
import Privacy from './Privacy'
import Support from './Support'
import Limits from './Limits'
import Account from './MyAccount'



export default function Settings() {

    const { context } = useStateContext()


    return (
        <>
            <div className="options" style={{ width: context.settings ? '100%' : '0', left: context.settings ? '0' : '100%' }} >
                {
                    context.contactPage ? <Contacts /> : context.personal ? <Personal /> :
                        context.alerts ? <Notifications /> : context.privacy ? <Privacy /> : context.support ? <Support /> : context.limits ? <Limits /> : context.myAccount ? <Account /> : null}
            </div>
        </>
    )
}