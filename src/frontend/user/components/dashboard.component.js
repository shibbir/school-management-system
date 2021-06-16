import React from "react";

import Admin from "./admin.component";
import Teacher from "./teacher.component";
import Pupil from "./pupil.component";

export default function Dashboard() {
    return (
        <>
            <Admin/>
            <Teacher/>
            <Pupil/>
        </>
    );
}
