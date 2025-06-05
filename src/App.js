import { jsx as _jsx } from "react/jsx-runtime";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WhatsAppIntegration from './components/WhatsAppIntegration';
function App() {
    return (_jsx(Router, { children: _jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx(WhatsAppIntegration, {}) }) }) }));
}
export default App;
