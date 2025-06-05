import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
export function Tabs({ labels, children }) {
    const [active, setActive] = React.useState(0);
    return (_jsxs("div", { children: [_jsx("div", { className: "flex space-x-4 border-b", children: labels.map((label, index) => (_jsx("button", { className: `pb-2 px-4 text-sm font-medium ${active === index ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`, onClick: () => setActive(index), children: label }, label))) }), _jsx("div", { className: "mt-4", children: children[active] })] }));
}
