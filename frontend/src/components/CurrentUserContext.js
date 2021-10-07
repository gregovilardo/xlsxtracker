import React from "react";

export const CurrentUserContext = React.createContext();

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = React.useState({});

    const saveCurrentUser = (id, token, username, email) => {
        setCurrentUser({
            id: id,
            token: token,
            username: username,
            email: email,
        });
    };

    return (
        <CurrentUserContext.Provider value={{ currentUser, saveCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

export const useCurrentUser = () => React.useContext(CurrentUserContext);
