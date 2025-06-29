"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";
import { useUser } from "../../context/UserContext";
import { verifyUserApiHandler } from "./verifyUserApiHandler";

interface WithAuthProps {}

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const { setUserData } = useUser();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem("token");

          const userString = localStorage.getItem("user");

          if (!userString || !token) {
            router.push("/login");
            return;
          }

          const parsedUser = JSON.parse(userString);

          const valid = await verifyUserApiHandler(token);

          if (!valid) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }

          setUserData(parsedUser);
          setAuthenticated(true);
        } catch (err) {
          localStorage.removeItem("user");
          router.push("/login");
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router, setUserData]);

    if (loading) {
      return null; // todo add loading
    }

    if (!authenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
