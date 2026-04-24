import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
    const { pathname } = useLocation();

    // scroll to top of page on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
