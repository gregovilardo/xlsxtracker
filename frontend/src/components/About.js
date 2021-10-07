import React, { useContext } from "react";
import { UserContext } from "./UserContext";

export function About() {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <h2>About</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {user ? (
        <button
          onClick={() => {
            // call logout
            setUser(null);
          }}
        >
          logout
        </button>
      ) : (
        <button
          onClick={async () => {
            const user = "grego"
            setUser(user);
          }}
        >
          login
        </button>
      )}
    </div>
  );
}