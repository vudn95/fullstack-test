import { useAuth } from "../../AuthContext";

function Component() {
  const { user } = useAuth();

  return (
    <div className="Component">{user && <p>{JSON.stringify(user)}</p>}</div>
  );
}

export default Component;
