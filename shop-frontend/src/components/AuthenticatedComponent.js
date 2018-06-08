import React from 'react';
import {connect} from 'react-redux';

export default function requireAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {

        componentWillMount() {
            this.checkAuth()
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth()
        }

        checkAuth() {
            if (!this.props.isAuthenticated) {
                //todo: redirecting to login path when user is not logged in
                // let redirectAfterLogin = this.props.location.pathname;
                // this.props.dispatch(pushState(null, `/login?next=${redirectAfterLogin}`));
            }
        }

        render() {
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )

        }
    }

    const mapStateToProps = (state) => ({
        token: state.user.token,
        userName: state.user.userName,
        isAuthenticated: state.user.isAuthenticated
    });

    return connect(mapStateToProps)(AuthenticatedComponent);

}