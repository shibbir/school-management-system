import React from "react";
import { Icon } from "semantic-ui-react";

export default function Footer() {
    return (
        <footer className="ui inverted vertical footer segment">
            <div className="ui center aligned container">
                <Icon name="copyright outline"/> School Management System 2021.
                Licensed under <a rel="license" href="https://opensource.org/licenses/MIT">MIT</a>.
            </div>
        </footer>
    );
}
