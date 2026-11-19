const { useState, useEffect } = React;
const EMPTY_USER = () => ({
    name: "", username: "", email: "", phone: "", website: "",
    address: { street: "", suite: "", city: "" }
});
function SearchForm({ onChangeValue }) {
    return (React.createElement("div", { className: "search-line" },
        React.createElement("label", { htmlFor: "keyword" }, "T\u00ECm ki\u1EBFm:"),
        React.createElement("input", { id: "keyword", type: "search", placeholder: "T\u00ECm theo t\u00EAn ho\u1EB7c username", onChange: (e) => onChangeValue(e.target.value) })));
}
function UserFields({ user, onChange }) {
    const inputs = [
        ["name", "Họ và tên *"], ["username", "Username *"],
        ["email", "Email"], ["street", "Đường"],
        ["suite", "Số nhà / phòng"], ["city", "Thành phố"],
        ["phone", "Số điện thoại"], ["website", "Website"]
    ];
    return (React.createElement("div", { className: "form-grid" }, inputs.map(([field, label]) => (React.createElement("label", { key: field, htmlFor: field },
        React.createElement("span", null, label),
        React.createElement("input", { id: field, type: field === "email" ? "email" : "text", value: ["street", "suite", "city"].includes(field) ? user.address[field] : user[field], onChange: (e) => onChange(field, e.target.value) }))))));
}
function AddUser({ onAdd }) {
    const [adding, setAdding] = useState(false);
    const [user, setUser] = useState(EMPTY_USER);
    const [error, setError] = useState("");
    function handleChange(field, value) {
        if (["street", "suite", "city"].includes(field)) {
            setUser(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        }
        else {
            setUser(prev => ({ ...prev, [field]: value }));
        }
    }
    function submit(e) {
        e.preventDefault();
        if (!user.name.trim() || !user.username.trim()) {
            setError("Vui lòng nhập Họ và tên và Username.");
            return;
        }
        onAdd({ ...user, name: user.name.trim(), username: user.username.trim() });
        setUser(EMPTY_USER());
        setAdding(false);
        setError("");
    }
    function cancel() { setAdding(false); setError(""); }
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { onClick: () => setAdding(true) }, "+ Th\u00EAm ng\u01B0\u1EDDi d\u00F9ng"),
        adding && (React.createElement("div", { className: "overlay", role: "presentation", onMouseDown: (e) => { if (e.target === e.currentTarget)
                cancel(); } },
            React.createElement("div", { className: "dialog", role: "dialog", "aria-modal": "true", "aria-label": "Th\u00EAm ng\u01B0\u1EDDi d\u00F9ng" },
                React.createElement("h2", null, "Th\u00EAm ng\u01B0\u1EDDi d\u00F9ng"),
                React.createElement("form", { onSubmit: submit },
                    React.createElement(UserFields, { user: user, onChange: handleChange }),
                    error && React.createElement("p", { role: "alert", className: "error" }, error),
                    React.createElement("div", { className: "actions" },
                        React.createElement("button", { type: "submit" }, "L\u01B0u"),
                        React.createElement("button", { type: "button", onClick: cancel }, "H\u1EE7y"))))))));
}
const FALLBACK_USERS = [
    { id: 1, name: "Nguyễn Văn An", username: "an.nv", email: "an@example.com", address: { street: "Đại Cồ Việt", suite: "1", city: "Hà Nội" }, phone: "0900000001", website: "" },
    { id: 2, name: "Trần Thị Bình", username: "binh.tt", email: "binh@example.com", address: { street: "Trần Đại Nghĩa", suite: "2", city: "Hà Nội" }, phone: "0900000002", website: "" },
    { id: 3, name: "Lê Minh Châu", username: "chau.lm", email: "chau@example.com", address: { street: "Giải Phóng", suite: "3", city: "Hà Nội" }, phone: "0900000003", website: "" }
];
function ResultTable({ keyword, user, onAdded }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState("");
    const [editing, setEditing] = useState(null);
    const [editError, setEditError] = useState("");
    useEffect(() => {
        let active = true;
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(response => { if (!response.ok)
            throw new Error(`HTTP ${response.status}`); return response.json(); })
            .then(data => { if (active) {
            setUsers(data);
            setInfo(`Đã tải ${data.length} người dùng từ API (thao tác CRUD chỉ thay đổi dữ liệu trên trang).`);
        } })
            .catch(() => { if (active) {
            setUsers(FALLBACK_USERS);
            setInfo("Không kết nối được API, hiện đang dùng 3 bản ghi mẫu để thử CRUD.");
        } })
            .finally(() => { if (active)
            setLoading(false); });
        return () => { active = false; };
    }, []);
    useEffect(() => {
        if (!user)
            return;
        setUsers(prev => [...prev, { ...user, address: { ...user.address }, id: prev.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) + 1 }]);
        onAdded();
    }, [user, onAdded]);
    function editUser(currentUser) {
        setEditError("");
        setEditing({ ...currentUser, address: { ...currentUser.address } });
    }
    function handleEditChange(field, value) {
        if (["street", "suite", "city"].includes(field)) {
            setEditing(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        }
        else {
            setEditing(prev => ({ ...prev, [field]: value }));
        }
    }
    function saveUser(e) {
        e.preventDefault();
        if (!editing.name.trim() || !editing.username.trim()) {
            setEditError("Họ và tên và Username không được để trống.");
            return;
        }
        setUsers(prev => prev.map(u => u.id === editing.id ? { ...editing } : u));
        setEditing(null);
    }
    function removeUser(id) { setUsers(prev => prev.filter(u => u.id !== id)); }
    const q = keyword.toLocaleLowerCase("vi").trim();
    const filteredUsers = users.filter(u => (u.name || "").toLocaleLowerCase("vi").includes(q) ||
        (u.username || "").toLocaleLowerCase("vi").includes(q));
    return (React.createElement("section", null,
        React.createElement("p", { className: "muted", "aria-live": "polite" }, loading ? "Đang tải dữ liệu..." : info),
        React.createElement("p", null,
            "Hi\u1EC3n th\u1ECB ",
            filteredUsers.length,
            "/",
            users.length,
            " ng\u01B0\u1EDDi d\u00F9ng"),
        React.createElement("div", { className: "table-scroll" },
            React.createElement("table", null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "ID"),
                        React.createElement("th", null, "H\u1ECD v\u00E0 t\u00EAn"),
                        React.createElement("th", null, "Username"),
                        React.createElement("th", null, "Email"),
                        React.createElement("th", null, "\u0110\u1ECBa ch\u1EC9"),
                        React.createElement("th", null, "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"),
                        React.createElement("th", null, "Thao t\u00E1c"))),
                React.createElement("tbody", null,
                    filteredUsers.map(u => (React.createElement("tr", { key: u.id },
                        React.createElement("td", null, u.id),
                        React.createElement("td", null, u.name),
                        React.createElement("td", null, u.username),
                        React.createElement("td", null, u.email || ""),
                        React.createElement("td", null, [u.address?.street, u.address?.suite, u.address?.city].filter(Boolean).join(", ")),
                        React.createElement("td", null, u.phone || ""),
                        React.createElement("td", { className: "action-cell" },
                            React.createElement("button", { onClick: () => editUser(u) }, "S\u1EEDa"),
                            React.createElement("button", { onClick: () => removeUser(u.id) }, "X\u00F3a"))))),
                    !loading && filteredUsers.length === 0 && (React.createElement("tr", null,
                        React.createElement("td", { colSpan: "7", className: "empty" }, "Kh\u00F4ng c\u00F3 ng\u01B0\u1EDDi d\u00F9ng ph\u00F9 h\u1EE3p.")))))),
        editing && (React.createElement("div", { className: "overlay", role: "presentation", onMouseDown: (e) => { if (e.target === e.currentTarget)
                setEditing(null); } },
            React.createElement("div", { className: "dialog", role: "dialog", "aria-modal": "true", "aria-label": "S\u1EEDa ng\u01B0\u1EDDi d\u00F9ng" },
                React.createElement("h2", null,
                    "S\u1EEDa ng\u01B0\u1EDDi d\u00F9ng #",
                    editing.id),
                React.createElement("form", { onSubmit: saveUser },
                    React.createElement(UserFields, { user: editing, onChange: handleEditChange }),
                    editError && React.createElement("p", { role: "alert", className: "error" }, editError),
                    React.createElement("div", { className: "actions" },
                        React.createElement("button", { type: "submit" }, "L\u01B0u thay \u0111\u1ED5i"),
                        React.createElement("button", { type: "button", onClick: () => setEditing(null) }, "H\u1EE7y"))))))));
}
function App() {
    const [kw, setKeyword] = useState("");
    const [newUser, setNewUser] = useState(null);
    const acknowledgeAdded = React.useCallback(() => setNewUser(null), []);
    return (React.createElement("main", null,
        React.createElement("h1", null, "Qu\u1EA3n l\u00FD ng\u01B0\u1EDDi d\u00F9ng"),
        React.createElement("div", { className: "toolbar" },
            React.createElement(SearchForm, { onChangeValue: setKeyword }),
            React.createElement(AddUser, { onAdd: setNewUser })),
        React.createElement(ResultTable, { keyword: kw, user: newUser, onAdded: acknowledgeAdded }),
        React.createElement("p", { className: "footnote" }, "B\u00E0i th\u1EF1c h\u00E0nh React CRUD - D\u1EEF li\u1EC7u t\u1EEB JSONPlaceholder. Thay \u0111\u1ED5i ch\u1EC9 \u0111\u01B0\u1EE3c l\u01B0u trong phi\u00EAn \u0111ang m\u1EDF.")));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
