import { useState } from "react";

export default function Footer() {
    let today = new Date()
    const [year] = useState(today.getFullYear())

    return (
        <footer className="footer">
            <div id="fo1">
                Using{" "}
                <a href="https://p.nomics.com/cryptocurrency-bitcoin-api">
                    Nomics API
                </a>
            </div>
            <div id="fo2">Created by @gregovilardo</div>
            <div id="fo3">En-Es</div>
            <div id="fo4">Help</div>
            <div id="fo5">Terms of use</div>
            <div id="fo6">© {year} XLSXTracker</div>
        </footer>
    );
}
