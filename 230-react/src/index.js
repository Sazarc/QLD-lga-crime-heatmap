import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/layout.css';
import './styles/opening.css';
import {SelectOptions} from './Filter';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Link} from 'react-router-dom'
import {Route, Redirect} from 'react-router';

// export const apiLink = "https://cab230.hackhouse.sh/";
export const apiLink = "https://172.22.24.250/";

export let JWT;

function Landing(){
    document.title = 'Welcome - QLD Crime';

    return (
        <div className="central-div" id="central-div-id">
            <h2>Welcome to QLD Crime statistics</h2>
            <h3>Please login or register below</h3>
            <Link to={'/register'}>
                <button className="btn register">Register</button>
            </Link>
            <Link to={'/login'}>
                <button className="btn">Login</button>
            </Link>
        </div>
    );
}

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {email: '', psw: '', apiResponse: '', complete: false};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event){
        event.preventDefault();
        let email = this.state.email;
        let psw = this.state.psw;
        let text = 'email=' + email + '&password=' + psw;

        fetch(apiLink +"register", {
            method: "POST",
            body: text,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then((response) => {
                if(response.ok){
                    return response.json();
                }
                else if(response.status === 400){
                    this.setState({apiResponse: "User already exists!"});
                }
                throw new Error("User creation failed")
                //throw new Error('Network response was not ok');
            })
            .then((result) => {
                console.log(result);
                this.setState({complete: true})
                // ReactDOM.render(<Login email={email} psw={psw}/>, document.getElementById('root'));
            })
            .catch(function(error) {
                console.log("There has been a problem with your fetch operation: ", error.message);
            })
    }

    componentDidMount() {
        document.title = 'Register - QLD Crime';
    }

    render() {
        if(this.state.complete === true){
            return <Redirect to={"/login"}/>
        }

        return (
            <div className="central-div" id="central-div-id">
                <form className="form-container" onSubmit={this.handleSubmit}>
                    <h1>Register</h1>
                    <label htmlFor="email"><b>Email</b></label>
                    <input type="text" value={this.state.email} onChange={this.handleInputChange} placeholder="Enter Email" name='email' required/>

                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" value={this.state.psw} onChange={this.handleInputChange} placeholder="Enter Password" name='psw' required/>

                    <button className="btn register" id="register">Register</button>
                </form>
                <p id="formResponse">{this.state.apiResponse}</p>
            </div>
        );
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', psw: '', apiResponse: '', complete: false};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();

        let text = 'email=' + this.state.email + '&password=' + this.state.psw;

        fetch(apiLink +"login", {
            method: "POST",
            body: text,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then((response) => {
                if(!response.ok){
                    this.setState({apiResponse: 'Credentials don\'t match any of our records'});
                }
                else if(response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then((result) => {
                console.log(result);
                JWT = result.token;
                this.setState({complete: true});
                console.log(JWT);
                //ReactDOM.render(<Filter />, document.getElementById('root'));
            })
            .catch(function(error) {
                console.log("There has been a problem with your fetch operation: ",error.message);
            })
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        document.title = 'Login - QLD Crime';
    }

    render(){
        if(JWT !== undefined){
            //return <Redirect to={"/app"}/>
        }
        if(this.state.complete === true){
            return <Redirect to={"/app"}/>
        }

        return(
            <div className="central-div" id="central-div-id">
                <form className="form-container" onSubmit={this.handleSubmit}>
                    <h1>Login or Register</h1>
                    <label htmlFor="email"><b>Email</b></label>
                    <input type="text" value={this.state.email} onChange={this.handleInputChange} placeholder="Enter Email" name='email' required />

                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" value={this.state.psw} onChange={this.handleInputChange} placeholder="Enter Password" name='psw' required />

                    <button className="btn login" id="login">Login</button>
                </form>
                <p id="formResponse">{this.state.apiResponse}</p>
            </div>
        )
    }
}

function AppRouter(){
    return(
        <Router>
            <Route path="/" exact component={Landing} />
            <Route path="/register/" component={Register} />
            <Route path="/login/" component={Login} />
            <Route path='/app' component={App}/>
        </Router>
    )
}

function App(){
    if(JWT === undefined){
        return(<Redirect to={"/"}/>);
    }
    document.title = 'QLD Crime statistics';

    return(
        <div id={'app'}>
            <img height={100} alt={"https://www.business.qld.gov.au/__data/assets/image/0018/39303/qg-logo-white.png"} src={"https://www.business.qld.gov.au/__data/assets/image/0018/39303/qg-logo-white.png"} />
                <div className="flex-container" id="app-container">
                    <div className="flex-box" id={'flex-filters'}>
                        <div id="app-filters">
                            <SelectOptions/>
                        </div>
                    </div>
                    <div className="flex-box" id={'flex-visual'}>
                        <div id="app-visuals">
                        </div>
                    </div>
                </div>
        </div>
    )
}

ReactDOM.render(<AppRouter />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();