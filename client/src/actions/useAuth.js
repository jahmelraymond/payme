import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// this is a legit custom hook.
//When we call it on any component - it verifies the user viewing that page/component is SIGNED IN - redirects them if not

//All from a single one line call of this useAuth hook.

const useAuth = (link = "") => { // function > takes a optional link param, if not included, blank string
    /// this param ^^^^ is DEF NOT required - this just gives our hook extra functionality as we can specify a URL path to redirect to, if user is not Auth'd, on specific instances where we use this hook 
    // see /views/New.jsx LINE 23 to see how we can take advantage of this functionality and direct a user to "/register" instead of the default "/"

    const nav = useNavigate();// get our quick access to useNavigate

    //make axios call to our auth route/metho.
    axios({
        method: "GET",
        withCredentials: true, //Really the most critical time to send Credentials - thats the only thing our backend auth route is looking for.
        url: "http://localhost:8080/user/auth"
    })
        .then(res => { // take the response... if user is signed in - it will have a .user value in res.data
            if (!res.data.user) { // so if it doesnt have that
                return nav("/") // return => navigate them to '/' + whatever potential param was passed in - if none just to "/"
            } else { // they are auth'd and signed in - we know for sure.. so just return out and log something for our dev purposes.
                // return console.log("User authenticated!")
                return null
            }
        })
        .catch(err => { // if any errors on this call for any reason, log em, and nav them back home to be safe.
            console.log(err);
            nav("/");
        })
}

export default useAuth // standard export.