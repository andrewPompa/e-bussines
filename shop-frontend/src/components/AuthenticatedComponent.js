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
                this.props.history.go('/github/login');
            }
        }

        render() {
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : ''
                    }
                </div>
            )

        }
    }

    const mapStateToProps = (state) => ({
        userName: state.user.userName,
        isAuthenticated: state.user.isAuthenticated
    });

    return connect(mapStateToProps)(AuthenticatedComponent);

}