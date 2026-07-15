import {

    createContext,

    useContext,

    useEffect,

    useState

} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const savedToken = localStorage.getItem("token");

        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {

            setToken(savedToken);

            setUser(JSON.parse(savedUser));

        }

        setLoading(false);

    }, []);

    // ===========================
    // Login
    // ===========================

    const login = (userData, accessToken) => {

        localStorage.setItem(

            "token",

            accessToken

        );

        localStorage.setItem(

            "user",

            JSON.stringify(userData)

        );

        setUser(userData);

        setToken(accessToken);

    };

    // ===========================
    // Logout
    // ===========================

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

        setToken(null);

    };

    // ===========================
    // Update User
    // ===========================

    const updateUser = (userData) => {

        localStorage.setItem(

            "user",

            JSON.stringify(userData)

        );

        setUser(userData);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                token,

                loading,

                login,

                logout,

                updateUser,

                isAuthenticated: !!token

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);