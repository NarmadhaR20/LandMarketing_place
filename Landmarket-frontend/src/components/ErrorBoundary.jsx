import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught an error", error, info);
        this.setState({ info });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'red', background: 'white', zIndex: 9999, position: 'relative' }}>
                    <h2>Component Crashed</h2>
                    <p>{this.state.error?.toString()}</p>
                    <pre>{this.state.info?.componentStack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}
